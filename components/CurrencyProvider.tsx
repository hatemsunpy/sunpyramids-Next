"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  UI_DEFAULT_CURRENCY,
  fetchCurrencies,
  readCurrencyCookie,
  writeCurrencyCookie,
  type Currency,
  type CurrencyLoadResult,
} from "@/lib/currencies";

type CurrencyContextValue = {
  currencies: Currency[];
  selected: Currency | null;
  source: CurrencyLoadResult["source"] | "loading";
  setCurrency: (currency: Currency) => void;
  format: (amount: number | string | null | undefined) => string;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currencies: [],
  selected: null,
  source: "loading",
  setCurrency: () => undefined,
  format: (amount) => `${UI_DEFAULT_CURRENCY.symbol}${Number(amount || 0).toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selected, setSelected] = useState<Currency | null>(null);
  const [source, setSource] = useState<CurrencyContextValue["source"]>("loading");

  useEffect(() => {
    let active = true;
    fetchCurrencies().then((result) => {
      if (!active) return;
      const saved = readCurrencyCookie();
      setCurrencies(result.currencies);
      setSelected(
        result.currencies.find((currency) => currency.name === saved) ??
        result.currencies.find((currency) => currency.name === "USD") ??
        result.currencies[0] ??
        null,
      );
      setSource(result.source);
    });
    return () => {
      active = false;
    };
  }, []);

  const setCurrency = useCallback((currency: Currency) => {
    setSelected(currency);
    writeCurrencyCookie(currency.name);
  }, []);

  const format = useCallback(
    (amount: number | string | null | undefined) => {
      const numeric = Number(amount || 0);
      const baseValue = Number.isFinite(numeric) ? numeric : 0;
      if (!selected) {
        return `${UI_DEFAULT_CURRENCY.symbol}${baseValue.toFixed(2)}`;
      }
      return `${selected.symbol}${(baseValue * selected.exchange_rate).toFixed(2)}`;
    },
    [selected],
  );

  const value = useMemo(
    () => ({ currencies, selected, source, setCurrency, format }),
    [currencies, selected, source, setCurrency, format],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
