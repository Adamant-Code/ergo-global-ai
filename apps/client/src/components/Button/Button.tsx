import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";


export const buttonVariants = cva(
  // Base styles aligned with app focus/transition patterns
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-300 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary (Indigo)
        default:
          "bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300",
        // Destructive
        destructive:
          "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
        // Subtle bordered button on white background
        outline:
          "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
        // Secondary (neutral)
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        // Ghost (minimal)
        ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
        // Link style
        link: "text-indigo-600 hover:text-indigo-800 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
