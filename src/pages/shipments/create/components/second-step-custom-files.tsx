import { z } from "zod";
import { toast } from "sonner";
import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
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
import { ShipmentSecondStepValues } from "../schemas/shipment-second-step-schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SecondStepCustomFiles() {
  const form = useFormContext<ShipmentSecondStepValues>();
  const { control } = form;

  const { fields, append, remove } = useFieldArray({ control, name: "customFiles" });

  return (
    <div className="pb-4">
      <hr />

      <CardHeader className="border-b-0">
        <CardTitle>
          <Button
            size="icon"
            type="button"
            className="me-3"
            onClick={() => {
              append({ file: null, title: "" });
            }}
          >
            <Plus />
          </Button>
          Custom Files
        </CardTitle>
      </CardHeader>

      {fields.length ? (
        <CardContent className="grid grid-cols-1 gap-y-5 pt-0 xl:grid-cols-2">
          {fields.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "flex flex-row-reverse gap-2 even:border-s",
                index % 2 === 0 ? "pe-5" : "ps-5",
              )}
            >
              <Button
                size="icon"
                className="mt-6"
                variant="destructive"
                onClick={() => remove(index)}
              >
                <Trash2 />
              </Button>

              <div className="grid flex-1 grid-cols-2 gap-3">
                <FormField
                  control={control}
                  name={`customFiles.${index}.title`}
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
                  name={`customFiles.${index}.file`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel isRequired>File</FormLabel>

                      <FormControl>
                        <Input type="file" onChange={(e) => field.onChange(e.target?.files?.[0])} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </CardContent>
      ) : null}

      <hr />
    </div>
  );
}
