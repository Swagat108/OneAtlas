import { NextRequest } from "next/server";
import * as modelRepo from "@/repositories/model.repo";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET(_request: NextRequest) {
  try {
    const facets = await modelRepo.getModelFilterFacets();

    return apiSuccess(facets, 200, {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
