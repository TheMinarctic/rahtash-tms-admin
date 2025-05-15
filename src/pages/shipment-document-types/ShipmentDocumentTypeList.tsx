import useSWR from "swr";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { ColumnDef } from "@tanstack/react-table";
import TableV2 from "@/components/ui/table/table-v2";
import { ModuleCardData } from "@/components/common/module-card-data";
import DynamicPaginator from "@/components/common/dynamic-paginator";
import ShipmentPortStatusBadge from "@/components/common/shipment-port-status-badge";
import { useState } from "react";
import { useIsOpen } from "@/hooks/use-is-open";
import { Edit, Plus, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { axios } from "@/lib/axios";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import UpsertShipmentDocumentTypeForm from "./components/UpsertShipmentDocumentTypeForm";

export default function ShipmentDocumentTypeList() {
  const [searchParams] = useSearchParams();

  const upsertDocType = useIsOpen();
  const deleteDocType = useIsOpen();
  const [initialData, setInitialData] = useState(null);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const { data, error, isLoading, isValidating, mutate } = useSWR<ApiRes<any[]>>(
    `/en/api/v1/shipment/document/type/list/?${searchParams.toString()}`,
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
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        return <ShipmentPortStatusBadge status={row.original.status} />;
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
            <DialogTitle>{initialData ? "Edit shipment port" : "Create shipment port"}</DialogTitle>
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
            await axios
              .delete(`/en/api/v1/shipment/document/type/delete/${initialData.id}/`)
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

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Sidebar from "@/components/layout/Sidebar";
// import { useApi } from "@/contexts/ApiProvider";

// export default function ShipmentDocumentTypeList() {
//   const [open, setOpen] = useState(true);
//   const [documentTypes, setDocumentTypes] = useState([]);
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

//   const fetchDocumentTypes = async (page = 1) => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/en/api/v1/shipment/document/type/list/?page=${page}`);
//       setDocumentTypes(response.body.data);
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
//     fetchDocumentTypes();
//   }, []);

//   const handlePageChange = (newPage) => {
//     fetchDocumentTypes(newPage);
//   };

//   const handleViewDetails = (documentTypeId) => {
//     navigate(`/shipment/document-types/${documentTypeId}`);
//   };

//   const handleCreate = () => {
//     navigate("/shipment/document-types/create");
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case 1:
//         return { text: "Active", color: "bg-green-900 text-green-200" };
//       case 2:
//         return { text: "Inactive", color: "bg-red-900 text-red-200" };
//       default:
//         return { text: "Unknown", color: "bg-gray-700 text-gray-300" };
//     }
//   };

//   return (
//     <div className="flex h-full bg-gray-900">
//       <Sidebar open={open} setOpen={setOpen} />

//       <div className="flex-1 flex flex-col md:h-screen bg-gradient-to-r from-gray-800 to-gray-900 overflow-auto">
//         <div className="flex-1 p-5">
//           <div className="max-w-7xl mx-auto">
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-3xl font-bold text-white">Document Types</h1>
//               <button
//                 onClick={handleCreate}
//                 className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
//               >
//                 Add New
//               </button>
//             </div>

//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//               </div>
//             ) : error ? (
//               <div className="bg-red-500 text-white p-4 rounded-lg">Error: {error}</div>
//             ) : (
//               <>
//                 <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-4">
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-700">
//                       <thead className="bg-gray-700">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
//                             ID
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
//                             Title
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
//                             Order
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
//                             Mandatory
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
//                             Status
//                           </th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-gray-800 divide-y divide-gray-700">
//                         {documentTypes.map((docType) => {
//                           const statusBadge = getStatusBadge(docType.status);
//                           return (
//                             <tr key={docType.id} className="hover:bg-gray-700 transition-colors">
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                                 {docType.id}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
//                                 {docType.title}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                                 {docType.order}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                                 {docType.is_mandatory ? "Yes" : "No"}
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap">
//                                 <span
//                                   className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusBadge.color}`}
//                                 >
//                                   {statusBadge.text}
//                                 </span>
//                               </td>
//                               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                                 <button
//                                   onClick={() => handleViewDetails(docType.id)}
//                                   className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                                 >
//                                   View
//                                 </button>
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Pagination */}
//                 <div className="flex items-center justify-between px-4 py-3 bg-gray-800 rounded-lg">
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
//                       className={`px-4 py-2 rounded-md ${
//                         pagination.currentPage === 1
//                           ? "bg-gray-700 text-gray-500 cursor-not-allowed"
//                           : "bg-gray-700 text-white hover:bg-gray-600"
//                       }`}
//                     >
//                       Previous
//                     </button>
//                     <button
//                       onClick={() => handlePageChange(pagination.currentPage + 1)}
//                       disabled={!pagination.nextLink}
//                       className={`px-4 py-2 rounded-md ${
//                         !pagination.nextLink
//                           ? "bg-gray-700 text-gray-500 cursor-not-allowed"
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
