import useSWR from "swr";
import { toast } from "sonner";
import { useState } from "react";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { DateFormat } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { useIsOpen } from "@/hooks/use-is-open";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import TableV2 from "@/components/ui/table/table-v2";
import AppLayout from "@/components/layout/AppLayout";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import DynamicPaginator from "@/components/common/dynamic-paginator";
import { ModuleCardData } from "@/components/common/module-card-data";
import UpsertShipmentPortFrom from "./components/UpsertShipmentPortForm";
import ShipmentPortStatusBadge from "@/components/common/shipment-port-status-badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CountriesEnum } from "@/enums/countries-enum";

export default function ShipmentPortList() {
  const [searchParams] = useSearchParams();

  const upsertPort = useIsOpen();
  const deletePort = useIsOpen();
  const [initialData, setInitialData] = useState(null);
  const [deleteModalLoading, setDeleteModalLoading] = useState(false);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiRes<any[]>>(
    `/en/api/v1/shipment/port/list?${searchParams.toString()}`,
  );

  const handleCreate = () => {
    setInitialData(null);
    upsertPort.handleOpen();
  };

  const handleEdit = (data: any) => {
    setInitialData(data);
    upsertPort.handleOpen();
  };

  const handleDelete = (data: any) => {
    setInitialData(data);
    deletePort.handleOpen();
  };

  const columns: ColumnDef<any>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Title", accessorKey: "title" },
    {
      header: "Country",
      accessorKey: "country",
      cell: ({ row: { original } }) => CountriesEnum[original.country],
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => <ShipmentPortStatusBadge status={row.original.status} />,
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row: { original } }) => DateFormat.YYYY_MM_DD(original.created_at),
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
        <h1 className="text-3xl font-bold">Shipment Ports</h1>
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

        {/* Pagination */}
        <DynamicPaginator
          page_now={data?.page_now}
          per_page={data?.per_page}
          total_results={data?.total_results}
        />
      </ModuleCardData>

      {/* MODALS */}
      {/* ADD / EDIT SHIPMENT PORT */}
      <Dialog open={upsertPort.isOpen} onOpenChange={upsertPort.setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{initialData ? "Edit shipment port" : "Create shipment port"}</DialogTitle>
          </DialogHeader>

          <UpsertShipmentPortFrom initialData={initialData} setIsOpen={upsertPort.setIsOpen} />
        </DialogContent>
      </Dialog>

      {/* DELETE SHIPMENT PORT */}
      <Dialog open={deletePort.isOpen} onOpenChange={deletePort.setIsOpen}>
        <ConfirmDialog
          loading={deleteModalLoading}
          title="Delete shipment port"
          onSubmit={async () => {
            setDeleteModalLoading(true);
            await axios
              .delete(`/en/api/v1/shipment/port/delete/${initialData?.id}/`)
              .then((res: AxiosResponse<ApiRes>) => {
                toast.success(res.data.message);
                mutate();
                deletePort.handleClose();
              })
              .catch((err) => serverErrorToast(err))
              .finally(() => setDeleteModalLoading(false));
          }}
        />
      </Dialog>
    </AppLayout>
  );
}
