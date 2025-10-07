// External Deps
import express from "express";
import { loginSchema } from "@request-response/types";

// Middleware Deps
import login from "./login.js";
import { validateRequest } from "@/middleware/validateRequest.js";

const router = express.Router();

router.post("/", validateRequest(loginSchema), login);

export default router;
