import express from "express";
import health from "./health.js";
import { healthQuerySchema } from "./schemas/index.js";
import { validateRequest } from "@/middleware/validateRequest.js";

const router = express.Router();

router.get("/", validateRequest(healthQuerySchema), health);

export default router;
