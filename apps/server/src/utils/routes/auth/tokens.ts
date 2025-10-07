// External Deps
import "dotenv/config";
import debugLib from "debug";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

// Internal Deps
import {
  TokenMetadata,
  IpAndUserAgentProps,
} from "@/types/auth/index.js";
import redisClient from "@/config/redis.js";
import { authTokenStore } from "./tokenStore.js";
import { InvalidTokenError } from "@/errors/index.js";
import { AccessTokenResponse } from "@request-response/types";
import { REDIS_PREFIXES, TOKEN_EXPIRY } from "@/constants/index.js";

const debug = debugLib("server/utils:routes/auth/authTokenStore");

export const createAuthTokens = async (
  id: string,
  email: string,
  ipAndUserAgent: IpAndUserAgentProps
) => {
  // Generate access token
  const secret = process.env.JWT_SECRET!;

  if (!secret)
    throw new Error(
      "JWT_SECRET is not defined in environment variables"
    );

  const accessToken = jwt.sign({ id }, secret, {
    expiresIn: TOKEN_EXPIRY.ACCESS_TOKEN,
  } as jwt.SignOptions);

  const refreshToken = randomBytes(32).toString("hex");

  const metadata: TokenMetadata = {
    userId: id,
    lastUsed: Date.now(),
    createdAt: Date.now(),
    ...ipAndUserAgent,
  };

  await Promise.all([
    addRefreshTokenToUserSet(id, refreshToken),
    storeRefreshToken(refreshToken, metadata),
  ]);

  debug(`Stored refresh token for user ${id}: ${refreshToken}`);

  const accessTokenResult: AccessTokenResponse = {
    id,
    email,
    accessToken,
  };
  return { refreshToken, accessTokenResult };
};

export const revokeAllTokens = async (userId: string) => {
  try {
    const tokens = await redisClient.sMembers(
      `${REDIS_PREFIXES.USER_TOKENS}${userId}:tokens`
    );

    // Revoke all tokens for user
    for (const token of tokens) {
      await Promise.all([
        deleteRefreshToken(token),
        authTokenStore.blacklistToken(token, "refresh"),
      ]);
    }
    // Clear the Redis set
    const key = `${REDIS_PREFIXES.USER_TOKENS}${userId}:tokens`;
    await redisClient.del(key);
  } catch (error) {
    debug(`Failed to delete token set for user ${userId}:`, error);
    throw new InvalidTokenError("Failed to revoke token(s)");
  }
};

export const revokeAccessToken = async (accessToken: string) => {
  await authTokenStore.blacklistToken(accessToken, "access");
};

export const revokeRefreshToken = async (
  refreshToken: string
): Promise<void> => {
  const tokenData = await authTokenStore.getRefreshTokenData(
    refreshToken
  );
  if (tokenData) {
    const { userId } = tokenData;
    await Promise.all([
      deleteRefreshToken(refreshToken),
      authTokenStore.blacklistToken(refreshToken, "refresh"),
      removeRefreshTokenFromUserSet(userId, refreshToken),
    ]);

    debug(
      `Revoked refresh token: ${refreshToken} for userId: ${userId}`
    );
  }
};

/********************************************************************
 * HELPERS
 *******************************************************************/

const deleteRefreshToken = async (
  refreshToken: string
): Promise<void> => {
  const key = `${REDIS_PREFIXES.REFRESH_TOKEN}${refreshToken}`;
  try {
    await redisClient.del(key);
  } catch (error) {
    debug(`Failed to delete refresh token ${refreshToken}:`, error);
    throw new InvalidTokenError("Redis operation failed");
  }
};

const removeRefreshTokenFromUserSet = async (
  userId: string,
  refreshToken: string
): Promise<void> => {
  const key = `${REDIS_PREFIXES.USER_TOKENS}${userId}:tokens`;
  try {
    await redisClient.sRem(key, refreshToken);
  } catch (error) {
    debug(
      `Failed to remove refresh token for user ${userId}:`,
      error
    );
    throw new InvalidTokenError("Redis operation failed");
  }
};

const addRefreshTokenToUserSet = async (
  userId: string,
  refreshToken: string
): Promise<void> => {
  const key = `${REDIS_PREFIXES.USER_TOKENS}${userId}:tokens`;
  try {
    await redisClient.sAdd(key, refreshToken);
  } catch (error) {
    debug(`Failed to add refresh token for user ${userId}:`, error);
    throw new InvalidTokenError("Redis operation failed");
  }
};

const storeRefreshToken = async (
  refreshToken: string,
  metadata: TokenMetadata
): Promise<void> => {
  const key = `${REDIS_PREFIXES.REFRESH_TOKEN}${refreshToken}`;
  const userKey = `${REDIS_PREFIXES.USER_TOKENS}${metadata.userId}:tokens`;
  try {
    await redisClient
      .multi()
      .set(key, JSON.stringify(metadata), {
        EX: TOKEN_EXPIRY.REFRESH_TOKEN,
      })
      .sAdd(userKey, refreshToken)
      .exec();
  } catch (error) {
    debug(`Failed to store refresh token ${refreshToken}:`, error);
    throw new InvalidTokenError("Redis transaction failed");
  }
};
