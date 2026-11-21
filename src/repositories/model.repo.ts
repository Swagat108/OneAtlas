import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ModelFilterQuery } from "@/schemas/model.schema";

export async function findModelsWithFilters(params: ModelFilterQuery) {
  const {
    q,
    lab,
    provider,
    modelType,
    license,
    capabilities,
    modalities,
    minPrice,
    maxPrice,
    minContext,
    sortBy,
    page,
    limit,
  } = params;

  const where: Prisma.ModelWhereInput = {
    status: { not: "DEPRECATED" },
  };

  // Text search
  if (q && q.trim().length > 0) {
    const search = q.trim();
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { slug: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { lab: { name: { contains: search, mode: "insensitive" } } },
    ];
  }

  // Lab filter
  if (lab) {
    where.lab = { slug: lab };
  }

  // Model type filter
  if (modelType) {
    where.modelType = modelType;
  }

  // License filter
  if (license) {
    where.license = license;
  }

  // Context window filter
  if (minContext) {
    where.contextWindow = { gte: minContext };
  }

  // Provider filter
  if (provider) {
    where.providers = {
      some: {
        provider: { slug: provider },
        isAvailable: true,
      },
    };
  }

  // Capabilities filter (matches all requested capabilities)
  if (capabilities && capabilities.length > 0) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      ...capabilities.map((capSlug) => ({
        capabilities: {
          some: {
            capability: { slug: capSlug },
          },
        },
      })),
    ];
  }

  // Modalities filter (input modalities)
  if (modalities && modalities.length > 0) {
    where.AND = [
      ...(Array.isArray(where.AND) ? where.AND : []),
      ...modalities.map((modSlug) => ({
        inputModalities: {
          some: {
            modality: { slug: modSlug },
          },
        },
      })),
    ];
  }

  // Price filtering
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.providers = {
      ...(where.providers as Prisma.ModelProviderListRelationFilter),
      some: {
        isAvailable: true,
        ...(minPrice !== undefined && {
          inputPricePerMillion: { gte: new Prisma.Decimal(minPrice) },
        }),
        ...(maxPrice !== undefined && {
          inputPricePerMillion: { lte: new Prisma.Decimal(maxPrice) },
        }),
      },
    };
  }

  // Sorting
  let orderBy: Prisma.ModelOrderByWithRelationInput = { releaseDate: "desc" };
  if (sortBy === "name_asc") orderBy = { name: "asc" };
  else if (sortBy === "name_desc") orderBy = { name: "desc" };
  else if (sortBy === "context_desc") orderBy = { contextWindow: "desc" };
  else if (sortBy === "context_asc") orderBy = { contextWindow: "asc" };
  else if (sortBy === "release_asc") orderBy = { releaseDate: "asc" };
  else if (sortBy === "release_desc") orderBy = { releaseDate: "desc" };

  const skip = (page - 1) * limit;

  // Execute count and query in parallel to prevent separate round-trips
  const [total, rawModels] = await Promise.all([
    prisma.model.count({ where }),
    prisma.model.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        lab: {
          select: {
            id: true,
            slug: true,
            name: true,
            logoUrl: true,
            country: true,
          },
        },
        inputModalities: {
          include: {
            modality: true,
          },
        },
        outputModalities: {
          include: {
            modality: true,
          },
        },
        capabilities: {
          include: {
            capability: true,
          },
        },
        providers: {
          where: { isAvailable: true },
          include: {
            provider: {
              select: {
                id: true,
                slug: true,
                name: true,
                logoUrl: true,
              },
            },
          },
          orderBy: {
            inputPricePerMillion: "asc",
          },
        },
        benchmarkScores: {
          include: {
            benchmark: true,
          },
        },
      },
    }),
  ]);

  // If sorting by price, sort the page results by the cheapest provider price
  if (sortBy === "price_asc" || sortBy === "price_desc") {
    rawModels.sort((a, b) => {
      const minA = a.providers[0] ? Number(a.providers[0].inputPricePerMillion) : 99999;
      const minB = b.providers[0] ? Number(b.providers[0].inputPricePerMillion) : 99999;
      return sortBy === "price_asc" ? minA - minB : minB - minA;
    });
  }

  return { total, models: rawModels };
}

export async function findModelBySlug(slug: string) {
  return prisma.model.findUnique({
    where: { slug },
    include: {
      lab: true,
      inputModalities: {
        include: { modality: true },
      },
      outputModalities: {
        include: { modality: true },
      },
      capabilities: {
        include: { capability: true },
      },
      providers: {
        where: { isAvailable: true },
        include: { provider: true },
        orderBy: { inputPricePerMillion: "asc" },
      },
      benchmarkScores: {
        include: { benchmark: true },
        orderBy: { score: "desc" },
      },
    },
  });
}

export async function findModelsBySlugs(slugs: string[]) {
  return prisma.model.findMany({
    where: {
      slug: { in: slugs },
    },
    include: {
      lab: true,
      inputModalities: {
        include: { modality: true },
      },
      outputModalities: {
        include: { modality: true },
      },
      capabilities: {
        include: { capability: true },
      },
      providers: {
        where: { isAvailable: true },
        include: { provider: true },
        orderBy: { inputPricePerMillion: "asc" },
      },
      benchmarkScores: {
        include: { benchmark: true },
      },
    },
  });
}

export async function getModelFilterFacets() {
  const [labs, providers, modalities, capabilities, totalModels, priceAgg] =
    await Promise.all([
      prisma.lab.findMany({
        select: {
          slug: true,
          name: true,
          _count: { select: { models: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.provider.findMany({
        select: {
          slug: true,
          name: true,
          _count: { select: { models: true } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.modality.findMany({
        select: {
          slug: true,
          name: true,
          _count: { select: { inputModels: true } },
        },
      }),
      prisma.capability.findMany({
        select: {
          slug: true,
          name: true,
          _count: { select: { models: true } },
        },
      }),
      prisma.model.count(),
      prisma.modelProvider.aggregate({
        _min: { inputPricePerMillion: true },
        _max: { inputPricePerMillion: true },
      }),
    ]);

  return {
    totalModels,
    labs: labs.map((l) => ({ slug: l.slug, name: l.name, count: l._count.models })),
    providers: providers.map((p) => ({ slug: p.slug, name: p.name, count: p._count.models })),
    modalities: modalities.map((m) => ({ slug: m.slug, name: m.name, count: m._count.inputModels })),
    capabilities: capabilities.map((c) => ({ slug: c.slug, name: c.name, count: c._count.models })),
    modelTypes: ["LLM", "MULTIMODAL", "EMBEDDING", "IMAGE", "AUDIO", "VIDEO"],
    licenses: ["PROPRIETARY", "OPEN_WEIGHTS", "OPEN_SOURCE"],
    priceRange: {
      min: Number(priceAgg._min.inputPricePerMillion ?? 0),
      max: Number(priceAgg._max.inputPricePerMillion ?? 40),
    },
  };
}
