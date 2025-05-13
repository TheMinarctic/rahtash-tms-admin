// ShipmentCreate.tsx
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import SelectV2 from "@/components/ui/select/select-v2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { z } from "zod";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { useForm } from "react-hook-form";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import DatePicker from "@/components/ui/date-picker";
import { toast } from "sonner";

export default function ShipmentCreate() {
  const navigate = useNavigate();
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, register, control, formState } = form;
  const { isSubmitting, errors } = formState;

  const onSubmit = async (data: FormValues) => {
    await axios
      .post("/en/api/v1/shipment/create/", data)
      .then((res: AxiosResponse<ApiRes>) => {
        toast.success(res.data.message);
        navigate(`/shipments/${res.data.data.id}`);
      })
      .catch((err) => {
        return serverErrorToast(err);
      });
  };

  return (
    <AppLayout classNames={{ container: "max-w-4xl" }}>
      <div className="mb-6 flex items-center justify-end">
        <Button variant="outline" onClick={() => navigate("/shipments")}>
          <ArrowLeft className="!ms-0 me-2" />
          Back to Shipments
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Shipment</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={control}
                  name="bill_of_lading_number_id"
                  render={({ field }) => (
                    <FormItem>
                      <Label isRequired>Bill of Lading Number</Label>

                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="date_of_loading"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Loading</FormLabel>

                      <DatePicker
                        date={field.value}
                        setDate={(v) => {
                          field.onChange(v.toISOString());
                        }}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center">
                  <FormField
                    control={control}
                    name="contains_dangerous_good"
                    render={({ field }) => (
                      <FormItem>
                        <div className="center">
                          <FormControl>
                            <Checkbox
                              id="contains_dangerous_good"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <Label
                            htmlFor="contains_dangerous_good"
                            className="ml-2 block text-muted-foreground"
                          >
                            Contains Dangerous Goods
                          </Label>
                        </div>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <FormField
                    control={control}
                    name="status"
                    render={({ field, fieldState }) => (
                      <SelectV2
                        isRequired
                        label="Status"
                        error={fieldState?.error?.message}
                        onValueChange={field.onChange}
                        value={field.value}
                        items={[
                          { value: 1, name: "pending" },
                          { value: 2, name: "In Progress" },
                          { value: 3, name: "Completed" },
                          { value: 4, name: "Cancelled" },
                        ]}
                      />
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="mb-2 block">Notes</Label>
                  <Textarea {...register("note")} error={errors?.note?.message} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Shipment"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

const formSchema = z.object({
  bill_of_lading_number_id: z.string(),
  contains_dangerous_good: z.boolean().optional(),
  date_of_loading: z.string().optional(),
  note: z.string().optional(),
  status: z.number(),
});

type FormValues = z.infer<typeof formSchema>;
