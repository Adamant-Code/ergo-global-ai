import { useContext } from "react";
import { ErrorContext } from "@/context/ErrorContext";

/**
 * Custom hook to access the error context.
 * Must be used within an ErrorProvider.
 */
export function useError() {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}
