// Internal Deps
import forgotPassword from "./forgotPassword.js";
import { validateRequest } from "@/middleware/validateRequest.js";

// External Deps
import express from "express";
import { forgotPasswordSchema } from "@request-response/types";

const router = express.Router();

router.post(
  "/", validateRequest(forgotPasswordSchema), forgotPassword
);

export default router;
