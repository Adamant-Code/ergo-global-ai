// External Deps
import express from "express";
import { resetPasswordSchema } from "@request-response/types";

// Internal Deps
import resetPassword from "./resetPassword.js";
import { validateRequest } from "@/middleware/validateRequest.js";

const router = express.Router();

router.post("/", validateRequest(resetPasswordSchema), resetPassword);

export default router;
