import { ReactNode } from "react";
import SwrProvider from "./SwrProvider";
import ApiProvider from "@/contexts/ApiProvider";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { TooltipProvider } from "@/components/ui/tooltip";

const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <NextUIProvider>
      <ApiProvider>
        <AuthProvider>
          <SwrProvider>
            <TooltipProvider>
              {children}

              <Toaster />
              <Sonner />
            </TooltipProvider>
          </SwrProvider>
        </AuthProvider>
      </ApiProvider>
    </NextUIProvider>
  );
};

export default AppProviders;
