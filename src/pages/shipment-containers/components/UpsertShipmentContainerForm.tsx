import { z } from "zod";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SelectV2 from "@/components/ui/select/select-v2";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { Combobox } from "@/components/ui/combobox";

const formSchema = z.object({
  track_number: z.string().min(1, "Track Number is required"),
  size: z.coerce.number({ invalid_type_error: "Size must be a number" }),
  status: z.number(),
  order: z.coerce.number().optional().or(z.literal("")),
  type: z.number(),
  shipment: z.number({ required_error: "Shipment is required" }).min(1, "Shipment is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpsertShipmentContainerForm({
  setIsOpen,
  initialData,
  mutate,
}: {
  mutate: () => void;
  initialData?: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchParams] = useSearchParams();
  const shipments = useSWR<ApiRes<any[]>>(`/en/api/v1/shipment/list?${searchParams.toString()}`);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      track_number: initialData?.track_number || "",
      size: initialData?.size ?? 0,
      status: initialData?.status ?? 1,
      order: initialData?.order ?? 0,
      type: initialData?.type ?? 1,
      shipment: initialData?.shipment?.id || undefined,
    },
  });

  const { control, handleSubmit, formState } = form;

  const onSubmit = async (data: FormValues) => {
    const payload = {
      ...data,
      order: data.order === "" ? undefined : Number(data.order),
    };

    try {
      if (!initialData) {
        const res = await axios.post("/en/api/v1/shipment/container/create/", payload);
        toast.success(res.data.message);
      } else {
        const res = await axios.patch(
          `/en/api/v1/shipment/container/update/${initialData.id}/`,
          payload,
        );
        toast.success(res.data.message);
      }
      mutate();
      setIsOpen(false);
    } catch (err) {
      serverErrorToast(err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name="track_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Track Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Size</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Status</FormLabel>
                  <FormControl>
                    <SelectV2
                      value={field.value}
                      onValueChange={field.onChange}
                      items={[
                        { value: 1, name: "Active" },
                        { value: 2, name: "Inactive" },
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === "" ? "" : +val);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Type</FormLabel>
                  <FormControl>
                    <SelectV2
                      value={field.value}
                      onValueChange={field.onChange}
                      items={[
                        { value: 1, name: "Dry" },
                        { value: 2, name: "Reefer" },
                        // { value: 3, name: "Open Top" },
                        // { value: 4, name: "Flat Rack" },
                      ]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="shipment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Shipment</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value}
                      onValueChange={field.onChange}
                      items={
                        shipments.data?.data?.map((item) => ({
                          name: `${item.bill_of_lading_number_id} ${item.carrier_company?.name ? `| ${item.carrier_company?.name}` : ""}`,
                          value: item.id,
                        })) || []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="submit" disabled={formState.isSubmitting} loading={formState.isSubmitting}>
            {initialData ? "Edit Container" : "Create Container"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
