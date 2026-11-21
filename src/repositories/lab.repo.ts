import { prisma } from "@/lib/prisma";

export async function findAllLabs() {
  return prisma.lab.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { models: true },
      },
    },
  });
}

export async function findLabBySlug(slug: string) {
  return prisma.lab.findUnique({
    where: { slug },
    include: {
      models: {
        where: { status: { not: "DEPRECATED" } },
        orderBy: { releaseDate: "desc" },
        include: {
          inputModalities: { include: { modality: true } },
          capabilities: { include: { capability: true } },
          providers: {
            where: { isAvailable: true },
            include: { provider: true },
            orderBy: { inputPricePerMillion: "asc" },
            take: 1,
          },
        },
      },
    },
  });
}
