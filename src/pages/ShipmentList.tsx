// ShipmentList.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApi } from "@/contexts/ApiProvider";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import useSWR from "swr";
import { ApiResponse } from "@/ApiClient";
import DynamicPaginator from "@/components/common/dynamic-paginator";
import { objectToQueryString } from "@/utils/object-to-query-string";
import { ModuleCardData } from "@/components/common/module-card-data";
import { ColumnDef } from "@tanstack/react-table";
import TableV2 from "@/components/ui/table/table-v2";

export default function ShipmentList() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const { data, error, isLoading } = useSWR<ApiResponse<any[]>>(
    `/en/api/v1/shipment/list?${searchParams.toString()}`,
  );

  const handleViewDetails = (shipmentId) => {
    navigate(`/shipments/${shipmentId}`);
  };

  const handleCreate = () => {
    navigate("/shipments/create");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return { text: "Pending", color: "bg-amber-100/50 text-amber-800" };
      case 2:
        return { text: "In Progress", color: "bg-blue-100/50 text-blue-800" };
      case 3:
        return { text: "Completed", color: "bg-green-100/50 text-green-800" };
      case 4:
        return { text: "Cancelled", color: "bg-red-100/50 text-red-800" };
      default:
        return { text: "Unknown", color: "bg-gray-100/50 text-gray-800" };
    }
  };

  const columns: ColumnDef<any>[] = [
    { header: "ID", accessorKey: "id" },
    {
      header: "B/L number",
      accessorKey: "bill_of_lading_number_id",
      cell: ({ row: { original } }) => original?.bill_of_lading_number_id || "N/A",
    },
    { header: "carrier", cell: ({ row: { original } }) => original.carrier_company?.name || "N/A" },
    {
      header: "loading port",
      cell: ({ row: { original } }) => original.port_loading?.title || "N/A",
    },
    {
      header: "discharge port",
      cell: ({ row: { original } }) => original.port_discharge?.title || "N/A",
    },
    {
      header: "status",
      cell: ({ row: { original } }) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusBadge(original.status).color}`}
        >
          {getStatusBadge(original.status).text}
        </span>
      ),
    },
    {
      header: "created at",
      cell: ({ row: { original } }) => new Date(original.created_at).toLocaleDateString(),
    },
    {
      header: "actions",
      cell: ({ row: { original } }) => (
        <Button
          size="icon"
          className="bg-acc"
          variant="ghost"
          onClick={() => handleViewDetails(original.id)}
        >
          <Eye />
        </Button>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shipments</h1>

        <Button onClick={handleCreate}>
          Add New
          <Plus />
        </Button>
      </div>

      <ModuleCardData isLoading={isLoading} error={error} isDataEmpty={!data?.body.data.length}>
        <TableV2 columns={columns} data={data?.body?.data || []} />

        {/* Pagination */}
        <DynamicPaginator
          page_now={data?.body?.page_now}
          per_page={data?.body?.per_page}
          total_results={data?.body?.total_results}
        />
        {/* <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-3">
            <div>
              <p className="text-sm text-gray-400">
                Page <span className="font-medium">{pagination.currentPage}</span> of{" "}
                <span className="font-medium">
                  {Math.ceil(pagination.totalResults / pagination.perPage)}
                </span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                // onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`rounded-md px-4 py-2 ${
                  pagination.currentPage === 1
                    ? "cursor-not-allowed bg-gray-700 text-gray-500"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.nextLink}
                className={`rounded-md px-4 py-2 ${
                  !pagination.nextLink
                    ? "cursor-not-allowed bg-gray-700 text-gray-500"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                Next
              </button>
            </div>
          </div> */}
      </ModuleCardData>
    </AppLayout>
  );
}
