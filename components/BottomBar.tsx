import Link from "next/link";
import type { Locale } from "@/types/api";
import { withLocale } from "@/lib/locales";
import { uiCopy } from "@/lib/ui-copy";

const items = [
  ["home", "/", "⌂"], ["trips", "/trips", "◇"], ["offers", "/trips?main=special-offers", "%"],
  ["cart", "/cart", "▱"],
] as const;

export function BottomBar({ locale = "en" }: { locale?: Locale }) {
  const copy = uiCopy(locale);
  return (
    <nav className="bottom-bar" aria-label="Mobile shortcuts">
      {items.map(([key, href, icon]) => (
        <Link key={href} href={withLocale(href, locale)}>
          <span className="bottom-icon" aria-hidden="true">{icon}</span>
          <span>{copy[key]}</span>
        </Link>
      ))}
    </nav>
  );
}
