import * as React from "react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { VariantProps } from "@nextui-org/react";
import { FormItem, FormMessage } from "./form";
import { Label } from "./label";

export type InputProps = {
  label?: string;
  error?: string;
  isRequired?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

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
  ({ className, variant, label, error, isRequired, type, inputMode, ...props }, ref) => {
    return (
      <FormItem>
        {label && <Label isRequired={isRequired}>{label}</Label>}

        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background duration-300 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:transition-shadow disabled:cursor-not-allowed disabled:opacity-50",
            "file:mb-1 file:me-3 file:cursor-pointer file:rounded-md file:border file:border-solid file:border-primary file:bg-blue-50 file:text-sm file:font-medium file:text-primary hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-100",
            type === "file" && "py-[5px]",
            inputStyles({ variant }),
            className,
          )}
          ref={ref}
          inputMode={type === "number" && !inputMode ? "numeric" : inputMode}
          {...props}
        />

        {error && <FormMessage>{error}</FormMessage>}
      </FormItem>
    );
  },
);
Input.displayName = "Input";

export { Input };
