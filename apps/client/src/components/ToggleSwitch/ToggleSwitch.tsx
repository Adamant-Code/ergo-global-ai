"use client";

import { memo } from "react";
import classNames from "classnames";
import { ToggleSwitchProps } from "./types";
import * as Switch from "@radix-ui/react-switch";

export const ToggleSwitch = memo(
  ({
    id,
    label,
    checked,
    className,
    size = "md",
    onCheckedChange,
    disabled = false,
  }: ToggleSwitchProps) => {
    const sizeClasses = {
      sm: {
        root: "w-8 h-4",
        thumb: "w-3 h-3 data-[state=checked]:translate-x-4",
      },
      md: {
        root: "w-11 h-6",
        thumb: "w-4 h-4 data-[state=checked]:translate-x-5",
      },
      lg: {
        root: "w-14 h-8",
        thumb: "w-6 h-6 data-[state=checked]:translate-x-6",
      },
    };

    return (
      <div className="flex items-center gap-3">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <Switch.Root
          id={id}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className={classNames(
            "relative rounded-full transition-all duration-200",
            "bg-gray-300 data-[state=checked]:bg-indigo-500",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50",
            "hover:bg-gray-400 data-[state=checked]:hover:bg-indigo-600",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-200",
            sizeClasses[size].root,
            className
          )}
        >
          <Switch.Thumb
            className={classNames(
              "block rounded-full bg-white transition-transform shadow-md",
              "translate-x-1",
              sizeClasses[size].thumb
            )}
          />
        </Switch.Root>
      </div>
    );
  }
);

ToggleSwitch.displayName = "ToggleSwitch";
