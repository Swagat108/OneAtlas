import { NextRequest } from "next/server";
import { modelFilterQuerySchema } from "@/schemas/model.schema";
import * as modelService from "@/services/model.service";
import { apiPaginatedSuccess, handleApiError } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = modelFilterQuerySchema.parse(searchParams);

    const { models, meta } = await modelService.getModels(query);

    return apiPaginatedSuccess(models, meta, 200, {
      "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
