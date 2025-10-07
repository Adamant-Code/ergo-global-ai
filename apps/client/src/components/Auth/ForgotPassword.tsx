"use client";

import Link from "next/link";
import { ZodError } from "zod";
import Button from "../Button/Button";
import { useAuth } from "@/hooks/useAuth";
import { parseError } from "@/lib/errors";
import { useError } from "@/hooks/useError";
import { ChangeEvent, useState } from "react";
import { EmailInput } from "../EmailInput/EmailInput";
import { ForgotPasswordError } from "@/types/form-error";
import { forgotPasswordSchema } from "@request-response/types";

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const { setError: setAppError } = useError();
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ForgotPasswordError>({});

  const validateForm = (): boolean => {
    try {
      forgotPasswordSchema.parse({ email });
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrors = error.flatten().fieldErrors;

        const formattedErrors: ForgotPasswordError = {
          email: zodErrors.email?.[0],
        };
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});

    try {
      forgotPasswordSchema.parse({ email });
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setErrors({
        general: "Password reset failed. Please try again.",
      });
      setAppError(parseError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    try {
      forgotPasswordSchema.parse({ email: e.target.value });
      setErrors({});
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrors = error.flatten().fieldErrors;
        setErrors({
          email: zodErrors.email?.[0],
        });
      }
    }
  };

  if (success) {
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
            Check Your Email
          </h1>
          <p className="text-gray-500 mt-3 mb-6">
            If an account with that email exists, we&apos;ve sent
            instructions to reset your password.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full text-center py-3 text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-300"
        >
          Return to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-8 pt-8 pb-6 border-b border-gray-100">
        <h1 className="text-2xl font-serif text-center text-gray-800">
          Forgot Your Password?
        </h1>
        <p className="text-gray-500 text-center mt-3">
          Enter your email address and we&apos;ll send you
          instructions to create a new password.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="p-8 space-y-6"
      >
        <div>
          <EmailInput
            required
            name="email"
            emailValue={email}
            disabled={isLoading}
            label="Email Address"
            onChange={handleChange}
            placeholder="your@email.com"
            error={errors.email || errors.general}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Email reset link"}
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

export default ForgotPassword;
