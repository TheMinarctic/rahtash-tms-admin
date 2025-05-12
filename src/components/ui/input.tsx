import * as React from "react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { VariantProps } from "@nextui-org/react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const inputStyles = cva("", {
  variants: {
    variant: {
      background: "bg-background",
      muted: "bg-muted",
    },
  },
  defaultVariants: {
    variant: "muted",
  },
});

const Input = React.forwardRef<HTMLInputElement, InputProps & VariantProps<typeof inputStyles>>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:transition-shadow disabled:cursor-not-allowed disabled:opacity-50",
          inputStyles({ variant }),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
