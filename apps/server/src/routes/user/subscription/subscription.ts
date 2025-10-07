import { Request, Response } from "express";
import { ApiError } from "@/errors/ApiError.js";
import asyncHandler from "express-async-handler";
import { Subscription } from "@/models/Subscription.js";
import { InvalidCredentialsError } from "@/errors/AuthError.js";

const getSubscription = asyncHandler(
  async (req: Request, res: Response) => {
    const { user } = req;

    if (!user)
      throw new InvalidCredentialsError("Authentication required");

    const subscription = await Subscription.query()
      .where({ user_id: user.userId })
      .whereIn("status", ["active", "trialing", "past_due"])
      .orderBy("current_period_end", "desc")
      .first();

    if (!subscription) {
      const message = "No active subscription found for user";
      throw new ApiError(message, 200, "SUBSCRIPTION_NOT_FOUND");
    } else res.status(200).json({ subscription });
  }
);

export default getSubscription;
