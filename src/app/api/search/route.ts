import { NextRequest } from "next/server";
import { searchQuerySchema } from "@/schemas/search.schema";
import * as searchService from "@/services/search.service";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { q, limit } = searchQuerySchema.parse(searchParams);

    const results = await searchService.searchGlobal(q, limit);

    return apiSuccess(results, 200, {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
