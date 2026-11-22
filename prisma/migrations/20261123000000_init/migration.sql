-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('LLM', 'IMAGE', 'EMBEDDING', 'AUDIO', 'VIDEO', 'MULTIMODAL');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('OPEN_SOURCE', 'PROPRIETARY', 'OPEN_WEIGHTS');

-- CreateEnum
CREATE TYPE "ModelStatus" AS ENUM ('ACTIVE', 'PREVIEW', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "BenchmarkCategory" AS ENUM ('REASONING', 'CODING', 'MATH', 'KNOWLEDGE', 'MULTIMODAL', 'AGENTIC', 'SAFETY');

-- CreateTable
CREATE TABLE "Lab" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "logoUrl" TEXT,
    "country" TEXT NOT NULL,
    "foundedYear" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "modelType" "ModelType" NOT NULL DEFAULT 'LLM',
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "contextWindow" INTEGER NOT NULL,
    "maxOutputTokens" INTEGER NOT NULL,
    "parameterCount" TEXT,
    "license" "LicenseType" NOT NULL DEFAULT 'PROPRIETARY',
    "status" "ModelStatus" NOT NULL DEFAULT 'ACTIVE',
    "architecture" TEXT,
    "huggingFaceUrl" TEXT,
    "paperUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modality" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Modality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelInputModality" (
    "modelId" TEXT NOT NULL,
    "modalityId" TEXT NOT NULL,

    CONSTRAINT "ModelInputModality_pkey" PRIMARY KEY ("modelId","modalityId")
);

-- CreateTable
CREATE TABLE "ModelOutputModality" (
    "modelId" TEXT NOT NULL,
    "modalityId" TEXT NOT NULL,

    CONSTRAINT "ModelOutputModality_pkey" PRIMARY KEY ("modelId","modalityId")
);

-- CreateTable
CREATE TABLE "Capability" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelCapability" (
    "modelId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,

    CONSTRAINT "ModelCapability_pkey" PRIMARY KEY ("modelId","capabilityId")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "regions" TEXT[],
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelProvider" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "inputPricePerMillion" DECIMAL(10,4) NOT NULL,
    "outputPricePerMillion" DECIMAL(10,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "contextWindowOverride" INTEGER,
    "latencyMs" DOUBLE PRECISION,
    "throughputTps" DOUBLE PRECISION,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT DEFAULT 'direct',
    "sourceUrl" TEXT,
    "fetchedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModelProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Benchmark" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "BenchmarkCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL,
    "higherIsBetter" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Benchmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BenchmarkScore" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "benchmarkId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "fetchedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "measuredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BenchmarkScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelAlias" (
    "id" TEXT NOT NULL,
    "modelId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataSyncLog" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordsCreated" INTEGER NOT NULL DEFAULT 0,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "recordsSkipped" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "DataSyncLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lab_slug_key" ON "Lab"("slug");

-- CreateIndex
CREATE INDEX "Lab_slug_idx" ON "Lab"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Model_slug_key" ON "Model"("slug");

-- CreateIndex
CREATE INDEX "Model_slug_idx" ON "Model"("slug");

-- CreateIndex
CREATE INDEX "Model_labId_idx" ON "Model"("labId");

-- CreateIndex
CREATE INDEX "Model_releaseDate_idx" ON "Model"("releaseDate");

-- CreateIndex
CREATE INDEX "Model_contextWindow_idx" ON "Model"("contextWindow");

-- CreateIndex
CREATE INDEX "Model_modelType_idx" ON "Model"("modelType");

-- CreateIndex
CREATE INDEX "Model_license_idx" ON "Model"("license");

-- CreateIndex
CREATE UNIQUE INDEX "Modality_slug_key" ON "Modality"("slug");

-- CreateIndex
CREATE INDEX "Modality_slug_idx" ON "Modality"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Capability_slug_key" ON "Capability"("slug");

-- CreateIndex
CREATE INDEX "Capability_slug_idx" ON "Capability"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "Provider_slug_idx" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "ModelProvider_modelId_idx" ON "ModelProvider"("modelId");

-- CreateIndex
CREATE INDEX "ModelProvider_providerId_idx" ON "ModelProvider"("providerId");

-- CreateIndex
CREATE INDEX "ModelProvider_inputPricePerMillion_idx" ON "ModelProvider"("inputPricePerMillion");

-- CreateIndex
CREATE INDEX "ModelProvider_outputPricePerMillion_idx" ON "ModelProvider"("outputPricePerMillion");

-- CreateIndex
CREATE UNIQUE INDEX "ModelProvider_modelId_providerId_key" ON "ModelProvider"("modelId", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "Benchmark_slug_key" ON "Benchmark"("slug");

-- CreateIndex
CREATE INDEX "Benchmark_slug_idx" ON "Benchmark"("slug");

-- CreateIndex
CREATE INDEX "Benchmark_category_idx" ON "Benchmark"("category");

-- CreateIndex
CREATE INDEX "BenchmarkScore_modelId_idx" ON "BenchmarkScore"("modelId");

-- CreateIndex
CREATE INDEX "BenchmarkScore_benchmarkId_idx" ON "BenchmarkScore"("benchmarkId");

-- CreateIndex
CREATE INDEX "BenchmarkScore_score_idx" ON "BenchmarkScore"("score");

-- CreateIndex
CREATE UNIQUE INDEX "BenchmarkScore_modelId_benchmarkId_key" ON "BenchmarkScore"("modelId", "benchmarkId");

-- CreateIndex
CREATE UNIQUE INDEX "ModelAlias_alias_key" ON "ModelAlias"("alias");

-- CreateIndex
CREATE INDEX "ModelAlias_modelId_idx" ON "ModelAlias"("modelId");

-- CreateIndex
CREATE INDEX "ModelAlias_alias_idx" ON "ModelAlias"("alias");

-- CreateIndex
CREATE INDEX "DataSyncLog_source_idx" ON "DataSyncLog"("source");

-- CreateIndex
CREATE INDEX "DataSyncLog_startedAt_idx" ON "DataSyncLog"("startedAt");

-- AddForeignKey
ALTER TABLE "Model" ADD CONSTRAINT "Model_labId_fkey" FOREIGN KEY ("labId") REFERENCES "Lab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelInputModality" ADD CONSTRAINT "ModelInputModality_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelInputModality" ADD CONSTRAINT "ModelInputModality_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "Modality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelOutputModality" ADD CONSTRAINT "ModelOutputModality_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelOutputModality" ADD CONSTRAINT "ModelOutputModality_modalityId_fkey" FOREIGN KEY ("modalityId") REFERENCES "Modality"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelCapability" ADD CONSTRAINT "ModelCapability_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelCapability" ADD CONSTRAINT "ModelCapability_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelProvider" ADD CONSTRAINT "ModelProvider_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenchmarkScore" ADD CONSTRAINT "BenchmarkScore_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BenchmarkScore" ADD CONSTRAINT "BenchmarkScore_benchmarkId_fkey" FOREIGN KEY ("benchmarkId") REFERENCES "Benchmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModelAlias" ADD CONSTRAINT "ModelAlias_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE CASCADE ON UPDATE CASCADE;
