import { NextRequest } from "next/server";
import * as modelService from "@/services/model.service";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const model = await modelService.getModelDetail(params.slug);
    return apiSuccess(model, 200, {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
