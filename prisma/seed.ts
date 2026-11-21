import { PrismaClient, Prisma } from "@prisma/client";
import { labsData } from "./seed-data/labs";
import { providersData } from "./seed-data/providers";
import { modalitiesData, capabilitiesData } from "./seed-data/modalities-capabilities";
import { benchmarksData } from "./seed-data/benchmarks";
import { modelsData } from "./seed-data/models";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting OneAtlas database seeding...");

  // 1. Modalities
  console.log("-> Seeding modalities...");
  const modalityMap = new Map<string, string>();
  for (const m of modalitiesData) {
    const record = await prisma.modality.upsert({
      where: { slug: m.slug },
      update: { name: m.name, description: m.description },
      create: { slug: m.slug, name: m.name, description: m.description },
    });
    modalityMap.set(m.slug, record.id);
  }

  // 2. Capabilities
  console.log("-> Seeding capabilities...");
  const capabilityMap = new Map<string, string>();
  for (const c of capabilitiesData) {
    const record = await prisma.capability.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: { slug: c.slug, name: c.name, description: c.description },
    });
    capabilityMap.set(c.slug, record.id);
  }

  // 3. Labs
  console.log("-> Seeding AI research labs...");
  const labMap = new Map<string, string>();
  for (const lab of labsData) {
    const record = await prisma.lab.upsert({
      where: { slug: lab.slug },
      update: {
        name: lab.name,
        description: lab.description,
        website: lab.website,
        logoUrl: lab.logoUrl,
        country: lab.country,
        foundedYear: lab.foundedYear,
      },
      create: {
        slug: lab.slug,
        name: lab.name,
        description: lab.description,
        website: lab.website,
        logoUrl: lab.logoUrl,
        country: lab.country,
        foundedYear: lab.foundedYear,
      },
    });
    labMap.set(lab.slug, record.id);
  }

  // 4. Providers
  console.log("-> Seeding cloud providers...");
  const providerMap = new Map<string, string>();
  for (const prov of providersData) {
    const record = await prisma.provider.upsert({
      where: { slug: prov.slug },
      update: {
        name: prov.name,
        website: prov.website,
        regions: prov.regions,
        description: prov.description,
        logoUrl: prov.logoUrl,
      },
      create: {
        slug: prov.slug,
        name: prov.name,
        website: prov.website,
        regions: prov.regions,
        description: prov.description,
        logoUrl: prov.logoUrl,
      },
    });
    providerMap.set(prov.slug, record.id);
  }

  // 5. Benchmarks
  console.log("-> Seeding benchmarks...");
  const benchmarkMap = new Map<string, string>();
  for (const b of benchmarksData) {
    const record = await prisma.benchmark.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        category: b.category,
        description: b.description,
        maxScore: b.maxScore,
        higherIsBetter: b.higherIsBetter,
      },
      create: {
        slug: b.slug,
        name: b.name,
        category: b.category,
        description: b.description,
        maxScore: b.maxScore,
        higherIsBetter: b.higherIsBetter,
      },
    });
    benchmarkMap.set(b.slug, record.id);
  }

  // 6. Models with relations
  console.log(`-> Seeding ${modelsData.length} models with providers and scores...`);
  let modelCount = 0;
  for (const m of modelsData) {
    const labId = labMap.get(m.labSlug);
    if (!labId) {
      console.warn(`Skipping model ${m.slug}: lab ${m.labSlug} not found.`);
      continue;
    }

    // Upsert base model
    const model = await prisma.model.upsert({
      where: { slug: m.slug },
      update: {
        name: m.name,
        labId,
        description: m.description,
        modelType: m.modelType,
        releaseDate: new Date(m.releaseDate),
        contextWindow: m.contextWindow,
        maxOutputTokens: m.maxOutputTokens,
        parameterCount: m.parameterCount,
        license: m.license,
        status: m.status,
        architecture: m.architecture,
      },
      create: {
        slug: m.slug,
        name: m.name,
        labId,
        description: m.description,
        modelType: m.modelType,
        releaseDate: new Date(m.releaseDate),
        contextWindow: m.contextWindow,
        maxOutputTokens: m.maxOutputTokens,
        parameterCount: m.parameterCount,
        license: m.license,
        status: m.status,
        architecture: m.architecture,
      },
    });

    // Reset junction tables for this model to ensure idempotency
    await prisma.modelInputModality.deleteMany({ where: { modelId: model.id } });
    await prisma.modelOutputModality.deleteMany({ where: { modelId: model.id } });
    await prisma.modelCapability.deleteMany({ where: { modelId: model.id } });

    // Connect input modalities
    for (const modSlug of m.inputModalities) {
      const modalityId = modalityMap.get(modSlug);
      if (modalityId) {
        await prisma.modelInputModality.create({
          data: { modelId: model.id, modalityId },
        });
      }
    }

    // Connect output modalities
    for (const modSlug of m.outputModalities) {
      const modalityId = modalityMap.get(modSlug);
      if (modalityId) {
        await prisma.modelOutputModality.create({
          data: { modelId: model.id, modalityId },
        });
      }
    }

    // Connect capabilities
    for (const capSlug of m.capabilities) {
      const capabilityId = capabilityMap.get(capSlug);
      if (capabilityId) {
        await prisma.modelCapability.create({
          data: { modelId: model.id, capabilityId },
        });
      }
    }

    // Providers with pricing
    for (const p of m.providers) {
      const providerId = providerMap.get(p.providerSlug);
      if (providerId) {
        await prisma.modelProvider.upsert({
          where: {
            modelId_providerId: {
              modelId: model.id,
              providerId,
            },
          },
          update: {
            inputPricePerMillion: new Prisma.Decimal(p.inputPricePerMillion),
            outputPricePerMillion: new Prisma.Decimal(p.outputPricePerMillion),
            contextWindowOverride: p.contextWindowOverride,
            latencyMs: p.latencyMs,
            throughputTps: p.throughputTps,
            isAvailable: true,
          },
          create: {
            modelId: model.id,
            providerId,
            inputPricePerMillion: new Prisma.Decimal(p.inputPricePerMillion),
            outputPricePerMillion: new Prisma.Decimal(p.outputPricePerMillion),
            contextWindowOverride: p.contextWindowOverride,
            latencyMs: p.latencyMs,
            throughputTps: p.throughputTps,
            isAvailable: true,
          },
        });
      }
    }

    // Benchmark scores
    for (const s of m.scores) {
      const benchmarkId = benchmarkMap.get(s.benchmarkSlug);
      if (benchmarkId) {
        await prisma.benchmarkScore.upsert({
          where: {
            modelId_benchmarkId: {
              modelId: model.id,
              benchmarkId,
            },
          },
          update: {
            score: s.score,
            source: s.source,
          },
          create: {
            modelId: model.id,
            benchmarkId,
            score: s.score,
            source: s.source,
          },
        });
      }
    }

    modelCount++;
  }

  // 7. Additional Benchmark Scores (ARC-Challenge & IFEval)
  const additionalScores: { benchmarkSlug: string; scores: Record<string, number>; source: string }[] = [
    {
      benchmarkSlug: "arc-challenge",
      source: "Official Benchmark Evaluation",
      scores: {
        "o1": 96.7,
        "gpt-4o": 96.4,
        "claude-3-5-sonnet": 96.9,
        "gemini-1-5-pro": 95.8,
        "deepseek-v3": 94.8,
        "llama-3-1-405b": 96.9,
        "llama-3-1-70b": 93.6,
        "grok-2": 95.1,
        "mistral-large-2": 94.2,
        "qwen-2-5-72b-instruct": 95.4,
        "claude-3-opus": 95.4,
        "gpt-4o-mini": 93.4,
        "gemini-1-5-flash": 92.1,
        "claude-3-5-haiku": 92.8,
        "llama-3-1-8b": 89.2,
        "gemma-2-27b": 91.5,
        "command-r-plus": 90.3,
        "gpt-4-turbo": 94.5,
      },
    },
    {
      benchmarkSlug: "ifeval",
      source: "Instruction-Following Evaluation",
      scores: {
        "o1": 91.2,
        "gpt-4o": 88.6,
        "claude-3-5-sonnet": 89.4,
        "gemini-1-5-pro": 87.8,
        "deepseek-v3": 86.4,
        "llama-3-1-405b": 88.2,
        "llama-3-1-70b": 85.5,
        "grok-2": 86.9,
        "mistral-large-2": 85.1,
        "qwen-2-5-72b-instruct": 85.3,
        "claude-3-opus": 84.7,
        "gpt-4o-mini": 83.2,
        "gemini-1-5-flash": 82.5,
        "claude-3-5-haiku": 84.0,
        "llama-3-1-8b": 78.4,
        "gemma-2-27b": 81.2,
      },
    },
  ];

  for (const group of additionalScores) {
    const bId = benchmarkMap.get(group.benchmarkSlug);
    if (bId) {
      for (const [mSlug, score] of Object.entries(group.scores)) {
        const m = await prisma.model.findUnique({ where: { slug: mSlug } });
        if (m) {
          await prisma.benchmarkScore.upsert({
            where: {
              modelId_benchmarkId: {
                modelId: m.id,
                benchmarkId: bId,
              },
            },
            update: { score, source: group.source },
            create: {
              modelId: m.id,
              benchmarkId: bId,
              score,
              source: group.source,
            },
          });
        }
      }
    }
  }

  console.log(`✅ Seed finished successfully! Populated:`);
  console.log(`- ${labsData.length} Labs`);
  console.log(`- ${providersData.length} Providers`);
  console.log(`- ${modalitiesData.length} Modalities`);
  console.log(`- ${capabilitiesData.length} Capabilities`);
  console.log(`- ${benchmarksData.length} Benchmarks`);
  console.log(`- ${modelCount} Models with multi-provider pricing and scores`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
