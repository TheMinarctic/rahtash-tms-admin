import { axios } from "@/lib/axios";
import { ApiResponse } from "@/types/api";

type CreateTypeDto = {
  title?: string;
  order?: number;
  type?: number;
  is_mandatory?: boolean;
};

export const ShipmentDocumentTypeApi = {
  END_POINT: `/en/api/v1/shipment/document/type`,

  async create(data: CreateTypeDto) {
    return await axios.post<ApiRes<ApiResponse.DocumentType>>(
      `${ShipmentDocumentTypeApi.END_POINT}/create/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  async update(id: number, data: CreateTypeDto) {
    return await axios.patch<ApiRes<ApiResponse.DocumentType>>(
      `${ShipmentDocumentTypeApi.END_POINT}/update/${id}/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  async delete(id: number) {
    return await axios.delete(`${ShipmentDocumentTypeApi.END_POINT}/delete/${id}/`);
  },
};
