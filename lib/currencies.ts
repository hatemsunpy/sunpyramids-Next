import { API_BASE } from "@/lib/config";

export type Currency = {
  id: number;
  title: string;
  name: string;
  symbol: string;
  exchange_rate: number;
};

export const CURRENCY_COOKIE = "carruncy";

export const DEFAULT_CURRENCY: Currency = {
  id: 1,
  title: "US Dollar",
  name: "USD",
  symbol: "$",
  exchange_rate: 1,
};

export const FALLBACK_CURRENCIES: Currency[] = [
  DEFAULT_CURRENCY,
];

export async function fetchCurrencies(): Promise<Currency[]> {
  try {
    const res = await fetch(new URL("currencies", API_BASE), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return FALLBACK_CURRENCIES;
    const json = (await res.json()) as {
      data?: { id: number; title: string; name: string; symbol: string; exchange_rate: number }[];
    };
    const list = (json.data ?? [])
      .filter((c) => c && c.name)
      .map((c) => ({
        id: c.id,
        title: c.title,
        name: c.name,
        symbol: c.symbol || c.name,
        exchange_rate: Number(c.exchange_rate) || 1,
      }));
    return list.length ? list : FALLBACK_CURRENCIES;
  } catch {
    return FALLBACK_CURRENCIES;
  }
}

export function readCurrencyCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function writeCurrencyCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${CURRENCY_COOKIE}=${encodeURIComponent(name)}; path=/; max-age=31536000; samesite=lax`;
}
