// Internal Deps
import "dotenv/config";
import { CustomError } from "@/errors/index.js";

// External Deps
import debugLib from "debug";
import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "@request-response/types";

const debug = debugLib("server/middleware:error-handler");

export const errorHandler = (
  err: Error | CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Determine if the error is a CustomError instance
  if (err instanceof CustomError) {
    const { status, code, message } = err;
    debug(`Handling custom error: ${code} - ${message}`);
    const response: ErrorResponse = {
      error: {
        status,
        code,
        message,
      },
    };

    res.status(status).json(response);
    return;
  }

  // Handle unexpected (non-CustomError) errors
  debug(`Unhandled error: ${err.message}`);
  const status = 500;
  const code = "INTERNAL_SERVER_ERROR";
  const message = "An unexpected error occurred";
  const response: ErrorResponse = {
    error: {
      status,
      code,
      message,
      ...(process.env.NODE_ENV !== "production" && {
        stack: err.stack,
      }),
    },
  };

  res.status(status).json(response);
};
