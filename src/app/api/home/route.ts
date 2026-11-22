import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { formatCurrency, formatTokenCount } from "@/lib/utils";

export const revalidate = 60;

export async function GET() {
  try {
    const [modelsCount, labsCount, providersCount, benchmarksCount] = await Promise.all([
      prisma.model.count({ where: { status: { not: "DEPRECATED" } } }),
      prisma.lab.count(),
      prisma.provider.count(),
      prisma.benchmark.count(),
    ]);

    // Query 4 spotlight models dynamically
    const featuredSlugs = ["o1", "claude-3-5-sonnet", "deepseek-v3", "llama-3-1-70b"];
    const models = await prisma.model.findMany({
      where: {
        slug: { in: featuredSlugs },
      },
      include: {
        lab: true,
        providers: {
          where: { isAvailable: true },
          orderBy: { inputPricePerMillion: "asc" },
          take: 1,
        },
      },
    });

    const badgeMap: Record<string, string> = {
      "o1": "Reasoning Champion",
      "claude-3-5-sonnet": "Top Coding Model",
      "deepseek-v3": "Open Weights Frontier",
      "llama-3-1-70b": "High Throughput Workhorse",
    };

    const featuredModels = models.map((m) => {
      const cheapest = m.providers[0];
      const minPrice = cheapest ? Number(cheapest.inputPricePerMillion) : null;
      return {
        slug: m.slug,
        name: m.name,
        lab: m.lab.name,
        labSlug: m.lab.slug,
        logoUrl: m.lab.logoUrl,
        badge: badgeMap[m.slug] || "Frontier Model",
        desc: m.description,
        context: formatTokenCount(m.contextWindow),
        price: minPrice !== null ? `${formatCurrency(minPrice)} / 1M` : "Free",
      };
    });

    return apiSuccess({
      stats: {
        modelsCount,
        labsCount,
        providersCount,
        benchmarksCount,
      },
      featuredModels,
    }, 200, {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
