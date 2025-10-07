// External Deps
import bcrypt from "bcrypt";
import debugLib from "debug";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { LoginInput } from "@request-response/types";

// Internal Deps
import { User } from "@/models/User.js";
import { COOKIE_OPTIONS } from "@/constants/index.js";
import { IpAndUserAgentProps } from "@/types/auth/index.js";
import { InvalidCredentialsError } from "@/errors/index.js";
import { createAuthTokens } from "@/utils/routes/auth/tokens.js";

const debug = debugLib("server/express-api:route-login");

const login = asyncHandler(
  async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const { email, password } = req.body;
    const ipAndUserAgent: IpAndUserAgentProps = {
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
    };

    const user = await User.query().findOne({ email });

    // Verify password
    if (!user || !(await bcrypt.compare(password, user.password)))
      throw new InvalidCredentialsError("Invalid email or password");

    // Get access and refresh tokens
    const { accessTokenResult, refreshToken } =
      await createAuthTokens(user.id, user.email, ipAndUserAgent);

    debug(`Login successful for user: ${email}`);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(201).json(accessTokenResult);
  }
);

export default login;
