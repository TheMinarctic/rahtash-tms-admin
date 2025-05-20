import useSWR from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import { DateFormat } from "@/utils/date";
import { Button } from "@/components/ui/button";
import { getFileType } from "@/utils/file-type";
import { useIsOpen } from "@/hooks/use-is-open";
import { Plus, Edit, Trash, File } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import TableV2 from "@/components/ui/table/table-v2";
import AppLayout from "@/components/layout/AppLayout";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import DynamicPaginator from "@/components/common/dynamic-paginator";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { ModuleCardData } from "@/components/common/module-card-data";
import UpsertShipmentDocumentForm from "./components/UpsertShipmentDocumentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShipmentDocumentApi } from "@/services/shipments/document-api";

export default function ShipmentDocumentList() {
  const [searchParams] = useSearchParams();

  const upsertDoc = useIsOpen();
  const deleteDoc = useIsOpen();
  const [initialData, setInitialData] = useState(null);
  const [isLoadingDeleteModal, setIsLoadingDeleteModal] = useState(false);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiRes<any[]>>(
    `${ShipmentDocumentApi.END_POINT}/list/?${searchParams.toString()}`,
  );

  const handleCreate = () => {
    setInitialData(null);
    upsertDoc.handleOpen();
  };

  const handleEdit = (data: any) => {
    setInitialData(data);
    upsertDoc.handleOpen();
  };

  const handleDelete = (data: any) => {
    setInitialData(data);
    deleteDoc.handleOpen();
  };

  const columns: ColumnDef<any>[] = [
    { header: "ID", accessorKey: "id" },
    {
      header: "Shipment",
      accessorKey: "shipment.bill_of_lading_number_id",
      cell: ({ row }: any) => row.original.shipment?.bill_of_lading_number_id || "N/A",
    },
    {
      header: "Document Type",
      accessorKey: "type.title",
      cell: ({ row }: any) => row.original.type?.title || "N/A",
    },
    {
      header: "File Type",
      accessorKey: "file",
      cell: ({ row }: any) => getFileType(row.original.file),
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
          <Button size="icon" variant="ghost" onClick={() => window.open(original?.file, "_blank")}>
            <File />
          </Button>

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
        <h1 className="text-3xl font-bold text-white">Shipment Documents</h1>
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
      {/* ADD / EDIT DOCUMENT */}
      <Dialog open={upsertDoc.isOpen} onOpenChange={upsertDoc.setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit shipment document" : "Create shipment document"}
            </DialogTitle>
          </DialogHeader>

          <UpsertShipmentDocumentForm initialData={initialData} setIsOpen={upsertDoc.setIsOpen} />
        </DialogContent>
      </Dialog>

      {/* DELETE SHIPMENT PORT */}
      <Dialog open={deleteDoc.isOpen} onOpenChange={deleteDoc.setIsOpen}>
        <ConfirmDialog
          loading={isLoadingDeleteModal}
          title="Delete shipment document"
          onSubmit={async () => {
            setIsLoadingDeleteModal(true);
            await ShipmentDocumentApi.delete(initialData?.id)
              .then((res: AxiosResponse<ApiRes>) => {
                toast.success(res.data.message);
                mutate();
                deleteDoc.handleClose();
              })
              .catch((err) => serverErrorToast(err))
              .finally(() => setIsLoadingDeleteModal(false));
          }}
        />
      </Dialog>
    </AppLayout>
  );
}
