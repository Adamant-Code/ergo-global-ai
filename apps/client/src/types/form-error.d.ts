export interface RegisterError {
  email?: string;
  general?: string;
  password?: string;
  confirmPassword?: string;
}

export type ResetError = Pick<
  RegisterError,
  "password" | "confirmPassword" | "general"
>;

export type ForgotPasswordError = Pick<
  RegisterError,
  "email" | "general"
>;
