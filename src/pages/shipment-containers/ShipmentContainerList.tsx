import useSWR from "swr";
import { toast } from "sonner";
import { useState } from "react";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useIsOpen } from "@/hooks/use-is-open";
import { useSearchParams } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import TableV2 from "@/components/ui/table/table-v2";
import { Edit, Plus, Trash } from "lucide-react";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { ModuleCardData } from "@/components/common/module-card-data";
import DynamicPaginator from "@/components/common/dynamic-paginator";
import ShipmentPortStatusBadge from "@/components/common/shipment-port-status-badge";
import UpsertShipmentContainerForm from "./components/UpsertShipmentContainerForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ShipmentContainerList() {
  const [searchParams] = useSearchParams();

  const upsetContainer = useIsOpen();
  const deleteContainer = useIsOpen();
  const [initialData, setInitialData] = useState(null);
  const [deleteModalLoading, setDeleteModalLoading] = useState(false);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiRes<any[]>>(
    `/en/api/v1/shipment/container/list/?${searchParams.toString()}`,
  );

  const handleCreate = () => {
    setInitialData(null);
    upsetContainer.handleOpen();
  };

  const handleEdit = (data: any) => {
    setInitialData(data);
    upsetContainer.handleOpen();
  };

  const handleDelete = (data: any) => {
    setInitialData(data);
    deleteContainer.handleOpen();
  };

  const getContainerType = (type: number) => {
    switch (type) {
      case 1:
        return "Dry";
      case 2:
        return "Reefer";
      case 3:
        return "Open Top";
      case 4:
        return "Flat Rack";
      default:
        return "Unknown";
    }
  };

  const columns: ColumnDef<any>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Track Number", accessorKey: "track_number" },
    { header: "Size", accessorKey: "size" },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => getContainerType(row.original.type),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <ShipmentPortStatusBadge status={row.original.status} />,
    },
    {
      header: "Shipment",
      accessorKey: "shipment",
      cell: ({ row }) => row.original.shipment?.bill_of_lading_number_id || "N/A",
    },
    {
      header: "Actions",
      cell: ({ row: { original } }) => (
        <div className="center">
          <Button size="icon" variant="ghost" onClick={() => handleEdit(original)}>
            <Edit />
          </Button>

          <Button size="icon" variant="ghost" onClick={() => handleDelete(original)}>
            <Trash />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shipment Containers</h1>
        <Button onClick={handleCreate}>
          Create Container
          <Plus className="ms-2" />
        </Button>
      </div>

      <ModuleCardData
        error={error}
        isLoading={isLoading}
        isValidating={isValidating}
        isDataEmpty={!data?.data?.length}
      >
        <TableV2 columns={columns} data={data?.data || []} />

        <DynamicPaginator
          page_now={data?.page_now}
          per_page={data?.per_page}
          total_results={data?.total_results}
        />
      </ModuleCardData>

      {/* MODALS */}
      {/* ADD / EDIT CONTAINER */}
      <Dialog open={upsetContainer.isOpen} onOpenChange={upsetContainer.setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit shipment container" : "Create shipment container"}
            </DialogTitle>
          </DialogHeader>

          <UpsertShipmentContainerForm
            mutate={mutate}
            initialData={initialData}
            setIsOpen={upsetContainer.setIsOpen}
          />
        </DialogContent>
      </Dialog>

      {/* DELETE SHIPMENT PORT */}
      <Dialog open={deleteContainer.isOpen} onOpenChange={deleteContainer.setIsOpen}>
        <ConfirmDialog
          loading={deleteModalLoading}
          title="Delete shipment container"
          onSubmit={async () => {
            setDeleteModalLoading(true);
            await axios
              .delete(`/en/api/v1/shipment/container/delete/${initialData.id}/`)
              .then((res: AxiosResponse<ApiRes>) => {
                toast.success(res.data.message);
                mutate();
                deleteContainer.handleClose();
              })
              .catch((err) => serverErrorToast(err))
              .finally(() => setDeleteModalLoading(false));
          }}
        />
      </Dialog>
    </AppLayout>
  );
}
