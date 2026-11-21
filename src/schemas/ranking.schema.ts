import { z } from "zod";

export const rankingQuerySchema = z.object({
  category: z
    .enum([
      "REASONING",
      "CODING",
      "MATH",
      "KNOWLEDGE",
      "MULTIMODAL",
      "AGENTIC",
      "SAFETY",
    ])
    .optional(),
  benchmark: z.string().trim().optional(),
});

export type RankingQuery = z.infer<typeof rankingQuerySchema>;
