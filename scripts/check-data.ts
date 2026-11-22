import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkData() {
  console.log("==========================================");
  console.log("🔍 ONEATLAS DATABASE HEALTH & DATA CHECK");
  console.log("==========================================");

  let hasErrors = false;

  try {
    // 1. Row counts
    const labsCount = await prisma.lab.count();
    const providersCount = await prisma.provider.count();
    const modelsCount = await prisma.model.count();
    const benchmarksCount = await prisma.benchmark.count();
    const benchmarkScoresCount = await prisma.benchmarkScore.count();
    const modelProvidersCount = await prisma.modelProvider.count();
    const modalitiesCount = await prisma.modality.count();
    const capabilitiesCount = await prisma.capability.count();
    const syncLogsCount = await prisma.dataSyncLog.count();

    console.log("\n📊 TABLE RECORD COUNTS:");
    console.log(`- Labs:             ${labsCount}`);
    console.log(`- Providers:        ${providersCount}`);
    console.log(`- Models:           ${modelsCount}`);
    console.log(`- Benchmarks:       ${benchmarksCount}`);
    console.log(`- Benchmark Scores: ${benchmarkScoresCount}`);
    console.log(`- Rate Cards (MP):  ${modelProvidersCount}`);
    console.log(`- Modalities:       ${modalitiesCount}`);
    console.log(`- Capabilities:     ${capabilitiesCount}`);
    console.log(`- Data Sync Logs:   ${syncLogsCount}`);

    if (modelsCount === 0) {
      console.error("❌ ERROR: No models found in database!");
      hasErrors = true;
    }
    if (labsCount === 0) {
      console.error("❌ ERROR: No labs found in database!");
      hasErrors = true;
    }
    if (providersCount === 0) {
      console.error("❌ ERROR: No providers found in database!");
      hasErrors = true;
    }
    if (benchmarkScoresCount === 0) {
      console.error("❌ ERROR: No benchmark scores found in database!");
      hasErrors = true;
    }

    // 2. Check for models without providers
    const modelsWithoutProviders = await prisma.model.findMany({
      where: { providers: { none: {} } },
      select: { slug: true, name: true },
    });
    if (modelsWithoutProviders.length > 0) {
      console.warn(`⚠️ WARNING: ${modelsWithoutProviders.length} models have no provider pricing cards:`);
      modelsWithoutProviders.forEach((m) => console.warn(`   - ${m.name} (${m.slug})`));
    } else {
      console.log("\n✅ All models have at least one active hosting provider rate card.");
    }

    // 3. Check for models without benchmarks
    const modelsWithoutScores = await prisma.model.findMany({
      where: { benchmarkScores: { none: {} } },
      select: { slug: true, name: true },
    });
    if (modelsWithoutScores.length > 0) {
      console.warn(`⚠️ NOTE: ${modelsWithoutScores.length} models currently have no benchmark scores recorded (expected for pure embedding or preview models):`);
      modelsWithoutScores.forEach((m) => console.warn(`   - ${m.name} (${m.slug})`));
    } else {
      console.log("✅ All models have benchmark scores recorded.");
    }

    // 4. Check for invalid prices
    const invalidPrices = await prisma.modelProvider.findMany({
      where: {
        OR: [
          { inputPricePerMillion: { lt: 0 } },
          { outputPricePerMillion: { lt: 0 } },
        ],
      },
      select: { id: true, modelId: true },
    });
    if (invalidPrices.length > 0) {
      console.error(`❌ ERROR: Found ${invalidPrices.length} negative pricing entries!`);
      hasErrors = true;
    } else {
      console.log("✅ Zero negative token prices detected.");
    }

    // 5. Last sync log
    const lastSync = await prisma.dataSyncLog.findFirst({
      orderBy: { startedAt: "desc" },
    });
    if (lastSync) {
      console.log(`\n🕒 LAST DATA SYNC: ${lastSync.startedAt.toISOString()} (Source: ${lastSync.source}, Status: ${lastSync.status})`);
    } else {
      console.log("\nℹ️ No DataSyncLog entries recorded yet.");
    }

    console.log("\n==========================================");
    if (hasErrors) {
      console.error("❌ DATA CHECK FAILED WITH CRITICAL ERRORS");
      process.exit(1);
    } else {
      console.log("✅ DATABASE INTEGRITY & DATA VALIDATION PASSED");
    }
  } catch (err) {
    console.error("❌ Exception during data check:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
