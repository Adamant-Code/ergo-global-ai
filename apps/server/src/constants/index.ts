import "dotenv/config";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 604800000 /** 7 days days expiry in milliseconds */,
} as const;

/** Fifteen minutes access token expiry in seconds*/
/** @param `ACCESS_TOKEN` 15 minutes in seconds
 *  @param `REFRESH_TOKEN` 7 days in seconds
 */
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 900,
  REFRESH_TOKEN: 604800,
} as const;

export const REDIS_PREFIXES = {
  USER_TOKENS: "user:",
  RESET_TOKEN: "reset:",
  BLACKLIST: "blacklist:",
  REFRESH_TOKEN: "refresh:",
} as const;
