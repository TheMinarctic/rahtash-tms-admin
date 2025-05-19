import React, { createContext, useContext, useState } from "react";

type ICreateShipment = {
  formStep: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
};

const CreateShipment = createContext({} as ICreateShipment);
export const useCreateShipmentContext = () => useContext(CreateShipment);

const CreateShipmentContext = ({ children }: { children: React.ReactNode }) => {
  const [formStep, setFormStep] = useState(1);

  return (
    <CreateShipment.Provider value={{ formStep, setFormStep }}>{children}</CreateShipment.Provider>
  );
};

export default CreateShipmentContext;
