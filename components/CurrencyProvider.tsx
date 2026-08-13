"use client";

import { createContext, useContext, useMemo, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  DEFAULT_CURRENCY,
  FALLBACK_CURRENCIES,
  fetchCurrencies,
  readCurrencyCookie,
  writeCurrencyCookie,
  type Currency,
} from "@/lib/currencies";

type CurrencyContextValue = {
  currencies: Currency[];
  selected: Currency;
  setCurrency: (currency: Currency) => void;
  format: (amount: number | string | null | undefined) => string;
};

const CurrencyContext = createContext<CurrencyContextValue>({
  currencies: FALLBACK_CURRENCIES,
  selected: DEFAULT_CURRENCY,
  setCurrency: () => undefined,
  format: (amount) => `$${Number(amount || 0).toFixed(2)}`,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const readInitialCurrency = () => {
    const saved = readCurrencyCookie();
    return FALLBACK_CURRENCIES.find((c) => c.name === saved) ?? FALLBACK_CURRENCIES.find((c) => c.name === "USD") ?? DEFAULT_CURRENCY;
  };

  const [currencies, setCurrencies] = useState<Currency[]>(FALLBACK_CURRENCIES);
  const [selected, setSelected] = useState<Currency>(readInitialCurrency);

  useEffect(() => {
    let active = true;
    fetchCurrencies().then((list) => {
      if (!active) return;
      setCurrencies(list);
      const saved = readCurrencyCookie();
      setSelected(list.find((c) => c.name === saved) ?? list.find((c) => c.name === "USD") ?? list[0] ?? DEFAULT_CURRENCY);
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
      const value = Number.isFinite(numeric) ? numeric * selected.exchange_rate : 0;
      return `${selected.symbol}${value.toFixed(2)}`;
    },
    [selected],
  );

  const value = useMemo(() => ({ currencies, selected, setCurrency, format }), [currencies, selected, setCurrency, format]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
