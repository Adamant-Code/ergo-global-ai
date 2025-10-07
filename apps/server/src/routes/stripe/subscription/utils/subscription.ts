import Stripe from "stripe";

export const getCustomerIdFromSubscription = (
  subscription: Stripe.Response<Stripe.PaymentMethod>
): string | null => {
  if (
    subscription.customer &&
    typeof subscription.customer === "string"
  )
    return subscription.customer;

  if (
    subscription.customer &&
    typeof subscription.customer === "object"
  )
    return subscription.customer.id || null;

  return null;
};
