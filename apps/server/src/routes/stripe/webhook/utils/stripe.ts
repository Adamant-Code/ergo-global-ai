import Stripe from "stripe";
import debugLib from "debug";
import { User } from "@/models/User.js";
import { Subscription } from "@/models/Subscription.js";

const debug = debugLib("server:routes:stripe:webhook:utils:stripe");

export const getSubscriptionIdFromInvoice = (
  invoice: Stripe.Invoice
) => {
  const subscription =
    invoice.parent?.subscription_details?.subscription;

  if (subscription && typeof subscription === "string") {
    return subscription;
  } else if (
    subscription &&
    subscription !== null &&
    typeof subscription === "object"
  ) {
    return subscription.id;
  } else {
    debug("No valid subscription ID found in invoice");
    return;
  }
};

export async function handleSubscriptionCreatedEvent(
  createdSubscription: Stripe.Subscription
): Promise<void> {
  try {
    const existingSubscription = await Subscription.query()
      .where("stripe_subscription_id", createdSubscription.id)
      .first();

    if (existingSubscription) {
      console.log(
        `Subscription ${createdSubscription.id} already exists, skipping creation`
      );
      return;
    }

    const subscriptionData = {
      status: createdSubscription.status,
      stripe_subscription_id: createdSubscription.id,
      user_id: createdSubscription.metadata.user_id,
      stripe_price_id: createdSubscription.items.data[0].price.id,
      current_period_end: new Date(
        createdSubscription.items.data[0].current_period_end * 1000
      ).toISOString(),
      current_period_start: new Date(
        createdSubscription.items.data[0].current_period_start * 1000
      ).toISOString(),
    };

    const result = await Subscription.query().insert(
      subscriptionData
    );

    debug(`Created subscription ${createdSubscription.id}`);
  } catch (error) {
    debug("Error saving subscription to database:", error);
    throw error;
  }
}

export async function handleSubscriptionUpdateEvent(
  updatedSubscription: Stripe.Subscription
): Promise<void> {
  try {
    // Check if subscription exists first
    const existingSubscription = await Subscription.query()
      .where("stripe_subscription_id", updatedSubscription.id)
      .first();

    if (!existingSubscription) {
      console.log(
        `Subscription ${updatedSubscription.id} not found, creating it`
      );
      await handleSubscriptionCreatedEvent(updatedSubscription);
      return;
    }

    const updateData = {
      status: updatedSubscription.status,
      stripe_price_id: updatedSubscription.items.data[0].price.id,
      current_period_end: new Date(
        updatedSubscription.items.data[0].current_period_end * 1000
      ).toISOString(),
      current_period_start: new Date(
        updatedSubscription.items.data[0].current_period_start * 1000
      ).toISOString(),
    };

    await Subscription.query()
      .where("stripe_subscription_id", updatedSubscription.id)
      .patch(updateData);

    // TODO: Send email informing user when subscription would be cancelled
    if (updatedSubscription.cancel_at_period_end) {
      debug("Email sent for cancelled subscription");
    }
  } catch (error) {
    debug("Error handling subscription update:", error);
    throw error;
  }
}

export async function handleSubscriptionDeletedEvent(
  subscription: Stripe.Subscription
): Promise<void> {
  try {
    await Subscription.query()
      .where({ stripe_subscription_id: subscription.id })
      .update({
        status: subscription.status || "canceled",
      });
    debug(`Marked subscription ${subscription.id} as canceled`);
  } catch (error) {
    debug("Error handling subscription deletion:", error);
  }
}

export async function handlePaymentFailedEvent(
  invoice: Stripe.Invoice
): Promise<void> {
  try {
    let subscriptionId = getSubscriptionIdFromInvoice(invoice);

    if (!subscriptionId) {
      debug("No subscription ID found in invoice");
      return;
    }

    await Subscription.query()
      .where({ stripe_subscription_id: subscriptionId })
      .patch({ status: invoice.status || "past_due" });

    debug(
      `Marked subscription ${subscriptionId} as past_due due to payment failure`
    );
  } catch (error) {
    debug("Error handling payment failure:", error);
  }
}

export async function handlePaymentSucceededEvent({
  status,
  subscriptionId,
}: {
  subscriptionId: string;
  status: Stripe.Invoice.Status | null;
}): Promise<void> {
  try {
    if (!subscriptionId) {
      debug("No subscription ID found in invoice");
      return;
    }

    if (!status) {
      debug("No status found in invoice");
      return;
    }

    await Subscription.query()
      .where({ stripe_subscription_id: subscriptionId })
      .patch({ status: "active" });

    debug(
      `Marked subscription ${subscriptionId} as active due to payment success`
    );
  } catch (error) {
    debug("Error handling payment success:", error);
  }
}

export async function handleTrialEnding(
  subscription: Stripe.Subscription
): Promise<void> {
  try {
    // Optionally notify user (e.g., via email or queue)
    debug(`Trial ending soon for subscription ${subscription.id}`);

    // You could add email notification logic here
    // or queue a job to send notification

    // No database update needed unless you want to track trial end notifications
  } catch (error) {
    debug("Error handling trial ending:", error);
  }
}

export async function handleCustomerCreatedEvent({
  userId,
  customerId,
}: {
  userId: string;
  customerId: string;
}) {
  if (!userId || !customerId) {
    debug("Invalid userId or customerId for customer.created event");
    return;
  }

  try {
    await User.query()
      .findById(userId)
      .patch({ stripe_customer_id: customerId });
    debug(`Created Stripe customer ${customerId} for user ${userId}`);
  } catch (error) {
    debug("Error associating Stripe customer with user:", error);
  }
}
