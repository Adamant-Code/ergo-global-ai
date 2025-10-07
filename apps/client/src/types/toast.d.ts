import { ToastOptions } from "react-hot-toast";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastConfig extends ToastOptions {
  duration?: number;
  action?: ToastAction;
}