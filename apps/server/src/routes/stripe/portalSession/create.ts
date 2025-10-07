import stripe from "@/lib/stripe.js";
import { User } from "@/models/User.js";
import { Request, Response } from "express";
import { ApiError } from "@/errors/ApiError.js";
import asyncHandler from "express-async-handler";
import { InvalidCredentialsError } from "@/errors/AuthError.js";

const createPortalSession = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user)
      throw new InvalidCredentialsError("Authentication required");
    
    const userData = await User.query().findById(req.user.userId);

    if (!userData?.stripe_customer_id) {
      const message = "Stripe customer ID not found for user";
      throw new ApiError(message, 404, "STRIPE_CUSTOMER_NOT_FOUND");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/billing`,
    });

    res.json({ url: portalSession.url });
  }
);

export default createPortalSession;
