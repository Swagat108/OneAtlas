import { z } from "zod";
import { paginationQuerySchema } from "./common.schema";

export const modelSortByEnum = z.enum([
  "name_asc",
  "name_desc",
  "price_asc",
  "price_desc",
  "context_desc",
  "context_asc",
  "release_desc",
  "release_asc",
]);

export const modelFilterQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().optional(),
  lab: z.string().trim().optional(), // lab slug
  provider: z.string().trim().optional(), // provider slug
  modelType: z
    .enum(["LLM", "IMAGE", "EMBEDDING", "AUDIO", "VIDEO", "MULTIMODAL"])
    .optional(),
  license: z.enum(["OPEN_SOURCE", "PROPRIETARY", "OPEN_WEIGHTS"]).optional(),
  capabilities: z
    .string()
    .transform((val) => val.split(",").map((s) => s.trim()).filter(Boolean))
    .optional(),
  modalities: z
    .string()
    .transform((val) => val.split(",").map((s) => s.trim()).filter(Boolean))
    .optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  minContext: z.coerce.number().int().positive().optional(),
  sortBy: modelSortByEnum.default("release_desc"),
});

export type ModelFilterQuery = z.infer<typeof modelFilterQuerySchema>;
