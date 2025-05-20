import { z } from "zod";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import DatePicker from "@/components/ui/date-picker";
import { zodResolver } from "@hookform/resolvers/zod";
import { serverErrorToast } from "@/utils/errors/server-error-toast";
import { validationErrorMessages } from "@/utils/errors/validation-error-messages";
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

const CreateShipmentSecondStep = () => {
  const form = useForm<FormValues>({ resolver: zodResolver(formSchema) });
  const { handleSubmit, control, formState } = form;
  console.log(form.watch("bl_file"));

  const onSubmit = async (data: FormValues) => {
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

                    <Input type="file" onChange={(e) => field.onChange(e.target?.files?.[0])} />

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

                    <Input type="file" onChange={(e) => field.onChange(e.target?.files?.[0])} />

                    <FormMessage />
                  </FormItem>
                )}
              />

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

                      <Input type="file" onChange={(e) => field.onChange(e.target?.files?.[0])} />

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>

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

const formSchema = z
  .object({
    bl_file: z.any().refine((file) => file instanceof File, "File is required"),
    invoice_file: z.any().refine((file) => file instanceof File, "File is required"),
    packing_list_file: z.any().refine((file) => file instanceof File, "File is required"),
    msds_file: z
      .any()
      .refine((file) => file instanceof File, "File is required")
      .optional()
      .nullable(),
    contains_dangerous_good: z.boolean().optional().nullable(),
  })
  .refine(
    (data) => {
      if (!data.contains_dangerous_good) return true;

      if (data.contains_dangerous_good && !(data.msds_file instanceof File)) return false;
      return true;
    },
    { path: ["msds_file"], message: "File is required" },
  );

type FormValues = z.infer<typeof formSchema>;
