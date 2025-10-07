import { z } from "zod";
import {
  registerSchema as registerSchemaServer,
  resetPasswordSchema as resetPasswordSchemaServer,
} from "@request-response/types";

export const registerSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /[a-z]/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /[A-Z]/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/[0-9]/, "Password must contain at least one number")
      .min(1, "Password is required"),
    confirmPassword: z
      .string()
      .min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const resetPasswordSchema = resetPasswordSchemaServer
  .pick({
    password: true,
  })
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const loginSchema = registerSchemaServer.extend({});

const urlSchema = z.string().url({ message: "Invalid URL format" });

type ValidUrl = z.infer<typeof urlSchema>;

// Function to validate a URL with optional protocol requirement
export function validateUrl(
  input: string,
  requireProtocol: boolean = false
):
  | { isValid: true; url: ValidUrl }
  | { isValid: false; error: string } {
  const trimmedInput = input.trim();
  if (requireProtocol) {
    try {
      const result = urlSchema.parse(trimmedInput);
      return { isValid: true, url: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: "Unknown validation error" };
    }
  }

  let urlToValidate = trimmedInput;
  if (!/^https?:\/\//i.test(trimmedInput)) {
    urlToValidate = `https://${trimmedInput}`;
  }

  try {
    const result = urlSchema.parse(urlToValidate);
    return { isValid: true, url: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0].message };
    }
    return { isValid: false, error: "Unknown validation error" };
  }
}
