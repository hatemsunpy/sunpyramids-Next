import Link from "next/link";
import type { Locale } from "@/types/api";
import { withLocale } from "@/lib/locales";

const items = [
  ["Home", "/", "⌂"],
  ["Trips", "/trips", "◇"],
  ["Offers", "/trips?main=special-offers", "%"],
  ["Cart", "/cart", "▱"],
] as const;

export function BottomBar({ locale = "en" }: { locale?: Locale }) {
  return (
    <nav className="bottom-bar" aria-label="Mobile shortcuts">
      {items.map(([label, href, icon]) => (
        <Link key={href} href={withLocale(href, locale)}>
          <span className="bottom-icon" aria-hidden="true">{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
