import { z } from "zod";

export const compareQuerySchema = z
  .object({
    slugs: z.string().optional(),
    models: z.string().optional(),
  })
  .transform((data) => {
    const raw = data.slugs || data.models || "";
    const list = raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return { slugs: list };
  })
  .refine((data) => data.slugs.length >= 2, {
    message: "Please provide at least 2 models to compare.",
  })
  .refine((data) => data.slugs.length <= 4, {
    message: "You can compare up to 4 models at a time.",
  });

export type CompareQuery = z.infer<typeof compareQuerySchema>;
