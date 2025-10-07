// External Deps
import express from "express";
import { refreshTokenSchema } from "@request-response/types";

// Internal Deps
import refreshToken from "./refreshToken.js";
import { validateRequest } from "@/middleware/validateRequest.js";

const router = express.Router();

router.post("/", validateRequest(refreshTokenSchema), refreshToken);

export default router;
