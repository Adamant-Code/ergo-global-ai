import {
  handlePaymentFailedEvent,
  handleCustomerCreatedEvent,
  handlePaymentSucceededEvent,
  getSubscriptionIdFromInvoice,
  handleSubscriptionUpdateEvent,
  handleSubscriptionCreatedEvent,
  handleSubscriptionDeletedEvent,
} from "./utils/stripe.js";
import debugLib from "debug";
import { Stripe } from "stripe";
import stripe from "@/lib/stripe.js";
import { Request, Response } from "express";
import { Subscription } from "@/models/Subscription.js";
import { SubscriptionEvent } from "@/models/SubscriptionEvent.js";

const debug = debugLib("server:routes:stripe:webhook:webhook");

async function handleWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (!sig) {
      debug("Missing Stripe signature header");
      res.status(400).send("Missing Stripe signature header");
      return;
    }

    if (!webhookSecret) {
      debug("STRIPE_WEBHOOK_SECRET is not defined");
      res
        .status(500)
        .send("Internal Server Error: Webhook secret not configured");
      return;
    }

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
  } catch (error) {
    debug("Webhook signature verification failed");
    res
      .status(400)
      .send(
        `Webhook Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    return;
  }

  // Check if we've already processed this event (idempotency)
  const existingEvent = await SubscriptionEvent.query()
    .where({ stripe_event_id: event.id })
    .first();

  if (existingEvent) {
    debug("Event already processed:", event.id);
    res.json({ received: true });
    return;
  }

  let subscriptionId: string | null = null;
  let eventObject: any = event.data.object;

  // Process based on event type
  try {
    switch (event.type) {
      case "customer.created":
        const customer = eventObject as Stripe.Customer;
        await handleCustomerCreatedEvent({
          customerId: customer.id,
          userId: customer.metadata.user_id,
        });
        break;

      case "customer.subscription.created":
        const createdSubscription =
          eventObject as Stripe.Subscription;
        subscriptionId = createdSubscription.id;
        await handleSubscriptionCreatedEvent(createdSubscription);
        break;

      case "invoice.payment_succeeded":
        const succeededInvoice = eventObject as Stripe.Invoice;
        const status = succeededInvoice.status;
        subscriptionId = getSubscriptionIdFromInvoice(
          succeededInvoice
        ) as string;
        await handlePaymentSucceededEvent({ subscriptionId, status });
        break;

      case "customer.subscription.updated":
        const updatedSubscription =
          eventObject as Stripe.Subscription;
        subscriptionId = updatedSubscription.id;
        await handleSubscriptionUpdateEvent(updatedSubscription);
        break;

      case "customer.subscription.deleted":
        const deletedSubscription =
          eventObject as Stripe.Subscription;
        subscriptionId = deletedSubscription.id;
        await handleSubscriptionDeletedEvent(deletedSubscription);
        break;

      case "invoice.payment_failed":
        const failedInvoice = eventObject as Stripe.Invoice;
        subscriptionId = getSubscriptionIdFromInvoice(
          failedInvoice
        ) as string;
        await handlePaymentFailedEvent(failedInvoice);
        break;

      default:
        debug(`Unhandled event type: ${event.type} - ${event.id}`);
        break;
    }

    try {
      let subId = null;
      if (subscriptionId) {
        const localSub = await Subscription.query().findOne({
          stripe_subscription_id: subscriptionId,
        });
        subId = localSub?.id || null;
      }

      await SubscriptionEvent.query().insert({
        event_type: event.type,
        subscription_id: subId,
        stripe_event_id: event.id,
        payload: event.data.object,
        created_at: new Date(event.created * 1000).toISOString(),
      });

      debug(`Logged event ${event.id} to database`);
    } catch (error) {
      debug("Failed to log event to database", {
        error,
        eventId: event.id,
      });
      console.error("Event logging error:", error);
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    debug("Error processing webhook", { error });
    res
      .status(500)
      .send(
        `Webhook Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    return;
  }

  res.json({ received: true });
}

export default handleWebhook;
