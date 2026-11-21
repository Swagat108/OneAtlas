import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "./errors";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

/**
 * Standard success response builder
 */
export function apiSuccess<T>(data: T, status = 200, headers?: HeadersInit) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
  };
  return NextResponse.json(body, { status, headers });
}

/**
 * Standard paginated success response builder
 */
export function apiPaginatedSuccess<T>(
  data: T,
  meta: PaginationMeta,
  status = 200,
  headers?: HeadersInit
) {
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    meta,
  };
  return NextResponse.json(body, { status, headers });
}

/**
 * Standard error response builder
 */
export function apiError(
  code: string,
  message: string,
  status = 400,
  details?: unknown,
  headers?: HeadersInit
) {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined && { details }),
    },
  };
  return NextResponse.json(body, { status, headers });
}

/**
 * Centralized exception-to-response handler for API route handlers
 */
export function handleApiError(error: unknown) {
  console.error("[API_ERROR]", error);

  if (error instanceof ZodError) {
    return apiError(
      "VALIDATION_ERROR",
      "Invalid request parameters or payload",
      400,
      error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }))
    );
  }

  if (error instanceof AppError) {
    return apiError(error.code, error.message, error.statusCode, error.details);
  }

  if (error instanceof Error) {
    return apiError("INTERNAL_SERVER_ERROR", error.message || "An unexpected error occurred", 500);
  }

  return apiError("INTERNAL_SERVER_ERROR", "An unknown error occurred", 500);
}
