import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  buttonName: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  loadingText?: string;
  type: "button" | "submit" | "reset";
}
