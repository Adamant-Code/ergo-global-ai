"use client";

import { memo } from "react";
import { EmailInputProps } from "./types";
import * as Label from "@radix-ui/react-label";

export const EmailInput = memo(
  ({
    id,
    label,
    error,
    emailValue,
    className = "",
    disabled = false,
    ...props
  }: EmailInputProps) => {
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <Label.Root
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </Label.Root>
        )}
        <input
          id={id}
          type="email"
          value={emailValue}
          aria-invalid={!!error}
          aria-describedby={errorId}
          disabled={disabled}
          className={`w-full rounded-md border-2 outline-none px-3 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-300 hover:border-indigo-300 ${
            error
              ? "border-red-500"
              : disabled
              ? "border-gray-300 bg-gray-100 text-gray-500"
              : "border-gray-300"
          } ${className}`}
          {...props}
        />
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

EmailInput.displayName = "EmailInput";
