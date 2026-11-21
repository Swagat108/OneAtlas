import { BenchmarkCategory } from "@prisma/client";

export interface SeedBenchmark {
  slug: string;
  name: string;
  category: BenchmarkCategory;
  description: string;
  maxScore: number;
  higherIsBetter: boolean;
}

export const benchmarksData: SeedBenchmark[] = [
  {
    slug: "mmlu-pro",
    name: "MMLU-Pro",
    category: BenchmarkCategory.KNOWLEDGE,
    description: "Multi-task Language Understanding Professional: 12,000+ challenging graduate-level reasoning questions across 14 disciplines.",
    maxScore: 100.0,
    higherIsBetter: true,
  },
  {
    slug: "arena-elo",
    name: "Chatbot Arena Elo",
    category: BenchmarkCategory.REASONING,
    description: "LMSYS blind crowd-sourced human preference Elo score across real-world diverse prompts.",
    maxScore: 1500.0,
    higherIsBetter: true,
  },
  {
    slug: "gsm8k",
    name: "GSM8K",
    category: BenchmarkCategory.MATH,
    description: "Grade School Math 8K: multi-step elementary mathematical word problems.",
    maxScore: 100.0,
    higherIsBetter: true,
  },
  {
    slug: "math-500",
    name: "MATH-500",
    category: BenchmarkCategory.MATH,
    description: "High-school competition level mathematical problems from the Hendrycks MATH dataset.",
    maxScore: 100.0,
    higherIsBetter: true,
  },
  {
    slug: "humaneval",
    name: "HumanEval (Pass@1)",
    category: BenchmarkCategory.CODING,
    description: "Standard programming synthesis benchmark measuring functional correctness of Python functions.",
    maxScore: 100.0,
    higherIsBetter: true,
  },
  {
    slug: "swe-bench-verified",
    name: "SWE-bench Verified",
    category: BenchmarkCategory.AGENTIC,
    description: "Real-world GitHub issues from popular open-source repositories requiring multi-file code editing.",
    maxScore: 100.0,
    higherIsBetter: true,
  },
  {
    slug: "gpqa-diamond",
    name: "GPQA Diamond",
    category: BenchmarkCategory.REASONING,
    description: "Google-proof PhD-level multiple-choice science questions verified by field domain experts.",
    maxScore: 100.0,
    higherIsBetter: true,
  },
  {
    slug: "mmmu",
    name: "MMMU (Multimodal)",
    category: BenchmarkCategory.MULTIMODAL,
    description: "Massive Multi-discipline Multimodal Understanding requiring expert-level perception and reasoning.",
    maxScore: 100.0,
    higherIsBetter: true,
  },
  {
    slug: "ifeval",
    name: "IFEval",
    category: BenchmarkCategory.REASONING,
    description: "Instruction-Following Evaluation assessing adherence to explicit constraints (word counts, formatting, language).",
    maxScore: 100.0,
    higherIsBetter: true,
  },
  {
    slug: "arc-challenge",
    name: "ARC-Challenge",
    category: BenchmarkCategory.KNOWLEDGE,
    description: "AI2 Reasoning Challenge: complex grade-school science questions requiring genuine inference.",
    maxScore: 100.0,
    higherIsBetter: true,
  },
];
