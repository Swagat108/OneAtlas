import { NextRequest } from "next/server";
import * as benchmarkRepo from "@/repositories/benchmark.repo";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET(_request: NextRequest) {
  try {
    const benchmarks = await benchmarkRepo.findAllBenchmarks();
    return apiSuccess(benchmarks, 200, {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
