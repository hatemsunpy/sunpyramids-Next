import { API_BASE } from "@/lib/config";
import type { Locale } from "@/types/api";

function buildUrl(endpoint: string) {
  return new URL(endpoint.replace(/^\/+/, ""), API_BASE).toString();
}

export async function apiPost<T>(
  endpoint: string,
  body: unknown,
  locale: Locale = "en",
): Promise<T> {
  const response = await fetch(buildUrl(endpoint), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Localize": locale,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function apiGet<T>(
  endpoint: string,
  locale: Locale = "en",
): Promise<T> {
  const token = document.cookie
    .split("; ")
    .find((item) => item.startsWith("sunpyramids-token="))
    ?.split("=")[1];

  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Localize": locale,
  };

  if (token) {
    headers.Authorization = `Bearer ${decodeURIComponent(token)}`;
  }

  const response = await fetch(buildUrl(endpoint), {
    method: "GET",
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}
