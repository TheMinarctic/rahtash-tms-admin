import useSWR from "swr";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { ColumnDef } from "@tanstack/react-table";
import TableV2 from "@/components/ui/table/table-v2";
import { useState } from "react";
import { useIsOpen } from "@/hooks/use-is-open";
import { Edit, Plus, Trash } from "lucide-react";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { axios } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import { Badge } from "@/components/ui/badge";
import { DocumentTypeEnum } from "@/enums/document-type";
import DynamicPaginator from "@/components/common/dynamic-paginator";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { ModuleCardData } from "@/components/common/module-card-data";
import { ShipmentDocumentTypeApi } from "@/services/shipments/document-type-api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UpsertShipmentDocumentTypeForm from "./components/UpsertShipmentDocumentTypeForm";

export default function ShipmentDocumentTypeList() {
  const [searchParams] = useSearchParams();

  const upsertDocType = useIsOpen();
  const deleteDocType = useIsOpen();
  const [initialData, setInitialData] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiRes<any[]>>(
    `${ShipmentDocumentTypeApi.END_POINT}/list/?${searchParams.toString()}`,
  );

  const handleCreate = () => {
    setInitialData(null);
    upsertDocType.handleOpen();
  };

  const handleEdit = (data: any) => {
    setInitialData(data);
    upsertDocType.handleOpen();
  };

  const handleDelete = (data: any) => {
    setInitialData(data);
    deleteDocType.handleOpen();
  };

  const columns: ColumnDef<any>[] = [
    { header: "ID", accessorKey: "id" },
    { header: "Title", accessorKey: "title" },
    { header: "Order", accessorKey: "order" },
    {
      header: "Mandatory",
      accessorKey: "is_mandatory",
      cell: ({ row }) => (row.original.is_mandatory ? "Yes" : "No"),
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        return <Badge variant="outline">{DocumentTypeEnum[row.original.type]}</Badge>;
      },
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
        <h1 className="text-3xl font-bold">Document Types</h1>
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
      <Dialog open={upsertDocType.isOpen} onOpenChange={upsertDocType.setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {initialData ? "Edit shipment document type" : "Create shipment document type"}
            </DialogTitle>
          </DialogHeader>

          <UpsertShipmentDocumentTypeForm
            mutate={mutate}
            initialData={initialData}
            setIsOpen={upsertDocType.setIsOpen}
          />
        </DialogContent>
      </Dialog>

      {/* DELETE SHIPMENT PORT */}
      <Dialog open={deleteDocType.isOpen} onOpenChange={deleteDocType.setIsOpen}>
        <ConfirmDialog
          loading={isLoadingDelete}
          title="Delete shipment document type"
          onSubmit={async () => {
            setIsLoadingDelete(true);
            await ShipmentDocumentTypeApi.delete(initialData.id)
              .then((res: AxiosResponse<ApiRes>) => {
                mutate();
                toast.success(res.data.message);
                deleteDocType.handleClose();
              })
              .catch((err) => serverErrorToast(err))
              .finally(() => setIsLoadingDelete(false));
          }}
        />
      </Dialog>
    </AppLayout>
  );
}
