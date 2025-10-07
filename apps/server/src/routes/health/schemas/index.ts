import { z } from "zod";

/**
 * Schema for validating health endpoint query parameters.
 * Defines the optional 'format' parameter with specific values.
 */
export const healthQuerySchema = z.object({
  format: z.enum(["short", "full"]).optional(),
});

/**
 * Type inferred from the healthQuerySchema.
 *
 * This type is used in controllers to ensure that the query parameters adhere
 * to the expected schema.
 *
 * Expected Optional Params:
 * - format: "short" | "full" (when provided)
 */
export type HealthQuery = z.infer<typeof healthQuerySchema>;
