import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DatePicker from "@/components/ui/date-picker";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SelectV2 from "@/components/ui/select/select-v2";
import { Textarea } from "@/components/ui/textarea";
import { axios } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { mutate } from "swr";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";

const UpsertShipmentForm = ({
  initialData,
  setIsOpen,
}: {
  initialData?: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  console.log(initialData);

  const [searchParams] = useSearchParams();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bill_of_lading_number_id: initialData?.bill_of_lading_number_id || "",
      contains_dangerous_good: initialData?.contains_dangerous_good || false,
      date_of_loading: initialData?.date_of_loading,
      note: initialData?.note || "",
      status: initialData?.status,
    },
  });
  const { handleSubmit, register, control, formState } = form;
  const { isSubmitting, errors } = formState;

  const onSubmit = async (data: FormValues) => {
    // CREATE
    if (!initialData) {
      await axios
        .post("/en/api/v1/shipment/create/", data)
        .then((res: AxiosResponse<ApiRes>) => {
          toast.success(res.data.message);
          mutate(`/en/api/v1/shipment/list?${searchParams.toString()}`);
          setIsOpen(false);
        })
        .catch((err) => {
          return serverErrorToast(err);
        });
    }

    // UPDATE
    else {
      await axios
        .patch(`/en/api/v1/shipment/update/${initialData.id}/`, data)
        .then((res: AxiosResponse<ApiRes>) => {
          toast.success(res.data.message);
          mutate(`/en/api/v1/shipment/list?${searchParams.toString()}`);
          setIsOpen(false);
        })
        .catch((err) => {
          return serverErrorToast(err);
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
        </DialogBody>

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            {initialData ? "Edit Shipment" : "Create Shipment"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default UpsertShipmentForm;

const formSchema = z.object({
  bill_of_lading_number_id: z.string(),
  contains_dangerous_good: z.boolean().optional().nullable(),
  date_of_loading: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  status: z.number(),
});

type FormValues = z.infer<typeof formSchema>;
