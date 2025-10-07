// External Deps
import debugLib from "debug";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Deps
import {
  revokeAccessToken,
  revokeRefreshToken,
} from "@/utils/routes/auth/tokens.js";
import { InvalidCredentialsError } from "@/errors/index.js";
import { AuthenticatedRequest } from "@/types/auth/index.js";

const debug = debugLib("server/express-api:route-logout");

const logout = asyncHandler(
  async (
    req: Request<{}, {}, AuthenticatedRequest>,
    res: Response
  ) => {
    const { refreshToken } = req.cookies;
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!refreshToken || !accessToken)
      throw new InvalidCredentialsError("Invalid or expired token");

    await Promise.all([
      revokeAccessToken(accessToken),
      revokeRefreshToken(refreshToken),
    ]);

    debug(`Logout successful`);

    res.clearCookie("refreshToken");
    res.status(204).send();
  }
);

export default logout;
