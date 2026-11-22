import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://oneatlas.vercel.app");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/models`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rankings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/benchmarks`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/labs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/providers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    const [models, labs, providers, benchmarks] = await Promise.all([
      prisma.model.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.lab.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.provider.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.benchmark.findMany({ select: { slug: true } }),
    ]);

    const modelRoutes: MetadataRoute.Sitemap = models.map((m) => ({
      url: `${baseUrl}/models/${m.slug}`,
      lastModified: m.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    const labRoutes: MetadataRoute.Sitemap = labs.map((l) => ({
      url: `${baseUrl}/labs/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const providerRoutes: MetadataRoute.Sitemap = providers.map((p) => ({
      url: `${baseUrl}/providers/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    const benchmarkRoutes: MetadataRoute.Sitemap = benchmarks.map((b) => ({
      url: `${baseUrl}/benchmarks/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

    return [...staticRoutes, ...modelRoutes, ...labRoutes, ...providerRoutes, ...benchmarkRoutes];
  } catch {
    return staticRoutes;
  }
}
