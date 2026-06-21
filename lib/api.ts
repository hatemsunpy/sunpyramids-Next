import { cookies } from "next/headers";
import type { Locale } from "@/types/api";
import { API_BASE } from "@/lib/config";

type ApiOptions = {
  locale?: Locale;
  token?: string;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
};

function buildUrl(endpoint: string) {
  return new URL(endpoint.replace(/^\/+/, ""), API_BASE).toString();
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T | null> {
  const cookieStore = await cookies();
  const token = options.token ?? cookieStore.get("sunpyramids-token")?.value;
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Localize": options.locale || "en",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(buildUrl(endpoint), {
      headers,
      cache: options.cache ?? "force-cache",
      next: options.next ?? { revalidate: 300 },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export { buildUrl };
