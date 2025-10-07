"use client";

import React, { memo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { PasswordInputProps } from "./types";
import * as Label from "@radix-ui/react-label";
import * as Toggle from "@radix-ui/react-toggle";

export const PasswordInput = memo(
  ({
    id,
    label,
    error,
    passwordValue,
    className = "",
    confirmPassword,
    disabled = false,
    handlePasswordChange,
    ...props
  }: PasswordInputProps) => {
    const [show, setShow] = useState(false);
    const [strength, setStrength] = useState<number>(0);

    const toggleShow = () => setShow((prev) => !prev);
    const evaluateStrength = (value: string) => {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      setStrength(score);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      evaluateStrength(e.target.value);
      handlePasswordChange(e);
      props.onChange?.(e);
    };

    const getStrengthStyles = () => {
      switch (strength) {
        case 0:
        case 1:
          return { width: "25%", color: "bg-red-500" };
        case 2:
          return { width: "50%", color: "bg-yellow-500" };
        case 3:
          return { width: "75%", color: "bg-green-500" };
        case 4:
          return { width: "100%", color: "bg-green-600" };
        default:
          return { width: "0%", color: "bg-gray-300" };
      }
    };

    const strengthInfo = getStrengthStyles();
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <Label.Root
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </Label.Root>
        )}
        <div className="relative">
          <input
            id={id}
            disabled={disabled}
            value={passwordValue}
            aria-invalid={!!error}
            onChange={handleChange}
            aria-describedby={errorId}
            type={show ? "text" : "password"}
            className={`w-full rounded-md border-2 outline-none px-3 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-300 hover:border-indigo-300 ${
              error
                ? "border-red-500"
                : disabled
                ? "border-gray-300 bg-gray-100 text-gray-500"
                : "border-gray-300"
            } ${className}`}
            {...props}
          />
          {passwordValue && (
            <Toggle.Root
              asChild
              pressed={show}
              onPressedChange={toggleShow}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-2 flex items-center"
            >
              <button
                type="button"
                className="p-1 text-gray-500 hover:text-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-0 focus:ring-indigo-500 rounded"
                disabled={disabled}
              >
                {show ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </Toggle.Root>
          )}
        </div>

        {/* Strength indicator does not show for confirm password */}
        {passwordValue && !confirmPassword && (
          <div className="mt-1">
            <div className="flex justify-between text-xs font-medium mt-1 text-gray-600">
              <span>Strength: {strength}/4</span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${strengthInfo.color} transition-all duration-300`}
                style={{ width: strengthInfo.width }}
              />
            </div>
          </div>
        )}

        {error && (
          <p
            id={errorId}
            className="text-xs text-red-500 mt-1"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
