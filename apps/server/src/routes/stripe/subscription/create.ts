import debugLib from "debug";
import stripe from "@/lib/stripe.js";
import { User } from "@/models/User.js";
import { Request, Response } from "express";
import { ApiError } from "@/errors/ApiError.js";
import asyncHandler from "express-async-handler";
import { Subscription } from "@/models/Subscription.js";
import { NotFoundError } from "@/errors/NotFoundError.js";
import { ValidationError } from "@/errors/ValidationError.js";
import { InvalidCredentialsError } from "@/errors/AuthError.js";
import { getCustomerIdFromSubscription } from "./utils/subscription.js";

const debug = debugLib("server:routes:stripe:subscription:create");

const createSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user)
      throw new InvalidCredentialsError("Authentication required");

    const userId = req.user.userId;
    const { priceId, paymentMethodId } = req.body;

    if (!priceId || !paymentMethodId)
      throw new ValidationError(
        "Price ID and Payment Method ID are required"
      );

    const allowedPrices = [
      process.env.STRIPE_BASIC_PLAN_PRICE_ID,
      process.env.STRIPE_PREMIUM_PLAN_PRICE_ID,
    ];

    if (!allowedPrices.includes(priceId))
      throw new ValidationError("Invalid price ID");

    const userData = await User.query().findById(userId);

    if (!userData) {
      debug("User not found", { userId });
      throw new NotFoundError("User not found");
    }

    const existingSubscription = await Subscription.query()
      .where({ user_id: userId, status: "active" })
      .first();

    if (existingSubscription)
      throw new ApiError(
        "User already has an active subscription",
        400,
        "ACTIVE_SUBSCRIPTION_EXISTS"
      );

    let customerId = userData.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userData.email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
        metadata: { user_id: userId.toString() },
      });
      customerId = customer.id;
    } else {
      const paymentMethod = await stripe.paymentMethods.retrieve(
        paymentMethodId
      );
      const customer = getCustomerIdFromSubscription(paymentMethod);
      if (customer !== customerId)
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customerId,
        });
      await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      metadata: { user_id: userId.toString() },
      expand: ["latest_invoice.confirmation_secret"],
      payment_settings: {
        save_default_payment_method: "on_subscription",
      },
    });

    let clientSecret: string | null = null;
    const { latest_invoice } = subscription;

    if (latest_invoice !== null && typeof latest_invoice === "object")
      clientSecret =
        latest_invoice.confirmation_secret?.client_secret || null;

    res.json({ clientSecret: clientSecret });
  }
);

export default createSubscription;
