// External Deps
import express from "express";
import { registerSchema } from "@request-response/types";

// Internal Deps
import register from "./register.js";
import { validateRequest } from "@/middleware/validateRequest.js";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);

export default router;
