"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Locale } from "@/types/api";
import { languageOptions } from "@/lib/locales";
import { useCurrency } from "@/components/CurrencyProvider";

export function LanguageCurrencyTrigger({ locale, onClick, className = "" }: { locale: Locale; onClick: () => void; className?: string }) {
  const { selected } = useCurrency();
  return (
    <button className={`header-language ${className}`} type="button" onClick={onClick} aria-label="Language and currency">
      <Image src="/icons/language.svg" alt="" width={20} height={20} aria-hidden="true" />
      <span>
        {locale.toUpperCase()} - {selected.name}
      </span>
    </button>
  );
}

export function LanguageCurrencyModal({
  locale,
  pathname,
  onClose,
}: {
  locale: Locale;
  pathname: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const { currencies, selected, setCurrency } = useCurrency();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  function switchLanguage(code: Locale) {
    if (code === locale) return;
    const base = pathname.replace(/^\/(fr|de|it|pt|es|zh)(?=\/|$)/, "") || "/";
    const prefix = code === "en" ? "" : `/${code}`;
    const query = typeof window !== "undefined" ? window.location.search : "";
    router.push(`${prefix}${base === "/" ? "" : base}${query}` || "/");
    onClose();
  }

  return (
    <div className="lc-modal-backdrop" role="dialog" aria-modal="true" aria-label="Language and Currency" onClick={onClose}>
      <div className="lc-modal" onClick={(event) => event.stopPropagation()}>
        <div className="lc-modal-head">
          <h2>Language and Currency</h2>
          <button type="button" className="lc-modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="lc-section">
          <p className="lc-label">Currency</p>
          <div className="lc-grid">
            {currencies.map((currency) => (
              <button
                key={currency.id}
                type="button"
                className={`lc-tile ${currency.id === selected.id ? "lc-tile-active" : ""}`}
                onClick={() => setCurrency(currency)}
              >
                <span className="lc-tile-title">{currency.title}</span>
                <span className="lc-tile-value">
                  {currency.symbol} {currency.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="lc-section">
          <p className="lc-label">Region and Language</p>
          <div className="lc-grid">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`lc-tile ${lang.code === locale ? "lc-tile-active" : ""}`}
                onClick={() => switchLanguage(lang.code)}
              >
                <span className="lc-tile-title">{lang.country}</span>
                <span className="lc-tile-value">{lang.language}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
