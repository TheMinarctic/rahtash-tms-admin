import React from "react";
import useSWR from "swr";
import { ApiResponse } from "@/types/api";
import { useParams } from "react-router-dom";
import { Stepper } from "@/components/ui/stepper";
import { useCreateShipmentContext } from "./context/create-shipment-context";
import CreateShipmentFirstStep from "./components/create-shipment-first-step";
import CreateShipmentSecondStep from "./components/create-shipment-second-step";

const CreateShipmentConditions = () => {
  const { id } = useParams();
  const { formStep, setFormStep } = useCreateShipmentContext();

  const { data, error, isLoading, isValidating } = useSWR<ApiRes<ApiResponse.Shipment>>(
    id === "initial" ? null : `/en/api/v1/shipment/detail/${id}/`,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
        <h1 className="text-2xl">Create Shipment Steps</h1>

        <Stepper
          activeStepOrder={formStep}
          steps={[
            { id: 1, order: 1, title: "Initial Data" },
            { id: 2, order: 2, title: "Documents" },
            { id: 3, order: 3, title: "Additional Data" },
          ]}
        />
      </div>

      {formStep === 1 ? (
        <CreateShipmentFirstStep />
      ) : formStep === 2 ? (
        <CreateShipmentSecondStep />
      ) : null}
    </div>
  );
};

export default CreateShipmentConditions;
