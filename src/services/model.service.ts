import * as modelRepo from "@/repositories/model.repo";
import { ModelFilterQuery } from "@/schemas/model.schema";
import { NotFoundError } from "@/lib/errors";

export async function getModels(params: ModelFilterQuery) {
  const { total, models } = await modelRepo.findModelsWithFilters(params);

  const formattedModels = models.map((m) => {
    const minInputPrice = m.providers.length > 0 ? Number(m.providers[0].inputPricePerMillion) : null;
    const minOutputPrice = m.providers.length > 0 ? Number(m.providers[0].outputPricePerMillion) : null;

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
      status: m.status,
      architecture: m.architecture,
      lab: {
        id: m.lab.id,
        slug: m.lab.slug,
        name: m.lab.name,
        logoUrl: m.lab.logoUrl,
        country: m.lab.country,
      },
      inputModalities: m.inputModalities.map((im) => ({
        slug: im.modality.slug,
        name: im.modality.name,
      })),
      outputModalities: m.outputModalities.map((om) => ({
        slug: om.modality.slug,
        name: om.modality.name,
      })),
      capabilities: m.capabilities.map((c) => ({
        slug: c.capability.slug,
        name: c.capability.name,
      })),
      pricing: {
        minInputPricePerMillion: minInputPrice,
        minOutputPricePerMillion: minOutputPrice,
        providerCount: m.providers.length,
      },
      providers: m.providers.map((p) => ({
        id: p.id,
        provider: {
          slug: p.provider.slug,
          name: p.provider.name,
          logoUrl: p.provider.logoUrl,
        },
        inputPricePerMillion: Number(p.inputPricePerMillion),
        outputPricePerMillion: Number(p.outputPricePerMillion),
        latencyMs: p.latencyMs,
        throughputTps: p.throughputTps,
        isAvailable: p.isAvailable,
      })),
      benchmarkScores: m.benchmarkScores.map((bs) => ({
        slug: bs.benchmark.slug,
        name: bs.benchmark.name,
        category: bs.benchmark.category,
        score: bs.score,
        maxScore: bs.benchmark.maxScore,
      })),
    };
  });

  const totalPages = Math.ceil(total / params.limit) || 1;

  const meta = {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPrevPage: params.page > 1,
  };

  return { models: formattedModels, meta };
}

export async function getModelDetail(slug: string) {
  const model = await modelRepo.findModelBySlug(slug);
  if (!model) {
    throw new NotFoundError("Model", slug);
  }

  const minInputPrice =
    model.providers.length > 0 ? Number(model.providers[0].inputPricePerMillion) : null;
  const minOutputPrice =
    model.providers.length > 0 ? Number(model.providers[0].outputPricePerMillion) : null;

  return {
    id: model.id,
    slug: model.slug,
    name: model.name,
    description: model.description,
    modelType: model.modelType,
    releaseDate: model.releaseDate.toISOString(),
    contextWindow: model.contextWindow,
    maxOutputTokens: model.maxOutputTokens,
    parameterCount: model.parameterCount,
    license: model.license,
    status: model.status,
    architecture: model.architecture,
    huggingFaceUrl: model.huggingFaceUrl,
    paperUrl: model.paperUrl,
    lab: model.lab,
    inputModalities: model.inputModalities.map((im) => im.modality),
    outputModalities: model.outputModalities.map((om) => om.modality),
    capabilities: model.capabilities.map((c) => c.capability),
    pricingSummary: {
      minInputPricePerMillion: minInputPrice,
      minOutputPricePerMillion: minOutputPrice,
      providerCount: model.providers.length,
    },
    providers: model.providers.map((p) => ({
      id: p.id,
      provider: p.provider,
      inputPricePerMillion: Number(p.inputPricePerMillion),
      outputPricePerMillion: Number(p.outputPricePerMillion),
      currency: p.currency,
      contextWindowOverride: p.contextWindowOverride,
      latencyMs: p.latencyMs,
      throughputTps: p.throughputTps,
      isAvailable: p.isAvailable,
    })),
    benchmarkScores: model.benchmarkScores.map((s) => ({
      id: s.id,
      score: s.score,
      source: s.source,
      measuredAt: s.measuredAt.toISOString(),
      benchmark: s.benchmark,
    })),
  };
}
