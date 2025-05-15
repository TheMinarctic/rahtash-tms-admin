import useSWR from "swr";
import { Edit, Plus, Trash } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { DateFormat } from "@/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import TableV2 from "@/components/ui/table/table-v2";
import { ModuleCardData } from "@/components/common/module-card-data";
import DynamicPaginator from "@/components/common/dynamic-paginator";
import ShipmentPortStatusBadge from "@/components/common/shipment-port-status-badge";
import { useIsOpen } from "@/hooks/use-is-open";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { toast } from "sonner";
import UpsertShipmentStepFrom from "./components/UpsertShipmentStepForm";

export default function ShipmentStepList() {
  const [searchParams] = useSearchParams();

  const upsertStep = useIsOpen();
  const deleteStep = useIsOpen();
  const deleteModalLoading = useIsOpen();
  const [initialData, setInitialData] = useState(null);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiRes<any[]>>(
    `/en/api/v1/shipment/step/list?${searchParams.toString()}`,
  );

  const handleCreate = () => {
    setInitialData(null);
    upsertStep.handleOpen();
  };

  const handleEdit = (data: any) => {
    setInitialData(data);
    upsertStep.handleOpen();
  };

  const handleDelete = (data: any) => {
    setInitialData(data);
    deleteStep.handleOpen();
  };

  const columns: ColumnDef<any>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Title", accessorKey: "title" },
    { header: "Order", accessorKey: "order" },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <ShipmentPortStatusBadge status={row.original.status} />,
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => DateFormat.YYYY_MM_DD(row.original.created_at),
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
        <h1 className="text-3xl font-bold">Shipment Steps</h1>
        <Button onClick={handleCreate}>
          Add New
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
      {/* ADD / EDIT SHIPMENT PORT */}
      <Dialog open={upsertStep.isOpen} onOpenChange={upsertStep.setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit shipment step" : "Create shipment step"}</DialogTitle>
          </DialogHeader>

          <UpsertShipmentStepFrom initialData={initialData} setIsOpen={upsertStep.setIsOpen} />
        </DialogContent>
      </Dialog>

      {/* DELETE SHIPMENT PORT */}
      <Dialog open={deleteStep.isOpen} onOpenChange={deleteStep.setIsOpen}>
        <ConfirmDialog
          loading={deleteModalLoading.isOpen}
          title="Delete shipment step"
          onSubmit={async () => {
            deleteModalLoading.setIsOpen(true);
            await axios
              .delete(`/en/api/v1/shipment/step/delete/${initialData?.id}/`)
              .then((res: AxiosResponse<ApiRes>) => {
                mutate();
                toast.success(res.data.message);
                deleteStep.handleClose();
              })
              .catch((err) => serverErrorToast(err))
              .finally(() => deleteModalLoading.setIsOpen(false));
          }}
        />
      </Dialog>
    </AppLayout>
  );
}
