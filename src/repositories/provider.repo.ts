import { prisma } from "@/lib/prisma";

export async function findAllProviders() {
  return prisma.provider.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { models: true },
      },
    },
  });
}

export async function findProviderBySlug(slug: string) {
  return prisma.provider.findUnique({
    where: { slug },
    include: {
      models: {
        where: { isAvailable: true },
        include: {
          model: {
            include: {
              lab: true,
              capabilities: { include: { capability: true } },
            },
          },
        },
        orderBy: { inputPricePerMillion: "asc" },
      },
    },
  });
}
