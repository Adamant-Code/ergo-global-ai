// External Deps
import debugLib from "debug";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RefreshTokenInput } from "@request-response/types";

// Internal Deps
import {
  InvalidTokenError,
  InvalidCredentialsError,
} from "@/errors/index.js";
import {
  TOKEN_EXPIRY,
  COOKIE_OPTIONS,
  REDIS_PREFIXES,
} from "@/constants/index.js";
import { User } from "@/models/User.js";
import redisClient from "@/config/redis.js";
import { IpAndUserAgentProps } from "@/types/auth/index.js";
import { createAuthTokens } from "@/utils/routes/auth/tokens.js";
import { authTokenStore } from "@/utils/routes/auth/tokenStore.js";

const debug = debugLib("server/routes:auth/refresh-token");

const refreshToken = asyncHandler(
  async (req: Request<{}, {}, RefreshTokenInput>, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const ipAndUserAgent: IpAndUserAgentProps = {
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
    };
    if (!refreshToken)
      throw new InvalidCredentialsError("Refresh token required");

    const userId = await verifyRefreshToken(
      refreshToken,
      ipAndUserAgent.ipAddress
    );

    if (!userId)
      throw new InvalidCredentialsError(
        "Invalid or revoked refresh token"
      );

    const user = await User.query().findOne({ id: userId });

    if (!user) throw new InvalidCredentialsError("User not found");

    const { refreshToken: newRefreshToken, accessTokenResult } =
      await createAuthTokens(userId, user.email, ipAndUserAgent);

    debug(`Access token: ${accessTokenResult} sent`);

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    res.status(201).json(accessTokenResult);
  }
);

const verifyRefreshToken = async (
  refreshToken: string,
  ipAddress?: string
): Promise<string | null> => {
  try {
    const tokenData = await authTokenStore.getRefreshTokenData(
      refreshToken
    );

    if (!tokenData) {
      debug(`Refresh token not found or expired: ${refreshToken}`);
      return null;
    }

    const isBlacklisted = await authTokenStore.isTokenBlacklisted(
      refreshToken
    );

    if (isBlacklisted) {
      debug(`Refresh token blacklisted: ${refreshToken}`);
      return null;
    }

    // Update last used timestamp and IP
    tokenData.lastUsed = Date.now();
    tokenData.ipAddress = ipAddress;

    // Update the token metadata in Redis
    const key = `${REDIS_PREFIXES.REFRESH_TOKEN}${refreshToken}`;
    const userKey = `${REDIS_PREFIXES.USER_TOKENS}${tokenData.userId}:tokens`;

    await redisClient
      .multi()
      .set(key, JSON.stringify(tokenData), {
        EX: TOKEN_EXPIRY.REFRESH_TOKEN,
      })
      .sAdd(userKey, refreshToken)
      .exec();

    debug(`Refresh token used by user ${tokenData.userId}`);

    return tokenData.userId;
  } catch (error) {
    debug(`Failed to store refresh token ${refreshToken}:`, error);
    throw new InvalidTokenError("Redis transaction failed");
  }
};

export default refreshToken;
