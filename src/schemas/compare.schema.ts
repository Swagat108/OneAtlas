import { z } from "zod";

export const compareQuerySchema = z.object({
  slugs: z
    .string()
    .min(1, "At least two model slugs are required for comparison.")
    .transform((val) => val.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean))
    .refine((slugs) => slugs.length >= 2, {
      message: "Please provide at least 2 models to compare.",
    })
    .refine((slugs) => slugs.length <= 4, {
      message: "You can compare up to 4 models at a time.",
    }),
});

export type CompareQuery = z.infer<typeof compareQuerySchema>;
