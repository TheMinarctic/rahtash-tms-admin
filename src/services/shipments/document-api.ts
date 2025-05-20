import { axios } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

type CreateDocumentDto = {
  file?: File;
  type: number;
  verifier?: number;
  shipment: number;
};

export const ShipmentDocumentApi = {
  END_POINT: `/en/api/v1/shipment/document`,

  async create(data: CreateDocumentDto) {
    return await axios.post<ApiRes<ApiResponse.DocumentType>>(
      `${ShipmentDocumentApi.END_POINT}/create/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  async update(id: number, data: CreateDocumentDto) {
    return await axios.patch<ApiRes<ApiResponse.DocumentType>>(
      `${ShipmentDocumentApi.END_POINT}/update/${id}/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  async delete(id: number) {
    return await axios.delete(`${ShipmentDocumentApi.END_POINT}/delete/${id}/`);
  },
};
