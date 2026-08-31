import { API_BASE } from "@/lib/config";

export type Currency = {
  id: number;
  title: string;
  name: string;
  symbol: string;
  exchange_rate: number;
};

export type CurrencyLoadResult = {
  currencies: Currency[];
  source: "api" | "cache" | "unavailable";
};

export const CURRENCY_COOKIE = "carruncy";
export const UI_DEFAULT_CURRENCY = { name: "USD", symbol: "$" } as const;

const CURRENCY_CACHE_KEY = "sunpyramids-currencies-api-v1";

function validCurrency(value: unknown): value is Currency {
  if (!value || typeof value !== "object") return false;
  const currency = value as Partial<Currency>;
  return (
    Number.isInteger(currency.id) &&
    Number(currency.id) > 0 &&
    typeof currency.title === "string" &&
    !!currency.title.trim() &&
    typeof currency.name === "string" &&
    !!currency.name.trim() &&
    typeof currency.symbol === "string" &&
    !!currency.symbol.trim() &&
    Number.isFinite(Number(currency.exchange_rate)) &&
    Number(currency.exchange_rate) > 0
  );
}

function normalizeCurrencies(value: unknown): Currency[] {
  if (!Array.isArray(value)) return [];
  return value.filter(validCurrency).map((currency) => ({
    id: Number(currency.id),
    title: currency.title,
    name: currency.name,
    symbol: currency.symbol,
    exchange_rate: Number(currency.exchange_rate),
  }));
}

function readCachedCurrencies(): Currency[] {
  if (typeof window === "undefined") return [];
  try {
    return normalizeCurrencies(JSON.parse(window.localStorage.getItem(CURRENCY_CACHE_KEY) || "null"));
  } catch {
    return [];
  }
}

function cacheCurrencies(currencies: Currency[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify(currencies));
  } catch {
    // Storage can be unavailable in privacy modes; live API data still works.
  }
}

function unavailableCurrencyResult(): CurrencyLoadResult {
  const cached = readCachedCurrencies();
  return cached.length
    ? { currencies: cached, source: "cache" }
    : { currencies: [], source: "unavailable" };
}

export async function fetchCurrencies(): Promise<CurrencyLoadResult> {
  try {
    const res = await fetch(new URL("currencies", API_BASE), {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return unavailableCurrencyResult();

    const json = (await res.json()) as { data?: unknown };
    const currencies = normalizeCurrencies(json.data);
    if (!currencies.length) return unavailableCurrencyResult();

    cacheCurrencies(currencies);
    return { currencies, source: "api" };
  } catch {
    return unavailableCurrencyResult();
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
