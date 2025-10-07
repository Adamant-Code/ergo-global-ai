// External deps
import bcrypt from "bcrypt";
import debugLib from "debug";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { RegisterInput } from "@request-response/types";

// Internal Deps
import { User } from "@/models/User.js";
import { NotFoundError } from "@/errors/index.js";
import { COOKIE_OPTIONS } from "@/constants/index.js";
import { IpAndUserAgentProps } from "@/types/auth/index.js";
import { createAuthTokens } from "@/utils/routes/auth/tokens.js";

const debug = debugLib("server/routes:user/register");

const register = asyncHandler(
  async (req: Request<{}, {}, RegisterInput>, res: Response) => {
    const { email, password } = req.body;
    const ipAndUserAgent: IpAndUserAgentProps = {
      ipAddress: req.ip || req.socket.remoteAddress,
      userAgent: req.headers["user-agent"] || "unknown",
    };

    const userExist = await User.query().findOne({ email });

    if (userExist) throw new NotFoundError("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.query().insert({
      email,
      password: hashedPassword,
    });

    // Respond with access token
    const { refreshToken, accessTokenResult } =
      await createAuthTokens(user.id, email, ipAndUserAgent);

    debug(`Registration successful for user: ${email}`);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(201).json(accessTokenResult);
  }
);

export default register;
