import {
  InvalidTokenError,
  ExpiredTokenError,
  BlacklistedTokenError,
} from "@/errors/index.js";
import jwt from "jsonwebtoken";
import { ExtendedError, Socket } from "socket.io";
import { authTokenStore } from "@/utils/routes/auth/tokenStore.js";

export const jwtSocketMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError) => void
) => {
  try {
    let token: string | undefined;
    const authHeader = socket.handshake.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (socket.handshake.auth && socket.handshake.auth.token) {
      token = socket.handshake.auth.token;
    }

    if (!token) throw new InvalidTokenError("No token provided");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;

    const isBlacklisted = await authTokenStore.isTokenBlacklisted(
      token
    );
    if (isBlacklisted) throw new BlacklistedTokenError();

    // Attach user info to socket
    socket.data.user = { userId: decoded.id };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new ExpiredTokenError());
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new InvalidTokenError("Malformed token"));
    } else {
      if (error instanceof Error) {
        next(error as ExtendedError);
      } else {
        next(new InvalidTokenError("Unknown error"));
      }
    }
  }
};
