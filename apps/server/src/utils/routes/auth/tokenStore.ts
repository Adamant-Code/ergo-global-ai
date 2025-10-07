import debugLib from "debug";
import redisClient from "@/config/redis.js";
import { InvalidTokenError } from "@/errors/index.js";
import { TokenMetadata } from "@/types/auth/index.js";
import { REDIS_PREFIXES, TOKEN_EXPIRY } from "@/constants/index.js";

const debug = debugLib("server/utils:routes/auth-token-store");

const blacklistToken = async (
  token: string,
  type: "access" | "refresh"
): Promise<void> => {
  const key = `${REDIS_PREFIXES.BLACKLIST}${token}`;
  const expiry =
    type === "access"
      ? TOKEN_EXPIRY.ACCESS_TOKEN
      : TOKEN_EXPIRY.REFRESH_TOKEN;
  try {
    await redisClient.set(key, "true", { EX: expiry });
    console.info(`Blacklisted ${type} token ${token}`);
  } catch (error) {
    debug(`Failed to blacklist ${type} token ${token}:`, error);
    throw new InvalidTokenError("Redis operation failed");
  }
};

const isTokenBlacklisted = async (
  token: string
): Promise<boolean> => {
  const key = `${REDIS_PREFIXES.BLACKLIST}${token}`;
  try {
    return Boolean(await redisClient.get(key));
  } catch (error) {
    debug(`Failed to check blacklist for token ${token}:`, error);
    return false;
  }
};

const getRefreshTokenData = async (
  refreshToken: string
): Promise<TokenMetadata | null> => {
  const key = `${REDIS_PREFIXES.REFRESH_TOKEN}${refreshToken}`;
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return data ? JSON.parse(data) : null;
  } catch (error) {
    debug(`Invalid token metadata for ${refreshToken}:`, error);
    return null;
  }
};

export const authTokenStore = {
  blacklistToken,
  isTokenBlacklisted,
  getRefreshTokenData,
};
