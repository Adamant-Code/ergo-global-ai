// External Deps
import debugLib from "debug";
import {
  ForgotPasswordInput,
  ForgotPasswordResponse,
} from "@request-response/types";
import { randomBytes } from "crypto";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Deps
import { User } from "@/models/User.js";
import redisClient from "@/config/redis.js";
import { REDIS_PREFIXES, TOKEN_EXPIRY } from "@/constants/index.js";

const debug = debugLib("server/routes:auth/password");

const forgotPassword = asyncHandler(
  async (
    req: Request<{}, {}, ForgotPasswordInput>,
    res: Response
  ) => {
    const { email } = req.body;

    const user = await User.query().findOne({ email });

    const forgotPasswordMessage = {
      message: "If email exists, a reset link has been sent.",
    } as ForgotPasswordResponse;

    if (!user) {
      debug(`No user found for forgot-password: ${email}`);
      res.status(200).json(forgotPasswordMessage);
    } else {
      const resetToken = randomBytes(32).toString("hex");
      const key = `${REDIS_PREFIXES.RESET_TOKEN}${resetToken}`;

      // Store reset token in red
      await redisClient.set(key, user.id, {
        EX: TOKEN_EXPIRY.ACCESS_TOKEN,
      });

      debug(`Reset token for ${email}: ${resetToken}`);

      // TODO: Send an email with the reset link
      // e.g., `https://monorepo-template.com/reset-password?token=${resetToken}`
      res.status(200).json(forgotPasswordMessage);
    }
  }
);

export default forgotPassword;
