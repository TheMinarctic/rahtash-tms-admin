import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ApiProvider from "./contexts/ApiProvider";
import { NextUIProvider } from "@nextui-org/react";

import UserDetail  from "./pages/SingleUser";
import ShipmentPage from "./pages/Users";
import CompaniesPage from "./pages/CompaniesPage";
import CompanyDetail from "./pages/CompanyDetail";
import DriversListPage from "./pages/DriversListPage";
import DriverDetailPage from "./pages/DriverDetailPage";
import ShipmentCategoryList from "./pages/ShipmentCategoryList";
import ShipmentCategoryCreate from "./pages/ShipmentCategoryCreate";
import ShipmentCategoryDetail from "./pages/ShipmentCategoryDetail";
import PortsPage from "./pages/ShipmentPortList";
import PortForm from "./pages/ShipmentPortDetail";
import ShipmentPortCreate from "./pages/ShipmentPortCreate";
import ShipmentPortDetail from "./pages/ShipmentPortDetail";
import ShipmentStepList from "./pages/ShipmentStepList";
import ShipmentStepCreate from "./pages/ShipmentStepCreate";
import ShipmentStepDetail from "./pages/ShipmentStepDetail";
import ShipmentDocumentTypeList from "./pages/ShipmentDocumentTypeList";
import ShipmentDocumentTypeCreate from "./pages/ShipmentDocumentTypeCreate";
import ShipmentDocumentTypeDetail from "./pages/ShipmentDocumentTypeDetail";
import ShipmentDocumentList from "./pages/ShipmentDocumentList";
import ShipmentDocumentCreate from "./pages/ShipmentDocumentCreate";
import ShipmentContainerList from "./pages/ShipmentContainerList";
import ShipmentContainerCreate from "./pages/ShipmentContainerCreate";
import ShipmentList from "./pages/ShipmentList";
import ShipmentCreate from "./pages/ShipmentCreate";
import ShipmentDetail from "./pages/ShipmentDetail";
import DriverCategoryList from "./pages/DriverCategoryList";
import DriverCategoryCreate from "./pages/DriverCategoryCreate";
import DriverCategoryDetail from "./pages/DriverCategoryDetail";
import DocumentTypeList from "./pages/DocumentTypeList";
import DocumentDetail from "./pages/DocumentDetail";
import DocumentCreate from "./pages/DocumentCreate";
import CompanyDocumentList from "./pages/CompanyDocumentList";
import CompanyDocumentDetail from "./pages/CompanyDocumentDetail";
import CompanyCategoryList from "./pages/CompanyCategoryList";
import CompanyCategoryCreate from "./pages/CompanyCategoryCreate";
import CompanyCategoryDetail from "./pages/CompanyCategoryDetail";
import AddressList from "./pages/AddressList";
import AddressDetail from "./pages/AddressDetail";
import AddressCreate from "./pages/AddressCreate";
import CompanyDocumentCreate from "./pages/CompanyDocumentCreate";
import ShipmentDocumentDetail from "./pages/ShipmentDocumentDetail";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/shipments" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <ShipmentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users/:userId"
        element={
          <ProtectedRoute>
            <UserDetail />
          </ProtectedRoute>
        }
      />
           <Route
        path="/companies"
        element={
          <ProtectedRoute>
            <CompaniesPage />
          </ProtectedRoute>
        }
      />
          <Route
        path="/companies/:compid"
        element={
          <ProtectedRoute>
           <CompanyDetail/>
          </ProtectedRoute>
        }
      />
             <Route
        path="/drivers"
        element={
          <ProtectedRoute>
            <DriversListPage />
          </ProtectedRoute>
        }
      />
                 <Route
        path="/shipment/categories"
        element={
          <ProtectedRoute>
            <ShipmentCategoryList />
          </ProtectedRoute>
        }
      />
                       <Route
        path="/shipment/categories/create"
        element={
          <ProtectedRoute>
            <ShipmentCategoryCreate />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/categories/:category_id"
        element={
          <ProtectedRoute>
            <ShipmentCategoryDetail />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/ports"
        element={
          <ProtectedRoute>
            <PortsPage />
          </ProtectedRoute>
        }
      />



<Route
        path="/shipment/ports/create"
        element={
          <ProtectedRoute>
            <ShipmentPortCreate />
          </ProtectedRoute>
        }
      />


<Route
        path="/shipment/ports/:port_id"
        element={
          <ProtectedRoute>
            <ShipmentPortDetail />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/steps"
        element={
          <ProtectedRoute>
            <ShipmentStepList />
          </ProtectedRoute>
        }
      />


<Route
        path="/shipment/steps/create"
        element={
          <ProtectedRoute>
            <ShipmentStepCreate />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/steps/:step_id"
        element={
          <ProtectedRoute>
            <ShipmentStepDetail />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/document-types"
        element={
          <ProtectedRoute>
            <ShipmentDocumentTypeList />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/document-types/create"
        element={
          <ProtectedRoute>
            <ShipmentDocumentTypeCreate />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/documents"
        element={
          <ProtectedRoute>
            <ShipmentDocumentList />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/documents/create"
        element={
          <ProtectedRoute>
            <ShipmentDocumentCreate />
          </ProtectedRoute>
        }
      />


<Route
        path="/shipment/containers"
        element={
          <ProtectedRoute>
            <ShipmentContainerList />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/containers/create"
        element={
          <ProtectedRoute>
            <ShipmentContainerCreate />
          </ProtectedRoute>
        }
      />


<Route
        path="/shipments"
        element={
          <ProtectedRoute>
            <ShipmentList />
          </ProtectedRoute>
        }
      />

<Route
        path="/driver/categories"
        element={
          <ProtectedRoute>
            <DriverCategoryList />
          </ProtectedRoute>
        }
      />

<Route
        path="/driver/categories/:category_id"
        element={
          <ProtectedRoute>
            <DriverCategoryDetail />
          </ProtectedRoute>
        }
      />
    
<Route
        path="/driver/categories/create"
        element={
          <ProtectedRoute>
            <DriverCategoryCreate />
          </ProtectedRoute>
        }
      />


<Route
        path="/driver/documents"
        element={
          <ProtectedRoute>
            <DocumentTypeList />
          </ProtectedRoute>
        }
      />

<Route
        path="/driver/documents/:document_id"
        element={
          <ProtectedRoute>
            <DocumentDetail />
          </ProtectedRoute>
        }
      />

<Route
        path="/driver/documents/create"
        element={
          <ProtectedRoute>
            <DocumentCreate />
          </ProtectedRoute>
        }
      />


<Route
        path="/shipments/:shipment_id"
        element={
          <ProtectedRoute>
            <ShipmentDetail />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipments/create"
        element={
          <ProtectedRoute>
            <ShipmentCreate />
          </ProtectedRoute>
        }
      />




<Route
        path="/shipment/document-types/:document_type_id"
        element={
          <ProtectedRoute>
            <ShipmentDocumentTypeDetail />
          </ProtectedRoute>
        }
      />



<Route
        path="/drivers/:driver_id"
        element={
          <ProtectedRoute>
            <DriverDetailPage />
          </ProtectedRoute>
        }
      />


<Route
        path="/company/documents"
        element={
          <ProtectedRoute>
            <CompanyDocumentList />
          </ProtectedRoute>
        }
      />

<Route
        path="/company/documents/:document_id"
        element={
          <ProtectedRoute>
            <CompanyDocumentDetail />
          </ProtectedRoute>
        }
      />


<Route
        path="/company/documents/create"
        element={
          <ProtectedRoute>
            <CompanyDocumentCreate />
          </ProtectedRoute>
        }
      />




<Route
        path="/company/categories"
        element={
          <ProtectedRoute>
            <CompanyCategoryList />
          </ProtectedRoute>
        }
      />

<Route
        path="/company/categories/create"
        element={
          <ProtectedRoute>
            <CompanyCategoryCreate />
          </ProtectedRoute>
        }
      />

<Route
        path="/company/categories/:category_id"
        element={
          <ProtectedRoute>
            <CompanyCategoryDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users/address"
        element={
          <ProtectedRoute>
            <AddressList />
          </ProtectedRoute>
        }
      />

<Route
        path="/user/addresses/:address_id"
        element={
          <ProtectedRoute>
            <AddressDetail />
          </ProtectedRoute>
        }
      />

<Route
        path="/user/addresses/create"
        element={
          <ProtectedRoute>
            <AddressCreate />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/documents"
        element={
          <ProtectedRoute>
            <ShipmentDocumentList />
          </ProtectedRoute>
        }
      />

<Route
        path="/shipment/documents/:document_id"
        element={
          <ProtectedRoute>
            <ShipmentDocumentDetail />
          </ProtectedRoute>
        }
      />



    </Routes>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NextUIProvider>
      <ApiProvider>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <AppRoutes />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </ApiProvider>
    </NextUIProvider>
  </QueryClientProvider>
);

export default App;