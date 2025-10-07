"use client";

import { UrlInputProps } from "./types";
import { validateUrl } from "@/lib/schemas";
import { ChangeEvent, useState, memo, useEffect } from "react";
import * as Label from "@radix-ui/react-label";

export const UrlInput = memo(
  ({
    id,
    label,
    urlValue,
    className = "",
    errorClassName,
    requireProtocol,
    handleUrlChange,
    disabled = false,
    ...otherProps
  }: UrlInputProps) => {
    const [urlError, setUrlError] = useState<string>("");
    const [localUrlValue, setLocalUrlValue] = useState(urlValue);

    // Sync with parent value when it changes externally
    useEffect(() => {
      setLocalUrlValue(urlValue);
    }, [urlValue]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setLocalUrlValue(value);
      handleUrlChange(value);
    };

    const handleUrlBlur = (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const validation = validateUrl(value, requireProtocol);

      if (!validation.isValid) {
        setUrlError(validation.error);
        return;
      } else setUrlError("");

      handleUrlChange(validation.url);
    };

    const handleUrlKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Enter") {
        const validation = validateUrl(
          e.currentTarget.value,
          requireProtocol
        );
        if (!validation.isValid) setUrlError(validation.error);
        else setUrlError("");
      }
    };

    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <Label.Root
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
          >
            {label} 🌐
          </Label.Root>
        )}
        <input
          id={id}
          type="url"
          value={localUrlValue}
          disabled={disabled}
          onBlur={handleUrlBlur}
          onChange={handleChange}
          aria-invalid={!!urlError}
          onKeyDown={handleUrlKeyDown}
          aria-describedby={
            urlError && id ? `${id}-error` : undefined
          }
          className={`w-full rounded-md border-2 outline-none px-3 py-2 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-indigo-300 hover:border-indigo-300 ${
            urlError
              ? "border-red-500"
              : disabled
              ? "border-gray-300 text-gray-500 opacity-60 cursor-not-allowed"
              : "border-gray-300"
          } ${className}`}
          {...otherProps}
        />
        {urlError && id && (
          <p
            id={`${id}-error`}
            className={`text-xs text-red-500 mt-1 ${errorClassName}`}
          >
            {urlError}
          </p>
        )}
      </div>
    );
  }
);

UrlInput.displayName = "UrlInput";
