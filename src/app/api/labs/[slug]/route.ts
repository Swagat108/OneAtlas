import { NextRequest } from "next/server";
import * as labRepo from "@/repositories/lab.repo";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { NotFoundError } from "@/lib/errors";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const lab = await labRepo.findLabBySlug(params.slug);
    if (!lab) {
      throw new NotFoundError("AI Lab", params.slug);
    }
    return apiSuccess(lab, 200, {
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
