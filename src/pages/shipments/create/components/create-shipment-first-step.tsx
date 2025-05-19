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
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const CreateShipmentFirstStep = () => {
  const form = useForm({ resolver: zodResolver(formSchema) });
  const { handleSubmit, control, formState } = form;

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
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-5xl py-6">
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={control}
                name="bill_of_lading_number_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel isRequired>Bill of Lading Number</FormLabel>

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
            </div>
          </CardContent>

          <CardFooter>
            <Button>Create Shipment</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default CreateShipmentFirstStep;

const formSchema = z.object({
  bill_of_lading_number_id: z.string().min(1, validationErrorMessages.requiredField),
  date_of_loading: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;
