import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  shipmentSecondStepSchema,
  ShipmentSecondStepValues,
} from "../schemas/shipment-second-step-schema";
import SecondStepCustomFiles from "./second-step-custom-files";
import { ShipmentDocumentTypeApi } from "@/services/shipments/document-type-api";
import { ShipmentDocumentApi } from "@/services/shipments/document-api";

const CreateShipmentSecondStep = ({ shipmentId }: { shipmentId: number }) => {
  const form = useForm<ShipmentSecondStepValues>({
    resolver: zodResolver(shipmentSecondStepSchema),
    defaultValues: { customFiles: [] },
  });
  const { handleSubmit, control, formState } = form;

  const onSubmit = async (data: ShipmentSecondStepValues) => {
    const submitDocumentTypes = await Promise.all(
      data.customFiles.map(
        async (item) =>
          await ShipmentDocumentTypeApi.create({ type: 0, title: item.title, order: 1 }),
      ),
    );

    const submitDocuments = await Promise.all(
      submitDocumentTypes.map(
        async (item, index) =>
          await ShipmentDocumentApi.create({
            shipment: shipmentId,
            type: item.data.data.id,
            file: data.customFiles?.[index]?.file,
          }),
      ),
    );

    return;

    await axios
      .post("/en/api/v1/shipment/create/", data)
      .then((res: AxiosResponse<ApiRes>) => {
        toast.success(res.data.message);
        // setIsOpen(false);
      })
      .catch((err) => {
        return serverErrorToast(err);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-7xl py-6">
        <Card>
          <CardHeader>
            <CardTitle>Shipment Documents</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
              {/* REQUIRED FILES */}
              <FormField
                control={control}
                name="bl_file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>BL</FormLabel>

                    <FormControl>
                      <Input type="file" onChange={(e) => field.onChange(e.target?.files?.[0])} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="invoice_file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>Invoice</FormLabel>

                    <FormControl>
                      <Input type="file" onChange={(e) => field.onChange(e.target?.files?.[0])} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="packing_list_file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>Packing List</FormLabel>

                    <FormControl>
                      <Input type="file" onChange={(e) => field.onChange(e.target?.files?.[0])} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DANGEROUS GOOD */}
              <div className="flex flex-col items-start justify-center">
                <FormField
                  control={control}
                  name="contains_dangerous_good"
                  render={({ field }) => (
                    <FormItem>
                      <div className="center">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(v) => {
                              if (!v) {
                                form.setValue("msds_file", null);
                                form.clearErrors("msds_file");
                              }
                              field.onChange(v);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="ms-2 block">Contains Dangerous Goods</FormLabel>
                      </div>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("contains_dangerous_good") && (
                <FormField
                  control={control}
                  name="msds_file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel isRequired>MSDS</FormLabel>

                      <FormControl>
                        <Input type="file" onChange={(e) => field.onChange(e.target?.files?.[0])} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>

          {/* CUSTOM FILES */}
          <SecondStepCustomFiles />

          <CardFooter>
            <Button disabled={formState.isSubmitting} loading={formState.isSubmitting}>
              Upload Documents
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CreateShipmentSecondStep;
