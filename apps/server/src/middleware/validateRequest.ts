// Error classes
import { ValidationError } from "@/errors/index.js";

// External dependencies
import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Validate and parse query, body, or params as needed
      schema.parse({
        ...req.query,
        ...req.body,
        ...req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Combine all error messages into a single string
        const errorMessages = error.errors
          .map(
            (issue) => `${issue.path.join(".")}: ${issue.message}`
          )
          .join("\n");
        throw new ValidationError(errorMessages);
      }
      next(error);
    }
  };
};
