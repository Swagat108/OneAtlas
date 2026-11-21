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
      },
      create: {
        slug: prov.slug,
        name: prov.name,
        website: prov.website,
        regions: prov.regions,
        description: prov.description,
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
