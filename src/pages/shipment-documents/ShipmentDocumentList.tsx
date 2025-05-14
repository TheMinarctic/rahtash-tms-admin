import useSWR from "swr";
import { useState } from "react";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
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

export default function ShipmentDocumentList() {
  const [searchParams] = useSearchParams();

  const upsertDoc = useIsOpen();
  const deleteDoc = useIsOpen();
  const [initialData, setInitialData] = useState(null);
  const [isLoadingDeleteModal, setIsLoadingDeleteModal] = useState(false);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiRes<any[]>>(
    `/en/api/v1/shipment/document/list/?${searchParams.toString()}`,
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
          title="Delete shipment port"
          onSubmit={async () => {
            setIsLoadingDeleteModal(true);
            await axios
              .delete(`/en/api/v1/shipment/document/delete/${initialData?.id}/`)
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

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "@/components/layout/Sidebar";
// import { useApi } from "@/contexts/ApiProvider";

// export default function ShipmentDocumentList() {
//   const [open, setOpen] = useState(true);
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     totalResults: 0,
//     perPage: 15,
//     currentPage: 1,
//     nextLink: null,
//   });
//   const navigate = useNavigate();
//   const api = useApi();

//   const fetchDocuments = async (page = 1) => {
//     try {
//       setLoading(true);

//       const response = await api.get(`/en/api/v1/shipment/document/list/?page=${page}`);
//       setDocuments(response.body.data);
//       setPagination({
//         totalResults: response.body.total_results,
//         perPage: response.body.per_page,
//         currentPage: response.body.page_now,
//         nextLink: response.body.next_link,
//       });
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDocuments();
//   }, []);

//   const handlePageChange = (newPage) => {
//     fetchDocuments(newPage);
//   };

//   const handleViewDetails = (documentId) => {
//     navigate(`/shipment/documents/${documentId}`);
//   };

//   const handleCreate = () => {
//     navigate("/shipment/documents/create");
//   };

//   const getFileType = (fileName) => {
//     if (!fileName) return "Unknown";
//     const extension = fileName.split(".").pop().toLowerCase();
//     if (["pdf"].includes(extension)) return "PDF";
//     if (["jpg", "jpeg", "png", "gif"].includes(extension)) return "Image";
//     if (["doc", "docx"].includes(extension)) return "Word";
//     if (["xls", "xlsx"].includes(extension)) return "Excel";
//     return extension.toUpperCase();
//   };

//   return (
//     <div className="flex h-full bg-gray-900">
//       <Sidebar open={open} setOpen={setOpen} />
//       <div className="flex flex-1 flex-col overflow-auto bg-gradient-to-r from-gray-800 to-gray-900 md:h-screen">
//         <div className="flex-1 p-5">
//           <div className="mx-auto max-w-7xl">
//             <div className="mb-6 flex items-center justify-between">
//               <h1 className="text-3xl font-bold text-white">Shipment Documents</h1>
//               <button
//                 onClick={handleCreate}
//                 className="rounded-md bg-gray-700 px-4 py-2 text-white transition-colors hover:bg-gray-600"
//               >
//                 Add New
//               </button>
//             </div>

//             {loading ? (
//               <div className="flex h-64 items-center justify-center">
//                 <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
//               </div>
//             ) : error ? (
//               <div className="rounded-lg bg-red-500 p-4 text-white">Error: {error}</div>
//             ) : (
//               <>
//                 <div className="mb-4 overflow-hidden rounded-xl bg-gray-800 shadow-lg">
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-700">
//                       <thead className="bg-gray-700">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                             ID
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                             Shipment
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                             Document Type
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                             File Type
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                             Created At
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-gray-700 bg-gray-800">
//                         {documents.map((document) => (
//                           <tr key={document.id} className="transition-colors hover:bg-gray-700">
//                             <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
//                               {document.id}
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4 text-sm text-white">
//                               {document.shipment?.bill_of_lading_number_id || "N/A"}
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
//                               {document.type?.title || "N/A"}
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
//                               {getFileType(document.file)}
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
//                               {new Date(document.created_at).toLocaleDateString()}
//                             </td>
//                             <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-300">
//                               <button
//                                 onClick={() => handleViewDetails(document.id)}
//                                 className="rounded-md bg-blue-600 px-3 py-1 text-white transition-colors hover:bg-blue-700"
//                               >
//                                 View
//                               </button>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-3">
//                   <div>
//                     <p className="text-sm text-gray-400">
//                       Page <span className="font-medium">{pagination.currentPage}</span> of{" "}
//                       <span className="font-medium">
//                         {Math.ceil(pagination.totalResults / pagination.perPage)}
//                       </span>
//                     </p>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handlePageChange(pagination.currentPage - 1)}
//                       disabled={pagination.currentPage === 1}
//                       className={`rounded-md px-4 py-2 ${
//                         pagination.currentPage === 1
//                           ? "cursor-not-allowed bg-gray-700 text-gray-500"
//                           : "bg-gray-700 text-white hover:bg-gray-600"
//                       }`}
//                     >
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => handlePageChange(pagination.currentPage + 1)}
//                       disabled={!pagination.nextLink}
//                       className={`rounded-md px-4 py-2 ${
//                         !pagination.nextLink
//                           ? "cursor-not-allowed bg-gray-700 text-gray-500"
//                           : "bg-gray-700 text-white hover:bg-gray-600"
//                       }`}
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
