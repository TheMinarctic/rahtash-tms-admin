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
import SelectV2 from "@/components/ui/select/select-v2";
import { DialogBody, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { AxiosResponse } from "axios";
import { mutate } from "swr";

export default function UpsertShipmentStepFrom({
  setIsOpen,
  initialData,
}: {
  initialData?: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [searchParams] = useSearchParams();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title,
      order: initialData?.order,
      status: initialData?.status,
    },
  });
  const { control, formState, handleSubmit } = form;

  const onSubmit = async (data: FormValues) => {
    // CREATE
    if (!initialData) {
      await axios
        .post(`/en/api/v1/shipment/step/create/`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse<ApiRes>) => {
          toast.success(res.data.message);
          mutate(`/en/api/v1/shipment/step/list?${searchParams.toString()}`);
          setIsOpen(false);
        })
        .catch((err) => serverErrorToast(err));
    }

    // UPDATE
    else {
      await axios
        .patch(`/en/api/v1/shipment/step/update/${initialData?.id}/`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse<ApiRes>) => {
          toast.success(res.data.message);
          mutate(`/en/api/v1/shipment/step/list?${searchParams.toString()}`);
          setIsOpen(false);
        })
        .catch((err) => serverErrorToast(err));
    }
  };

  return (
    <>
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
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="submit"
              disabled={formState.isSubmitting}
              loading={formState.isSubmitting}
            >
              {initialData ? "Edit Port" : "Create Port"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}

const formSchema = z.object({
  title: z.string(),
  order: z.number(),
  status: z.number(),
});

type FormValues = z.infer<typeof formSchema>;
