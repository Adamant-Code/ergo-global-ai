"use client";

import { AppError, parseError } from "@/lib/errors";
import React, { createContext, useState, ReactNode } from "react";

interface ErrorContextType {
  error: AppError | null;
  setError: (error: AppError | string | unknown | null) => void;
  clearError: () => void;
}

export const ErrorContext = createContext<
  ErrorContextType | undefined
>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export function ErrorProvider({ children }: ErrorProviderProps) {
  const [error, setErrorState] = useState<AppError | null>(null);

  /**
   * Set a new error in the context.
   * @param error - The error to be set, or null to clear.
   */
  const setError = (error: AppError | string | unknown | null) => {
    const err = error ? parseError(error) : null;
    setErrorState(err);

    if (error)
      setTimeout(() => {
        setErrorState(null);
      }, 5000);
  };

  /**
   * Clear the error state.
   */
  const clearError = () => {
    setErrorState(null);
  };

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
}
