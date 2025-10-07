"use client";

import Link from "next/link";
import { ZodError } from "zod";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { parseError } from "@/lib/errors";
import { useError } from "@/hooks/useError";
import { ResetError } from "@/types/form-error";
import { resetPasswordSchema } from "@/lib/schemas";
import { PasswordInput } from "../PasswordInput/PasswordInput";
import Button from "../Button/Button";

interface ResetPasswordProps {
  token: string;
}

const ResetPassword = ({ token }: ResetPasswordProps) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { setError } = useError();
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ResetError>({});
  const [isSuccessfulReset, setIsSuccessfulReset] = useState(false);

  const validateForm = (): boolean => {
    try {
      resetPasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrors = error.flatten().fieldErrors;

        // Format and extract error messages
        const formattedErrors: ResetError = {};

        if (zodErrors.password && zodErrors.password.length > 0) {
          formattedErrors.password =
            typeof zodErrors.password[0] === "string"
              ? zodErrors.password[0]
              : "Invalid password";
        }

        if (
          zodErrors.confirmPassword &&
          zodErrors.confirmPassword.length > 0
        ) {
          formattedErrors.confirmPassword =
            typeof zodErrors.confirmPassword[0] === "string"
              ? zodErrors.confirmPassword[0]
              : "Passwords do not match";
        }

        setErrors(formattedErrors);
      } else if (error instanceof Error) {
        // Try to parse error message if it looks like JSON
        try {
          if (
            error.message.startsWith("[") ||
            error.message.startsWith("{")
          ) {
            const parsedError = JSON.parse(error.message);

            // Handle array of error objects
            if (Array.isArray(parsedError)) {
              const newErrors: ResetError = {};

              parsedError.forEach((err) => {
                if (err.path && err.path.length > 0 && err.message) {
                  const fieldName = err.path[err.path.length - 1];
                  newErrors[fieldName as keyof ResetError] =
                    err.message;
                }
              });

              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return false;
              }
            }
          }
        } catch (jsonError) {
          const errorMessage =
            "Password reset failed. Please try again.";
          setError(parseError(jsonError, errorMessage));
        }

        // Fallback for non-JSON error messages
        setErrors({ general: error.message });
        setError(parseError(error.message));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(token, formData.password);
      setIsSuccessfulReset(true);
    } catch (err) {
      let errorMessage = "Password reset failed. Please try again.";

      // Handle JSON error format
      if (err instanceof Error) {
        try {
          if (
            err.message.startsWith("[") ||
            err.message.startsWith("{")
          ) {
            const parsedError = JSON.parse(err.message);

            if (Array.isArray(parsedError)) {
              const newErrors: ResetError = {};

              parsedError.forEach((error) => {
                if (
                  error.path &&
                  error.path.length > 0 &&
                  error.message
                ) {
                  const fieldName = error.path[error.path.length - 1];
                  newErrors[fieldName as keyof ResetError] =
                    error.message;
                }
              });

              if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                setError(parseError("Validation failed"));
                setIsSuccessfulReset(false);
                setIsLoading(false);
                return;
              }
            }
          }

          errorMessage = err.message;
        } catch (jsonError) {
          errorMessage = err.message;
          setError(parseError(jsonError, errorMessage));
        }
      }

      // Default error handling
      setErrors({
        general: errorMessage,
      });
      setError(parseError(err));
      setIsSuccessfulReset(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ResetError])
      setErrors((prev) => ({ ...prev, [name]: undefined }));

    if (errors.general)
      setErrors((prev) => ({ ...prev, general: undefined }));
  };

  if (isSuccessfulReset) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8 mt-16">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-gray-800">
            Password Reset Successful
          </h1>
          <p className="text-gray-500 mt-3 mb-6">
            Your password has been successfully updated. You can now
            log in with your new password.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full text-center py-3 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <h1 className="text-2xl font-serif text-center text-gray-800">
          Reset Your Password
        </h1>
        <p className="text-gray-500 text-center mt-3">
          Create a new password for your account
        </p>
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="p-8 space-y-6"
      >
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <div>
          <PasswordInput
            required
            id="password"
            name="password"
            disabled={isLoading}
            label="New Password"
            error={errors.password}
            value={formData.password}
            placeholder="Enter new password"
            passwordValue={formData.password}
            handlePasswordChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-500"
          />
        </div>

        <div>
          <PasswordInput
            required
            confirmPassword
            id="confirmPassword"
            disabled={isLoading}
            name="confirmPassword"
            label="Confirm New Password"
            value={formData.confirmPassword}
            placeholder="Re-enter new password"
            handlePasswordChange={handleChange}
            passwordValue={formData.confirmPassword}
            error={errors.confirmPassword}
            className="w-full rounded-md border border-gray-300 px-4 py-3 focus:ring-1 focus:ring-indigo-300 focus:border-indigo-500"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>

        <div className="pt-4 text-center border-t border-gray-100">
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
