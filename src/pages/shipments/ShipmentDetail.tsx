// ShipmentDetail.tsx
import { useState, useEffect, ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { useApi } from "@/contexts/ApiProvider";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import moment from "jalali-moment";
import { DateFormat } from "@/utils/date";
import ShipmentStatusBadge from "@/components/common/shipment-status-badge";
import useSWR from "swr";
import { ModuleCardData } from "@/components/common/module-card-data";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShipmentDetail() {
  const { shipment_id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isValidating, error } = useSWR<ApiRes>(
    `/en/api/v1/shipment/detail/${shipment_id}/`,
  );
  const shipment = data?.data;

  return (
    <AppLayout classNames={{ container: "max-w-6xl" }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Shipment Details</CardTitle>

            <Button variant="outline" onClick={() => navigate("/shipments")}>
              <ArrowLeft className="!me-1.5 !ms-0" />
              Back to Shipments
            </Button>
          </div>
        </CardHeader>

        <ModuleCardData isLoading={isLoading} error={error} isValidating={isValidating}>
          <CardContent>
            <div className="flex flex-col gap-8">
              {/* SHIPMENT DETAILS */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-4">
                  <RowDetail title="ID" value={shipment?.id} />
                  <RowDetail
                    title="Bill of Lading Number"
                    value={shipment?.bill_of_lading_number_id || "N/A"}
                  />
                  <RowDetail
                    title="Contains Dangerous Goods"
                    value={shipment?.contains_dangerous_good ? "Yes" : "No"}
                  />
                  <RowDetail
                    title="Date of Loading"
                    value={
                      shipment?.date_of_loading
                        ? `${DateFormat.YYYY_MM_DD(shipment?.date_of_loading)} | ${DateFormat.YYYY_MM_DD(shipment?.date_of_loading, { locale: "fa" })}`
                        : "N/A"
                    }
                  />
                </div>

                <div className="space-y-4">
                  <RowDetail
                    title="Status"
                    value={<ShipmentStatusBadge status={shipment?.status} />}
                  />
                  <RowDetail title="Notes" value={shipment?.note || "N/A"} />
                  <RowDetail
                    title="Created At"
                    value={DateFormat.YYYY_MM_DD(shipment?.created_at)}
                  />
                  <RowDetail
                    title="Updated At"
                    value={DateFormat.YYYY_MM_DD(shipment?.updated_at)}
                  />
                </div>
              </div>

              <hr />

              {/* Related entities */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <RelatedEntity
                  title="Carrier Company"
                  showEmptyText={!shipment?.carrier_company}
                  values={[
                    `Name: ${shipment?.carrier_company?.name}`,
                    `Category: ${shipment?.carrier_company?.category?.title || "N/A"}`,
                    `Owner: ${shipment?.carrier_company?.owner?.email || "N/A"}`,
                  ]}
                />

                <RelatedEntity
                  title="Forward Company"
                  showEmptyText={!shipment?.forward_company}
                  values={[
                    `Name: ${shipment?.forward_company?.name}`,
                    `Category: ${shipment?.forward_company?.category?.title || "N/A"}`,
                    `Owner: ${shipment?.forward_company?.owner?.email || "N/A"}`,
                  ]}
                />

                <RelatedEntity
                  title="Driver"
                  showEmptyText={!shipment?.driver}
                  values={[
                    `Name: ${shipment?.driver?.title}`,
                    `Category: ${shipment?.driver?.category?.title || "N/A"}`,
                    `Owner: ${shipment?.driver?.user?.email || "N/A"}`,
                  ]}
                />

                <RelatedEntity
                  title="Current Step"
                  showEmptyText={!shipment?.step}
                  emptyText="No step assigned"
                  values={[`Title: ${shipment?.step?.title}`, `Order: ${shipment?.step?.order}`]}
                />

                <RelatedEntity
                  title="Loading Port"
                  showEmptyText={!shipment?.port_loading}
                  emptyText="No loading port assigned"
                  values={[
                    `Title: ${shipment?.port_loading?.title}`,
                    `Country: ${shipment?.port_loading?.country}`,
                  ]}
                />

                <RelatedEntity
                  title="Discharge Port"
                  showEmptyText={!shipment?.port_discharge}
                  emptyText="No discharge port assigned"
                  values={[
                    `Title: ${shipment?.port_discharge?.title}`,
                    `Country: ${shipment?.port_discharge?.country}`,
                  ]}
                />

                <RelatedEntity
                  title="Place of Delivery"
                  showEmptyText={!shipment?.place_delivery}
                  values={[
                    `Title: ${shipment?.place_delivery?.title}`,
                    `Country: ${shipment?.place_delivery?.country}`,
                  ]}
                />
              </div>
            </div>
          </CardContent>
        </ModuleCardData>
      </Card>
    </AppLayout>
  );
}

const RowDetail = ({ title, value }: { title: ReactNode; value: ReactNode }) => {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p>{value}</p>
    </div>
  );
};

const RelatedEntity = ({
  emptyText,
  title,
  values,
  showEmptyText = true,
}: {
  title: string;
  values: string[];
  emptyText?: string;
  showEmptyText?: boolean;
}) => {
  return (
    <Card className="bg-muted">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="py-4">
        {!showEmptyText ? (
          <div>
            {values.map((text, index) => (
              <p className="text-muted-foreground" key={text + index}>
                {text}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{emptyText || `No ${title} assigned`}</p>
        )}
      </CardContent>
    </Card>
  );
};
