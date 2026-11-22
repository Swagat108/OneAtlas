import { NextRequest } from "next/server";
import { compareQuerySchema } from "@/schemas/compare.schema";
import * as compareService from "@/services/compare.service";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const { slugs } = compareQuerySchema.parse(searchParams);

    const comparison = await compareService.compareModels(slugs);

    return apiSuccess(comparison, 200, {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
