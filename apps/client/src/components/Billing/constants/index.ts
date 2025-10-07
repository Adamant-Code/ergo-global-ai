export const plans = [
  {
    price: "$10",
    name: "Basic",
    amount: 1000, // Amount in cents
    features: [
      "5 Projects",
      "Email Support",
      "Access to basic features",
    ],
    priceId: process.env.NEXT_PUBLIC_BASIC_PLAN_PRICE_ID!,
  },
  {
    price: "$20",
    name: "Premium",
    amount: 2000, // Amount in cents
    features: [
      "Priority Support",
      "Unlimited Projects",
      "Access to premium features",
    ],
    priceId: process.env.NEXT_PUBLIC_PREMIUM_PLAN_PRICE_ID!,
  },
];
