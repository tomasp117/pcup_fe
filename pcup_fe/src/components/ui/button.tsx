import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary-dark text-white shadow",
        goalInfo: "bg-primary-10 hover:bg-primary/20 text-primary-dark shadow",
        eventDelete: "bg-primary text-white shadow hover:bg-red-500",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:text-primary transition-all",
        link: "text-primary underline-offset-4 hover:underline",
        scored7m: "bg-green-100 text-green-700 hover:bg-green-200",
        missed7m: "bg-red-100 text-red-700 hover:bg-red-200",
        yellowCardCount:
          "border border-yellow-500 bg-yellow-100 text-yellow-800 shadow hover:bg-yellow-200",
        redCardCount:
          "border border-red-500 bg-red-100 text-red-800 shadow hover:bg-red-200",
        twoMinPenaltyCountute:
          "border border-blue-500 bg-blue-100 text-blue-800 shadow hover:bg-blue-200",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
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

export { Button, buttonVariants };
