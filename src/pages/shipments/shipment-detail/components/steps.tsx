import React from "react";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { ApiResponse } from "@/types/api";
import { Separator } from "@/components/ui/separator";
import { ModuleCardData } from "@/components/common/module-card-data";
import { Stepper } from "@/components/ui/stepper";

const ShipmentDetailSteps = ({ shipment }: { shipment?: ApiResponse.Shipment }) => {
  const steps = useSWR<ApiRes<ApiResponse.Step[]>>(`/en/api/v1/shipment/step/list/`);

  return (
    <ModuleCardData isLoading={steps.isLoading} error={steps.error} skeletonRowCount={2}>
      <div className="flex flex-col gap-2 pb-3">
        <h4 className="text-xl">Steps</h4>

        <div className="flex items-center justify-between">
          <Stepper
            activeStepOrder={shipment?.step?.order}
            steps={steps?.data?.data.map((item) => ({
              id: item.id,
              order: item.order,
              title: item.title,
            }))}
          />

          {/* {steps.data?.data.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className="mt-7 flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "center relative size-9 rounded-full border bg-muted ring-2 ring-gray-200 ring-offset-2 ring-offset-background dark:ring-gray-800",

                    item.order < shipment?.step?.order &&
                      "bg-primary/80 text-primary-foreground ring-primary/80",

                    item.order === shipment?.step?.order &&
                      "bg-green-500 text-white ring-green-500",

                    item.order > shipment?.step?.order &&
                      "bg-gray-300 ring-gray-400 dark:bg-gray-700 dark:ring-gray-600",
                  )}
                >
                  {index + 1}

                  {item.order === shipment?.step?.order && (
                    <div className="absolute inset-0 animate-ping rounded-full bg-green-400/70"></div>
                  )}
                </div>

                <p>{item.title}</p>
              </div>

              {index + 1 < steps.data?.data.length ? (
                <Separator
                  className={cn("flex-1", item.order < shipment?.step?.order && "bg-primary/80")}
                  orientation="horizontal"
                />
              ) : null}
            </React.Fragment>
          ))} */}
        </div>
      </div>
    </ModuleCardData>
  );
};

export default ShipmentDetailSteps;
