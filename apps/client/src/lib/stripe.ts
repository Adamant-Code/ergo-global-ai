import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!publicKey) {
      throw new Error("Missing Stripe Publishable Key");
    }
    stripePromise = loadStripe(publicKey);
  }
  return stripePromise;
};
