import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type Step = {
  id: string | number;
  order: number;
  title: string;
};

interface StepperProps {
  steps: Step[];
  className?: string;
  withAnimation?: boolean;
  activeStepOrder?: number;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  className,
  activeStepOrder,
  withAnimation = true,
}) => {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {steps.map((item, index) => (
        <React.Fragment key={item.id}>
          <div className="mt-7 flex flex-col items-center gap-2">
            <div
              className={cn(
                "center relative size-9 rounded-full border bg-muted ring-2 ring-gray-200 ring-offset-2 ring-offset-background dark:ring-gray-800",

                // DONE
                item.order < (activeStepOrder ?? 0) &&
                  "bg-primary/80 text-primary-foreground ring-primary/80",

                // ACTIVE
                item.order === activeStepOrder && "bg-green-500 text-white ring-green-500",

                // NEXT
                item.order > (activeStepOrder ?? 0) &&
                  "bg-gray-300 ring-gray-400 dark:bg-gray-700 dark:ring-gray-600",
              )}
            >
              {index + 1}

              {withAnimation && item.order === activeStepOrder && (
                <div className="absolute inset-0 animate-ping rounded-full bg-green-400/70" />
              )}
            </div>

            <p className="text-center text-sm">{item.title}</p>
          </div>

          {index + 1 < steps.length ? (
            <Separator
              className={cn("flex-1", item.order < (activeStepOrder ?? 0) && "bg-primary/80")}
              orientation="horizontal"
            />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};
