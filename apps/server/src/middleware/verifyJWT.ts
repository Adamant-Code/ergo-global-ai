import "dotenv/config";
// Internal Deps
import {
  InvalidTokenError,
  ExpiredTokenError,
  BlacklistedTokenError,
} from "@/errors/index.js";
import { JwtPayload } from "@/types/auth/index.js";

// External Deps
import debugLib from "debug";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { authTokenStore } from "@/utils/routes/auth/tokenStore.js";

const debug = debugLib("server/express-api:verify-jwt");

// Extend Request type to include user
declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}

export const verifyJWT = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new InvalidTokenError("No token provided");
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    debug(
      `Token verified for user: ${decoded.userId || decoded?.id}`
    );

    const isBlacklisted = await authTokenStore.isTokenBlacklisted(
      token
    );
    if (isBlacklisted) throw new BlacklistedTokenError();

    // Add optional fields as needed.
    req.user = { userId: decoded.userId || decoded?.id };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ExpiredTokenError();
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new InvalidTokenError("Malformed token");
    }
    next(error);
  }
};
