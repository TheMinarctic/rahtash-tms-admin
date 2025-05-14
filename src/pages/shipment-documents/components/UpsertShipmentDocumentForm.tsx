import { useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axios } from "@/lib/axios";
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
import { Input } from "@/components/ui/input";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import useSWR, { mutate } from "swr";
import { objectToFormData } from "@/utils/object-to-formdata";
import { Combobox } from "@/components/ui/combobox";

export default function UpsertShipmentDocumentForm({
  setIsOpen,
  initialData,
}: {
  initialData?: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchParams] = useSearchParams();
  const shipments = useSWR<ApiRes<any[]>>(`/en/api/v1/shipment/list?${searchParams.toString()}`);
  const documentTypes = useSWR<ApiRes<any[]>>(
    `/en/api/v1/shipment/document/type/list?${searchParams.toString()}`,
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type?.id ?? "",
      verifier: initialData?.verifier ?? "",
      shipment: initialData?.shipment?.id ?? "",
      file: undefined,
    },
  });

  const { control, formState, handleSubmit } = form;

  const onSubmit = async (data: FormValues) => {
    const formData = objectToFormData(data);

    try {
      const url = initialData
        ? `/en/api/v1/shipment/document/update/${initialData.id}/`
        : `/en/api/v1/shipment/document/create/`;

      const method = initialData ? axios.patch : axios.post;

      const res: AxiosResponse<ApiRes> = await method(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      mutate(`/en/api/v1/shipment/document/list/?${searchParams.toString()}`);
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Document Type</FormLabel>
                  <FormControl>
                    <Combobox
                      value={field.value}
                      onValueChange={field.onChange}
                      items={
                        documentTypes.data?.data?.map((item) => ({
                          name: item.title,
                          value: item.id,
                        })) || []
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="verifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verifier ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel isRequired>Shipment ID</FormLabel>
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

            <FormField
              control={control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      {...fieldProps}
                      onChange={(e) => onChange(e.target.files?.[0])}
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
            {initialData ? "Edit Document" : "Upload Document"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

const formSchema = z.object({
  type: z.number().min(1),
  verifier: z.string().optional().or(z.literal("")),
  shipment: z.number().min(1),
  file: z
    .any()
    .refine((file) => file instanceof File, "File is required")
    .nullable()
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;
