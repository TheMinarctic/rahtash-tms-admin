import { z } from "zod";
import { validationErrorMessages } from "@/utils/errors/validation-error-messages";

export const shipmentSecondStepSchema = z
  .object({
    bl_file: z
      .any()
      .refine((file) => file instanceof File, validationErrorMessages.required("File")),
    invoice_file: z
      .any()
      .refine((file) => file instanceof File, validationErrorMessages.required("File")),
    packing_list_file: z
      .any()
      .refine((file) => file instanceof File, validationErrorMessages.required("File")),
    msds_file: z
      .any()
      .refine((file) => file instanceof File, validationErrorMessages.required("File"))
      .optional()
      .nullable(),
    contains_dangerous_good: z.boolean().optional().nullable(),
    customFiles: z.array(
      z.object({
        title: z.string().min(1, validationErrorMessages.required("Title")),
        file: z
          .any()
          .refine((file) => file instanceof File, validationErrorMessages.required("File")),
      }),
    ),
  })
  .refine(
    (data) => {
      if (!data.contains_dangerous_good) return true;

      if (data.contains_dangerous_good && !(data.msds_file instanceof File)) return false;
      return true;
    },
    { path: ["msds_file"], message: validationErrorMessages.required("File") },
  );

export type ShipmentSecondStepValues = z.infer<typeof shipmentSecondStepSchema>;
