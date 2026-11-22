import { prisma } from "@/lib/prisma";

export async function searchGlobal(q: string, limit = 5) {
  const query = q.trim();
  if (!query) {
    return { models: [], labs: [], providers: [] };
  }

  const [models, labs, providers] = await Promise.all([
    prisma.model.findMany({
      where: {
        status: { not: "DEPRECATED" },
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: {
        slug: true,
        name: true,
        modelType: true,
        contextWindow: true,
        lab: {
          select: { name: true, slug: true, logoUrl: true },
        },
      },
      orderBy: { releaseDate: "desc" },
    }),

    prisma.lab.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: {
        slug: true,
        name: true,
        country: true,
        logoUrl: true,
        _count: { select: { models: true } },
      },
      orderBy: { name: "asc" },
    }),

    prisma.provider.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: limit,
      select: {
        slug: true,
        name: true,
        logoUrl: true,
        _count: { select: { models: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    models: models.map((m) => ({
      slug: m.slug,
      name: m.name,
      type: m.modelType,
      context: m.contextWindow,
      lab: m.lab.name,
      labSlug: m.lab.slug,
      logoUrl: m.lab.logoUrl,
      url: `/models/${m.slug}`,
    })),
    labs: labs.map((l) => ({
      slug: l.slug,
      name: l.name,
      country: l.country,
      logoUrl: l.logoUrl,
      modelCount: l._count.models,
      url: `/labs/${l.slug}`,
    })),
    providers: providers.map((p) => ({
      slug: p.slug,
      name: p.name,
      logoUrl: p.logoUrl,
      modelCount: p._count.models,
      url: `/providers/${p.slug}`,
    })),
  };
}
