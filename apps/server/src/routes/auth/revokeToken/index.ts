// Internal Deps
import revokeToken from "./revokeToken.js";
import { verifyJWT } from "@/middleware/verifyJWT.js";
import { validateRequest } from "@/middleware/validateRequest.js";

// External Deps
import express from "express";
import { revokeTokenSchema } from "@request-response/types";

const router = express.Router();

router.post(
  "/", verifyJWT, validateRequest(revokeTokenSchema), revokeToken
);

export default router;
