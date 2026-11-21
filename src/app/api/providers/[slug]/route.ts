import { NextRequest } from "next/server";
import * as providerRepo from "@/repositories/provider.repo";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const provider = await providerRepo.findProviderBySlug(params.slug);
    if (!provider) {
      throw new NotFoundError("Provider", params.slug);
    }
    return apiSuccess(provider, 200, {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
