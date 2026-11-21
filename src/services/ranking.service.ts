import { prisma } from "@/lib/prisma";
import { RankingQuery } from "@/schemas/ranking.schema";
import { BenchmarkCategory } from "@prisma/client";

export async function getRankings(params: RankingQuery) {
  const { category, benchmark } = params;

  // Find target benchmark or pick the top benchmark in the category
  let targetBenchmarkSlug = benchmark;

  if (!targetBenchmarkSlug) {
    if (category) {
      const topBenchmark = await prisma.benchmark.findFirst({
        where: { category: category as BenchmarkCategory },
        orderBy: { slug: "asc" },
      });
      targetBenchmarkSlug = topBenchmark?.slug;
    } else {
      // Default to Chatbot Arena Elo or MMLU Pro
      targetBenchmarkSlug = "arena-elo";
    }
  }

  const selectedBenchmark = await prisma.benchmark.findUnique({
    where: { slug: targetBenchmarkSlug },
  });

  if (!selectedBenchmark) {
    return {
      benchmark: null,
      rankings: [],
    };
  }

  // Fetch benchmark scores
  const scores = await prisma.benchmarkScore.findMany({
    where: {
      benchmarkId: selectedBenchmark.id,
      model: { status: { not: "DEPRECATED" } },
    },
    include: {
      model: {
        include: {
          lab: true,
          capabilities: { include: { capability: true } },
          providers: {
            where: { isAvailable: true },
            orderBy: { inputPricePerMillion: "asc" },
          },
        },
      },
    },
    orderBy: {
      score: selectedBenchmark.higherIsBetter ? "desc" : "asc",
    },
  });

  const maxVal = selectedBenchmark.maxScore;

  const rankings = scores.map((s, idx) => {
    const rawScore = s.score;
    // Calculate normalized percentage score 0-100
    const normalizedScore = Math.min(100, Math.max(0, (rawScore / maxVal) * 100));

    const minPrice =
      s.model.providers.length > 0
        ? Number(s.model.providers[0].inputPricePerMillion)
        : null;

    return {
      rank: idx + 1,
      model: {
        id: s.model.id,
        slug: s.model.slug,
        name: s.model.name,
        modelType: s.model.modelType,
        contextWindow: s.model.contextWindow,
        license: s.model.license,
        lab: {
          slug: s.model.lab.slug,
          name: s.model.lab.name,
          logoUrl: s.model.lab.logoUrl,
        },
        minInputPricePerMillion: minPrice,
      },
      rawScore,
      normalizedScore: Math.round(normalizedScore * 10) / 10,
      source: s.source,
      measuredAt: s.measuredAt.toISOString(),
    };
  });

  return {
    benchmark: {
      id: selectedBenchmark.id,
      slug: selectedBenchmark.slug,
      name: selectedBenchmark.name,
      category: selectedBenchmark.category,
      description: selectedBenchmark.description,
      maxScore: selectedBenchmark.maxScore,
      higherIsBetter: selectedBenchmark.higherIsBetter,
    },
    rankings,
  };
}
