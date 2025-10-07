import { toast } from "react-hot-toast";
import { ToastConfig } from "@/types/toast";
import { useCallback, useMemo } from "react";

const useToast = () => {
  const defaultOptions: ToastConfig = useMemo(
    () => ({
      duration: 4000,
      style: {
        padding: "12px 16px",
        borderRadius: "8px",
        maxWidth: "400px",
        fontSize: "14px",
      },
    }),
    []
  );

  const success = useCallback(
    (message: string, options?: ToastConfig) => {
      toast(
        (t) => (
          <div className="flex items-center gap-2">
            <span>{message}</span>
            {options?.action && (
              <button
                className="px-4 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => {
                  options.action?.onClick();
                  toast.dismiss(t.id);
                }}
              >
                {options.action.label}
              </button>
            )}
          </div>
        ),
        {
          ...defaultOptions,
          ...options,
          style: {
            ...defaultOptions.style,
            background: "#d1fae5",
            color: "#065f46",
            ...options?.style,
          },
        }
      );
    },
    [defaultOptions]
  );

  const error = useCallback(
    (message: string, options?: ToastConfig) => {
      toast(
        (t) => (
          <div className="flex items-center gap-2">
            <span>{message}</span>
            {options?.action && (
              <button
                className="px-4 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => {
                  options.action?.onClick();
                  toast.dismiss(t.id);
                }}
              >
                {options.action.label}
              </button>
            )}
          </div>
        ),
        {
          ...defaultOptions,
          ...options,
          style: {
            ...defaultOptions.style,
            background: "#fee2e2",
            color: "#991b1b",
            ...options?.style,
          },
        }
      );
    },
    [defaultOptions]
  );

  const info = useCallback(
    (message: string, options?: ToastConfig) => {
      toast(
        (t) => (
          <div className="flex items-center gap-2">
            <span>{message}</span>
            {options?.action && (
              <button
                className="px-4 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => {
                  options.action?.onClick();
                  toast.dismiss(t.id);
                }}
              >
                {options.action.label}
              </button>
            )}
          </div>
        ),
        {
          ...defaultOptions,
          ...options,
          style: {
            ...defaultOptions.style,
            background: "#e0f2fe",
            color: "#1e40af",
            ...options?.style,
          },
          icon: "ℹ️",
        }
      );
    },
    [defaultOptions]
  );

  const custom = useCallback(
    (content: React.ReactNode, options?: ToastConfig) => {
      toast(
        (t) => (
          <div className="flex items-center gap-2">
            {content}
            {options?.action && (
              <button
                className="px-4 py-1 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={() => {
                  options.action?.onClick();
                  toast.dismiss(t.id);
                }}
              >
                {options.action.label}
              </button>
            )}
          </div>
        ),
        {
          ...defaultOptions,
          ...options,
          style: {
            ...defaultOptions.style,
            ...options?.style,
          },
        }
      );
    },
    [defaultOptions]
  );

  return { success, error, info, custom };
};

export default useToast;
