import { NextRequest } from "next/server";
import * as providerRepo from "@/repositories/provider.repo";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET(_request: NextRequest) {
  try {
    const providers = await providerRepo.findAllProviders();
    return apiSuccess(providers, 200, {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
