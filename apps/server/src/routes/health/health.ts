// External Deps
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

// Internal Deps
import { healthQuerySchema } from "./schemas/index.js";
import { serviceUrls } from "@/config/services.js";
import { HealthResponse } from "@request-response/types";

const health = asyncHandler(async (req: Request, res: Response) => {
  const { format } = healthQuerySchema.parse(req.query);
  let aiStatus: { status: string };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${serviceUrls.aiService}/health`, {
      method: "GET",
      signal: controller.signal,
    });
    const data = (await response.json()) as { status: string };
    aiStatus = data.status ? data : { status: "unknown" };
  } catch (error) {
    aiStatus = { status: "unavailable" };
  } finally {
    clearTimeout(timeout);
  }

  const response: HealthResponse =
    format === "short"
      ? { status: "ok" }
      : {
          status: "ok",
          aiService: aiStatus,
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
        };

  res.status(200).json(response);
});

export default health;
