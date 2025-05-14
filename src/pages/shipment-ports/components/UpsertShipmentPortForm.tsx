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
import { objectToFormData } from "@/utils/object-to-formdata";
import CountriesCombobox from "@/components/common/countries-combobox";

export default function UpsertShipmentPortFrom({
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
      country: initialData?.country,
      status: initialData?.status,
    },
  });
  const { control, formState, handleSubmit } = form;

  const onSubmit = async (data: FormValues) => {
    const formdata = objectToFormData(data);

    // CREATE
    if (!initialData) {
      await axios
        .post(`/en/api/v1/shipment/port/create/`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse<ApiRes>) => {
          toast.success(res.data.message);
          mutate(`/en/api/v1/shipment/port/list?${searchParams.toString()}`);
          setIsOpen(false);
        })
        .catch((err) => serverErrorToast(err));
    }

    // UPDATE
    else {
      await axios
        .patch(`/en/api/v1/shipment/port/update/${initialData?.id}/`, formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res: AxiosResponse<ApiRes>) => {
          toast.success(res.data.message);
          mutate(`/en/api/v1/shipment/port/list?${searchParams.toString()}`);
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
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>Country</FormLabel>

                    <FormControl>
                      <CountriesCombobox onChange={field.onChange} value={field.value} />
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
  country: z.number(),
  status: z.number(),
});

type FormValues = z.infer<typeof formSchema>;
