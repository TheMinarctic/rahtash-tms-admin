import { z } from "zod";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  file: z.any().refine((file) => file instanceof File, "File is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddCustomFileForm({
  type,
  mutate,
  setIsOpen,
  shipmentId,
}: {
  mutate?: () => void;
  shipmentId?: number;
  type?: "shipment" | "container";
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [uploadingFileLoading, setUploadingFileLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { control, formState, handleSubmit } = form;

  const onSubmit = async (data: FormValues) => {
    // CREATE DOC TYPE
    await axios
      .post(
        `/en/api/v1/shipment/document/type/create/`,
        { title: data.title, type: !type || type === "shipment" ? 0 : 1 },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      )
      .then(async (documentTypeRes: AxiosResponse<ApiRes>) => {
        // CREATE DOC
        setUploadingFileLoading(true);

        await axios
          .post(
            `/en/api/v1/shipment/document/create/`,
            {
              type: documentTypeRes.data?.data?.type?.id,
              shipment: shipmentId,
              file: data.file,
            },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          )
          .then((documentRes) => {
            if (mutate) {
              mutate();
            }
            toast.success(documentRes.data.message);
            setIsOpen(false);
          })
          .catch((err) => {
            return serverErrorToast(err);
          })
          .finally(() => setUploadingFileLoading(false));
      })
      .catch((err) => {
        return serverErrorToast(err);
      });
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
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom File</FormLabel>

                  <Input
                    isRequired
                    type="file"
                    onChange={(e) => field.onChange(e.target?.files?.[0])}
                  />

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="submit"
            disabled={formState.isSubmitting || uploadingFileLoading}
            loading={formState.isSubmitting || uploadingFileLoading}
          >
            {"Upload Custom File"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
