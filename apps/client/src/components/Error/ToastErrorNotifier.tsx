"use client";

import { toast } from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useError } from "@/hooks/useError";

export default function ToastErrorNotifier() {
  const { error } = useError();
  const lastErrorTimeRef = useRef<number>(0);
  const lastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!error) return;

    const now = Date.now();
    const errorMessage =
      error.message || "An unexpected error occurred";

    // Skip if it's the same error within 3 seconds
    if (
      lastErrorRef.current === errorMessage &&
      now - lastErrorTimeRef.current < 3000
    )
      return;

    // Update our tracking refs
    lastErrorTimeRef.current = now;
    lastErrorRef.current = errorMessage;

    // Show the error toast
    toast.error(errorMessage, {
      duration: 8000,
      id: `error-${now}`,
    });

  }, [error]);

  return null;
}
