import { NextRequest } from "next/server";
import { rankingQuerySchema } from "@/schemas/ranking.schema";
import * as rankingService from "@/services/ranking.service";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = rankingQuerySchema.parse(searchParams);

    const data = await rankingService.getRankings(query);

    return apiSuccess(data, 200, {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
