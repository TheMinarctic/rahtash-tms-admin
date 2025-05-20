import { z } from "zod";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { DocumentTypeEnum } from "@/enums/document-type";
import { ShipmentDocumentTypeApi } from "@/services/shipments/document-type-api";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  order: z.number({ invalid_type_error: "Order must be a number" }),
  type: z.number(),
  is_mandatory: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpsertShipmentDocumentTypeForm({
  setIsOpen,
  initialData,
  mutate,
}: {
  mutate: () => void;
  initialData?: Partial<FormValues> & { id: number };
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      order: initialData?.order ?? 0,
      type: initialData?.type ?? 0,
      is_mandatory: initialData?.is_mandatory ?? true,
    },
  });

  const { control, formState, handleSubmit } = form;

  const onSubmit = async (data: FormValues) => {
    // CREATE
    if (!initialData) {
      await ShipmentDocumentTypeApi.create(data)
        .then((res: AxiosResponse<ApiRes>) => {
          toast.success(res.data.message);
          mutate();
          setIsOpen(false);
        })
        .catch((err) => {
          return serverErrorToast(err);
        });
    }

    // UPDATE
    else {
      await ShipmentDocumentTypeApi.update(initialData.id, data)
        .then((res) => {
          toast.success(res.data.message);
          mutate();
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel isRequired>Order</FormLabel>
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
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel isRequired>Type</FormLabel>
                  <FormControl>
                    <SelectV2
                      value={field.value}
                      onValueChange={field.onChange}
                      items={Object.entries(DocumentTypeEnum).map(([key, value]) => ({
                        name: value,
                        value: Number(key),
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="is_mandatory"
              render={({ field }) => (
                <FormItem className="mt-2 flex flex-row items-center gap-3 rounded-md">
                  <FormLabel>Mandatory</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="submit" disabled={formState.isSubmitting} loading={formState.isSubmitting}>
            {initialData ? "Edit Document Type" : "Create Document Type"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
