"use client";

import { useCurrency } from "@/components/CurrencyProvider";

export function PriceText({ amount, fallback = "Request Price" }: { amount: number | string | null | undefined; fallback?: string }) {
  const { format } = useCurrency();
  if (amount === null || amount === undefined || amount === "") return <>{fallback}</>;
  return <>{format(amount)}</>;
}
