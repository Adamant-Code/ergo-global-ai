import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_TEST_KEY) {
  throw new Error(
    "STRIPE_SECRET_KEY is not defined in environment variables"
  );
}
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST_KEY, {
  // @ts-ignore
  apiVersion: "2025-06-30.basil",
});

export default stripe;
