import { API_BASE } from "@/lib/config";
import type { Locale } from "@/types/api";

const REQUEST_TIMEOUT_MS = 15000;

function buildUrl(endpoint: string) {
  return new URL(endpoint.replace(/^\/+/, ""), API_BASE).toString();
}

function authHeaders(locale: Locale, withToken = false) {
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Localize": locale,
  };

  if (withToken && typeof document !== "undefined") {
    const token = getCookie("sunpyramids-token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie.split("; ").find((item) => item.startsWith(`${name}=`));
  if (!cookie) return null;
  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

export function setCookie(name: string, value: string | null) {
  if (typeof document === "undefined") return;
  if (value === null) {
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
    return;
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=2592000; samesite=lax`;
}

export async function apiPost<T>(
  endpoint: string,
  body: unknown,
  locale: Locale = "en",
  withToken = false,
): Promise<T> {
  const response = await fetchWithTimeout(buildUrl(endpoint), {
    method: "POST",
    headers: authHeaders(locale, withToken),
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
  withToken = true,
): Promise<T> {
  const response = await fetchWithTimeout(buildUrl(endpoint), {
    method: "GET",
    headers: authHeaders(locale, withToken),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function apiPatch<T>(
  endpoint: string,
  body: unknown,
  locale: Locale = "en",
  withToken = true,
): Promise<T> {
  const response = await fetchWithTimeout(buildUrl(endpoint), {
    method: "PATCH",
    headers: authHeaders(locale, withToken),
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function apiPut<T>(
  endpoint: string,
  locale: Locale = "en",
  withToken = true,
  body?: unknown,
): Promise<T> {
  const response = await fetchWithTimeout(buildUrl(endpoint), {
    method: "PUT",
    headers: authHeaders(locale, withToken),
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function apiDelete<T>(
  endpoint: string,
  locale: Locale = "en",
  withToken = true,
): Promise<T> {
  const response = await fetchWithTimeout(buildUrl(endpoint), {
    method: "DELETE",
    headers: authHeaders(locale, withToken),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export function clientApiUrl(endpoint: string) {
  return buildUrl(endpoint);
}

async function fetchWithTimeout(input: RequestInfo | URL, init: RequestInit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}
