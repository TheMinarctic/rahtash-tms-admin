// ShipmentList.tsx
import { useNavigate, useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Eye, Plus } from "lucide-react";
import useSWR from "swr";
import DynamicPaginator from "@/components/common/dynamic-paginator";
import { objectToQueryString } from "@/utils/object-to-query-string";
import { ModuleCardData } from "@/components/common/module-card-data";
import { ColumnDef } from "@tanstack/react-table";
import TableV2 from "@/components/ui/table/table-v2";

export default function ShipmentList() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const { data, error, isLoading } = useSWR<ApiRes<any[]>>(
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
        return {
          text: "Pending",
          color: "bg-amber-100/50 text-amber-800 dark:text-amber-50 dark:bg-amber-700",
        };
      case 2:
        return {
          text: "In Progress",
          color: "bg-blue-100/50 text-blue-800 dark:text-blue-50 dark:bg-blue-800",
        };
      case 3:
        return {
          text: "Completed",
          color: "bg-green-100/50 text-green-800 dark:text-green-50 dark:bg-green-800",
        };
      case 4:
        return {
          text: "Cancelled",
          color: "bg-red-100/50 text-red-800 dark:text-red-50 dark:bg-red-800",
        };
      default:
        return {
          text: "Unknown",
          color: "bg-gray-100/50 text-gray-800 dark:text-gray-50 dark:bg-gray-800",
        };
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

      <ModuleCardData isLoading={isLoading} error={error} isDataEmpty={!data?.data.length}>
        <TableV2 columns={columns} data={data?.data || []} />

        {/* Pagination */}
        <DynamicPaginator
          page_now={data?.page_now}
          per_page={data?.per_page}
          total_results={data?.total_results}
        />
      </ModuleCardData>
    </AppLayout>
  );
}
