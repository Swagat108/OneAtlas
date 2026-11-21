import { prisma } from "@/lib/prisma";

export async function findAllBenchmarks() {
  return prisma.benchmark.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { scores: true },
      },
    },
  });
}

export async function findBenchmarkBySlug(slug: string) {
  const benchmark = await prisma.benchmark.findUnique({
    where: { slug },
    include: {
      scores: {
        include: {
          model: {
            include: {
              lab: true,
              providers: {
                where: { isAvailable: true },
                orderBy: { inputPricePerMillion: "asc" },
                take: 1,
              },
            },
          },
        },
        orderBy: { score: "desc" },
        take: 50,
      },
    },
  });

  return benchmark;
}
