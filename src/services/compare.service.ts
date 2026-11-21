import * as modelRepo from "@/repositories/model.repo";
import { NotFoundError, BadRequestError } from "@/lib/errors";

export async function compareModels(slugs: string[]) {
  if (slugs.length < 2 || slugs.length > 4) {
    throw new BadRequestError("Comparison requires between 2 and 4 models.");
  }

  const rawModels = await modelRepo.findModelsBySlugs(slugs);

  if (rawModels.length === 0) {
    throw new NotFoundError("Models", slugs.join(", "));
  }

  // Preserve request order
  const models = slugs
    .map((slug) => rawModels.find((m) => m.slug.toLowerCase() === slug.toLowerCase()))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  if (models.length < 2) {
    throw new BadRequestError(
      `Found only ${models.length} model(s). At least 2 valid model slugs are required for comparison.`
    );
  }

  // Format models and compute winners
  let minPrice = Infinity;
  let cheapestSlug: string | null = null;

  let maxContext = -1;
  let largestContextSlug: string | null = null;

  let minLatency = Infinity;
  let fastestLatencySlug: string | null = null;

  let maxThroughput = -1;
  let highestThroughputSlug: string | null = null;

  // Extract all benchmark slugs present across these models
  const benchmarkMap = new Map<
    string,
    { slug: string; name: string; category: string; maxScore: number; higherIsBetter: boolean }
  >();

  for (const m of models) {
    // Pricing
    const cheapestProvider = m.providers[0];
    if (cheapestProvider) {
      const price = Number(cheapestProvider.inputPricePerMillion);
      if (price < minPrice) {
        minPrice = price;
        cheapestSlug = m.slug;
      }
      if (cheapestProvider.latencyMs && cheapestProvider.latencyMs < minLatency) {
        minLatency = cheapestProvider.latencyMs;
        fastestLatencySlug = m.slug;
      }
      if (cheapestProvider.throughputTps && cheapestProvider.throughputTps > maxThroughput) {
        maxThroughput = cheapestProvider.throughputTps;
        highestThroughputSlug = m.slug;
      }
    }

    // Context
    if (m.contextWindow > maxContext) {
      maxContext = m.contextWindow;
      largestContextSlug = m.slug;
    }

    // Benchmarks
    for (const bs of m.benchmarkScores) {
      if (!benchmarkMap.has(bs.benchmark.slug)) {
        benchmarkMap.set(bs.benchmark.slug, {
          slug: bs.benchmark.slug,
          name: bs.benchmark.name,
          category: bs.benchmark.category,
          maxScore: bs.benchmark.maxScore,
          higherIsBetter: bs.benchmark.higherIsBetter,
        });
      }
    }
  }

  // Format benchmark rows with per-model scores and winner per benchmark
  const benchmarksComparison = Array.from(benchmarkMap.values()).map((b) => {
    let bestScore = b.higherIsBetter ? -Infinity : Infinity;
    let winningModelSlug: string | null = null;

    const scoresByModel: Record<string, number | null> = {};

    for (const m of models) {
      const found = m.benchmarkScores.find((s) => s.benchmark.slug === b.slug);
      if (found) {
        scoresByModel[m.slug] = found.score;
        const isBetter = b.higherIsBetter ? found.score > bestScore : found.score < bestScore;
        if (isBetter) {
          bestScore = found.score;
          winningModelSlug = m.slug;
        }
      } else {
        scoresByModel[m.slug] = null;
      }
    }

    return {
      benchmark: b,
      scores: scoresByModel,
      winningModelSlug,
    };
  });

  const formattedModels = models.map((m) => {
    const minInput = m.providers.length > 0 ? Number(m.providers[0].inputPricePerMillion) : null;
    const minOutput = m.providers.length > 0 ? Number(m.providers[0].outputPricePerMillion) : null;
    const bestLatency = m.providers.find((p) => p.latencyMs)?.latencyMs ?? null;
    const bestThroughput = m.providers.find((p) => p.throughputTps)?.throughputTps ?? null;

    return {
      id: m.id,
      slug: m.slug,
      name: m.name,
      description: m.description,
      modelType: m.modelType,
      releaseDate: m.releaseDate.toISOString(),
      contextWindow: m.contextWindow,
      maxOutputTokens: m.maxOutputTokens,
      parameterCount: m.parameterCount,
      license: m.license,
      lab: {
        slug: m.lab.slug,
        name: m.lab.name,
        logoUrl: m.lab.logoUrl,
      },
      inputModalities: m.inputModalities.map((im) => im.modality.name),
      outputModalities: m.outputModalities.map((om) => om.modality.name),
      capabilities: m.capabilities.map((c) => c.capability.name),
      minInputPrice: minInput,
      minOutputPrice: minOutput,
      latencyMs: bestLatency,
      throughputTps: bestThroughput,
      providerCount: m.providers.length,
      providers: m.providers.map((p) => ({
        providerSlug: p.provider.slug,
        providerName: p.provider.name,
        inputPrice: Number(p.inputPricePerMillion),
        outputPrice: Number(p.outputPricePerMillion),
        latencyMs: p.latencyMs,
        throughputTps: p.throughputTps,
      })),
    };
  });

  return {
    models: formattedModels,
    winners: {
      cheapestModelSlug: cheapestSlug,
      largestContextSlug,
      fastestLatencySlug,
      highestThroughputSlug,
    },
    benchmarksComparison,
  };
}
