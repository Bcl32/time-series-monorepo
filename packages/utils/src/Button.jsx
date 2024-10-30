import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
//my custom functions
import { cn } from "../functions/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "hover:bg-gray-200 text-gray-800",
        outline:
          "bg-background hover:bg-accent hover:text-accent-foreground border border-input",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        grey: "bg-gray-200 hover:bg-gray-300 text-gray-800",
        red: "bg-red-200 hover:bg-red-300 text-red-800",
        blue: "bg-blue-700 hover:bg-blue-800 text-white",
        danger: "bg-red-700 hover:bg-orange-800 text-white",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
