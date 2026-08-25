import { notFound } from "next/navigation";
import { formatApiError, type ApiResult } from "@/lib/api";

export function resolveRequiredApiResult<T>(apiResult: ApiResult<T>, label: string): T {
  if (!apiResult.ok) {
    if (apiResult.reason === "not_found") notFound();
    throw new Error(`Failed to fetch ${label}: ${formatApiError(apiResult)}`);
  }
  if (apiResult.value == null) {
    throw new Error(`Failed to fetch ${label}: invalid_response — response data was empty`);
  }
  return apiResult.value;
}
