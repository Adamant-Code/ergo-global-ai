import { ToastConfig } from "@/types/toast";

export interface ToastComponentsProps {
  label: string;
  withAction?: boolean;
  handleUndo: () => void;
  info: (message: string, options?: ToastConfig) => void;
  error: (message: string, options?: ToastConfig) => void;
  success: (message: string, options?: ToastConfig) => void;
}
