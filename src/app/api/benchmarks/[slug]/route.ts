import { NextRequest } from "next/server";
import * as benchmarkRepo from "@/repositories/benchmark.repo";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const benchmark = await benchmarkRepo.findBenchmarkBySlug(params.slug);
    if (!benchmark) {
      throw new NotFoundError("Benchmark", params.slug);
    }
    return apiSuccess(benchmark, 200, {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
