import Link from "next/link";
import type { Locale } from "@/types/api";
import { withLocale } from "@/lib/locales";

export function BottomBar({ locale = "en" }: { locale?: Locale }) {
  const items = [
    ["Home", "/", "⌂"],
    ["Offers", "/trips?main=special-offers", "♡"],
    ["Search", "/trips", "⌕"],
    ["Cart", "/cart", "□"],
  ] as const;

  return (
    <nav className="bottom-bar" aria-label="Mobile shortcuts">
      {items.map(([label, href, icon]) => (
        <Link key={href} href={withLocale(href, locale)}>
          <span aria-hidden="true" style={{ fontSize: "1.2rem" }}>{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
