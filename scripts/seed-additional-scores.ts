import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const arcChallengeScores: Record<string, number> = {
  "o1": 96.7,
  "gpt-4o": 96.4,
  "claude-3-5-sonnet": 96.9,
  "gemini-1-5-pro": 95.8,
  "deepseek-v3": 94.8,
  "llama-3-1-405b": 96.9,
  "llama-3-1-70b": 93.6,
  "grok-2": 95.1,
  "mistral-large-2": 94.2,
  "qwen-2-5-72b-instruct": 95.4,
  "claude-3-opus": 95.4,
  "gpt-4o-mini": 93.4,
  "gemini-1-5-flash": 92.1,
  "claude-3-5-haiku": 92.8,
  "llama-3-1-8b": 89.2,
  "gemma-2-27b": 91.5,
  "command-r-plus": 90.3,
  "gpt-4-turbo": 94.5,
};

const ifevalScores: Record<string, number> = {
  "o1": 91.2,
  "gpt-4o": 88.6,
  "claude-3-5-sonnet": 89.4,
  "gemini-1-5-pro": 87.8,
  "deepseek-v3": 86.4,
  "llama-3-1-405b": 88.2,
  "llama-3-1-70b": 85.5,
  "grok-2": 86.9,
  "mistral-large-2": 85.1,
  "qwen-2-5-72b-instruct": 85.3,
  "claude-3-opus": 84.7,
  "gpt-4o-mini": 83.2,
  "gemini-1-5-flash": 82.5,
  "claude-3-5-haiku": 84.0,
  "llama-3-1-8b": 78.4,
  "gemma-2-27b": 81.2,
};

async function main() {
  console.log("Seeding ARC-Challenge and IFEval scores...");

  const arcBenchmark = await prisma.benchmark.findUnique({
    where: { slug: "arc-challenge" },
  });

  const ifevalBenchmark = await prisma.benchmark.findUnique({
    where: { slug: "ifeval" },
  });

  if (!arcBenchmark || !ifevalBenchmark) {
    console.error("Benchmarks not found!");
    return;
  }

  // Seed ARC-Challenge
  for (const [slug, score] of Object.entries(arcChallengeScores)) {
    const model = await prisma.model.findUnique({ where: { slug } });
    if (model) {
      await prisma.benchmarkScore.upsert({
        where: {
          modelId_benchmarkId: {
            modelId: model.id,
            benchmarkId: arcBenchmark.id,
          },
        },
        update: { score, source: "Official Benchmark Evaluation" },
        create: {
          modelId: model.id,
          benchmarkId: arcBenchmark.id,
          score,
          source: "Official Benchmark Evaluation",
        },
      });
    }
  }

  // Seed IFEval
  for (const [slug, score] of Object.entries(ifevalScores)) {
    const model = await prisma.model.findUnique({ where: { slug } });
    if (model) {
      await prisma.benchmarkScore.upsert({
        where: {
          modelId_benchmarkId: {
            modelId: model.id,
            benchmarkId: ifevalBenchmark.id,
          },
        },
        update: { score, source: "Instruction-Following Evaluation" },
        create: {
          modelId: model.id,
          benchmarkId: ifevalBenchmark.id,
          score,
          source: "Instruction-Following Evaluation",
        },
      });
    }
  }

  console.log("Successfully seeded ARC-Challenge and IFEval scores!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
