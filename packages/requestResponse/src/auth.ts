import { z } from "zod";

// Shared schemas
const emailSchema = z
  .string()
  .email({ message: "Invalid email address" });

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .regex(/[A-Za-z]/, {
    message: "Password must contain at least one letter",
  })
  .regex(/[0-9]/, {
    message: "Password must contain at least one number",
  });
export type AccessTokenResponse = {
  id: string;
  email: string;
  accessToken: string;
};

/**************************************************************
 * ************************************************************
 * ************************************************************
 * ************************************************************
 * POST /auth/register
 */
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  // Add other fields as required
});
/**
 * Represents the input data for a user registration operation.
 *
 * This type is inferred from the `registerSchema`, ensuring that the registration input object
 * adheres to the defined validation rules.
 *
 * Typical parameters may include:
 * @param email - The user's email address (required).
 * @param password - The user's password meeting the complexity requirements (Requirements: At least 6 characters, 1 number, and one letter).
 */
export type RegisterInput = z.infer<typeof registerSchema>;
export type RegisterResponse = AccessTokenResponse;

/**************************************************************
 * ************************************************************
 * ************************************************************
 * ************************************************************
 * POST /auth/login
 */
export const loginSchema = registerSchema.extend({});
/**
 * Represents the input data for a user login operation.
 *
 * This type is derived from the `loginSchema` using Zod's inference capabilities,
 * ensuring that the login input object adheres to the defined validation rules.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password meeting the complexity requirements (Requirements: At least 6 characters, 1 number, and one letter).
 */
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginResponse = AccessTokenResponse;

/**************************************************************
 * ************************************************************
 * ************************************************************
 * ************************************************************
 * POST /auth/logout (no body, uses cookie)
 */
export const logoutSchema = z.object({});
/**
 * Represents the input type for a logout operation.
 *
 * @remarks
 * The underlying schema (logoutSchema) is an empty object, which means that no input fields are required.
 *
 * @param - No parameters are expected.
 */
export type LogoutInput = z.infer<typeof logoutSchema>;
export type LogoutResponse = { message: string };

/**************************************************************
 * ************************************************************
 * ************************************************************
 * ************************************************************
 * POST /auth/forgot-password
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
/**
 * Represents the input data for initiating a forgot password request.
 *
 * This type is inferred from the `forgotPasswordSchema`, so the actual structure—including which fields are required or optional—is defined by the schema.
 *
 * Example typical parameters might include:
 * @param email - The user's email address associated with the account (required).
 */
export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordSchema
>;
export type ForgotPasswordResponse = { message: string };

/**************************************************************
 * ************************************************************
 * ************************************************************
 * ************************************************************
 * POST /auth/reset-password
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Reset token is required" }),
  password: passwordSchema,
});
/**
 * Represents the input payload for resetting a user's password.
 *
 * @param token - A non-empty string representing the reset token used for verifying the request.
 * @param password - The new password that meets the complexity requirements.
 *
 * This type is derived from the `resetPasswordSchema` using Zod's type inference,
 * ensuring that the value conforms to the expected schema for password reset operations.
 */
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordResponse = { message: string };

/**************************************************************
 * ************************************************************
 * ************************************************************
 * ************************************************************
 * POST /auth/refresh-token (no body, uses cookie)
 */
export const refreshTokenSchema = z.object({});
/**
 * Schema for the refresh-token endpoint.
 *
 * Note:
 * - This endpoint does not require a request body as it uses cookies for authentication.
 * - The type is inferred from refreshTokenSchema, which represents an empty object.
 */
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type RefreshTokenResponse = AccessTokenResponse;

/**************************************************************
 * ************************************************************
 * ************************************************************
 * ************************************************************
 * POST /auth/revoke-token
 */
export const revokeTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, {
      message: "Refresh token cannot be empty when provided",
    })
    .optional(),
});
/**
 * Schema for revoking a refresh token.
 *
 * @property {string} [refreshToken] - An optional string representing the refresh token.
 *   When provided, the refresh token cannot be an empty string. It is used to validate
 *   and invalidate the token during the revocation process.
 */
export type RevokeTokenInput = z.infer<typeof revokeTokenSchema>;
export type RevokeTokenResponse = { message: string };
