// External Deps
import debugLib from "debug";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RevokeTokenInput } from "@request-response/types";

// Internal Deps
import { InvalidCredentialsError } from "@/errors/index.js";
import { authTokenStore } from "@/utils/routes/auth/tokenStore.js";
import { revokeAllTokens, revokeRefreshToken } from "@/utils/routes/auth/tokens.js";

const debug = debugLib("server/routes:auth/revoke-token");

const revokeToken = asyncHandler(
  async (req: Request<{}, {}, RevokeTokenInput>, res: Response) => {
    const { user } = req;
    const tokenToRevoke = req.body?.refreshToken;
    const accessToken = req.headers.authorization?.split(" ")[1];

    if (!user)
      throw new InvalidCredentialsError("Authentication required");

    const userId = user.userId;

    // Revoke specific token
    if (tokenToRevoke) {
      const { userId: tokenUserId } =
        (await authTokenStore.getRefreshTokenData(tokenToRevoke)) ||
        {};

      if (tokenUserId !== userId)
        throw new InvalidCredentialsError(
          "Not authorized to revoke this token"
        );

      await revokeRefreshToken(tokenToRevoke);
    } else {
      // Revoke all tokens
      await revokeAllTokens(userId);

      if (accessToken) {
        await authTokenStore.blacklistToken(accessToken, "access");
        res.clearCookie("refreshToken");
      }
    }

    debug(`Token(s) revoked for user: ${user?.userId}`);
    res.status(204).send();
  }
);

export default revokeToken;
