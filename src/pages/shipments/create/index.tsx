import useSWR from "swr";
import { ApiResponse } from "@/types/api";
import { useParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Stepper } from "@/components/ui/stepper";
import CreateShipmentContext, { useCreateShipmentContext } from "./context/create-shipment-context";
import CreateShipmentConditions from "./create-shipment-conditions";

const CreateShipmentPage = () => {
  return (
    <CreateShipmentContext>
      <AppLayout>
        <CreateShipmentConditions />
      </AppLayout>
    </CreateShipmentContext>
  );
};

export default CreateShipmentPage;
