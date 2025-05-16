// ShipmentDetail.tsx
import React from "react";
import useSWR from "swr";
import { ReactNode } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { ApiResponse } from "@/types/api";
import { DateFormat } from "@/utils/date";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { useParams, useNavigate } from "react-router-dom";
import { ModuleCardData } from "@/components/common/module-card-data";
import ShipmentStatusBadge from "@/components/common/shipment-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function ShipmentDetail() {
  const navigate = useNavigate();
  const { shipment_id } = useParams();

  const steps = useSWR<ApiRes<ApiResponse.Step[]>>(`/en/api/v1/shipment/step/list/`);
  const { data, isLoading, isValidating, error } = useSWR<ApiRes<ApiResponse.Shipment>>(
    `/en/api/v1/shipment/detail/${shipment_id}/`,
  );

  const shipment = data?.data;

  return (
    <AppLayout>
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

              {/* STEPS */}
              <ModuleCardData isLoading={steps.isLoading} error={steps.error} skeletonRowCount={2}>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xl">Steps</h4>

                  <div className="flex items-center justify-between">
                    {steps.data?.data.map((item, index) => (
                      <React.Fragment key={item.id}>
                        <div className="mt-7 flex flex-col items-center gap-2">
                          <div
                            className={cn(
                              "center relative size-9 rounded-full border bg-muted ring-2 ring-offset-2 ring-offset-background",

                              // DONE STEPS
                              item.order < shipment?.step?.order &&
                                "bg-primary/80 text-primary-foreground ring-primary/80",

                              // ACTIVE STEP
                              item.order === shipment?.step?.order &&
                                "bg-green-500 text-white ring-green-500",

                              // NEXT STEPS
                              item.order > shipment?.step?.order &&
                                "bg-muted-foreground text-muted opacity-30 ring-muted-foreground",
                            )}
                          >
                            {index + 1}

                            {/* ACTIVE STEP ANIMATION */}
                            {item.order === shipment?.step?.order && (
                              <div className="absolute inset-0 animate-ping rounded-full bg-green-400/70">
                                {/* <div></div> */}
                              </div>
                            )}
                          </div>

                          <p>{item.title}</p>
                        </div>

                        {index + 1 < steps.data?.data.length ? (
                          <Separator
                            className={cn(
                              "flex-1",
                              item.order < shipment?.step?.order && "bg-primary/80",
                            )}
                            orientation="horizontal"
                          />
                        ) : null}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </ModuleCardData>

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
