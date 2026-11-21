import { NextRequest } from "next/server";
import * as labRepo from "@/repositories/lab.repo";
import { apiSuccess, handleApiError } from "@/lib/api-response";

export async function GET(_request: NextRequest) {
  try {
    const labs = await labRepo.findAllLabs();
    return apiSuccess(labs, 200, {
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
