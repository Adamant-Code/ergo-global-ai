// External Deps
import bcrypt from "bcrypt";
import debugLib from "debug";
import {
  ResetPasswordInput,
  ResetPasswordResponse,
} from "@request-response/types";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Deps
import { User } from "@/models/User.js";
import redisClient from "@/config/redis.js";
import { REDIS_PREFIXES } from "@/constants/index.js";
import { InvalidCredentialsError } from "@/errors/index.js";
import { revokeAllTokens } from "@/utils/routes/auth/tokens.js";

const debug = debugLib("server/routes:auth/reset-password");

const resetPassword = asyncHandler(
  async (req: Request<{}, {}, ResetPasswordInput>, res: Response) => {
    const { token, password } = req.body;
    const userId = await redisClient.get(`reset:${token}`);

    if (!userId)
      throw new InvalidCredentialsError(
        "Invalid or expired reset token"
      );

    const user = await User.query().findOne({ id: userId });

    if (!user) throw new InvalidCredentialsError("User not found");

    user.password = await bcrypt.hash(password, 10);

    // Delete reset token from Redis
    await redisClient.del(`${REDIS_PREFIXES.RESET_TOKEN}${token}`);

    // Revoke all logged in sessions
    await revokeAllTokens(userId);

    //TODO: Send an email to inform user password has been reset
    const response = {
      message: "Password reset was successful",
    } as ResetPasswordResponse;

    debug(`Password reset successful: ${user.email}`);
    res.status(200).json(response);
  }
);

export default resetPassword;
