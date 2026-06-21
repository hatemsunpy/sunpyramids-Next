"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/types/api";
import { localeLabels, locales, withLocale } from "@/lib/locales";

const tourLinks = [
  ["One Day Tours", "/egypt-tours/one-day-tours"],
  ["Multi Days Tours", "/egypt-tours/multi-days-tours"],
  ["Nile Cruises", "/egypt-tours/nile-cruises"],
  ["Shore Excursions", "/egypt-tours/shore-excursions"],
];

const links = [
  ["Home", "/"],
  ["About", "/about-us"],
  ["Contact", "/contact-us"],
  ["Blogs", "/blogs/all-blogs"],
  ["Events", "/events"],
];

export function Header({ locale = "en" }: { locale?: Locale }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href={withLocale("/", locale)} aria-label="Sun Pyramids home">
          <Image src="/images/logo.png" alt="Sun Pyramids Tours" width={190} height={68} priority />
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <div className="dropdown">
            <button type="button">
              Egypt Tours <span aria-hidden="true">⌄</span>
            </button>
            <div className="dropdown-panel">
              {tourLinks.map(([label, href]) => (
                <Link key={href} href={withLocale(href, locale)}>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {links.map(([label, href]) => (
            <Link key={href} href={withLocale(href, locale)}>
              {label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
          <Link className="btn-outline" href={withLocale("/trips", locale)} aria-label="Search trips">
            <span aria-hidden="true">⌕</span>
            <span className="hidden-mobile">Discover</span>
          </Link>
          <Link className="btn-outline" href={withLocale("/cart", locale)} aria-label="Cart">
            <span aria-hidden="true">Cart</span>
          </Link>
          <select
            aria-label="Change language"
            defaultValue={locale}
            onChange={(event) => {
              window.location.href = withLocale("/", event.target.value as Locale);
            }}
            className="btn-outline"
          >
            {locales.map((item) => (
              <option key={item} value={item}>
                {localeLabels[item]}
              </option>
            ))}
          </select>
          <button className="btn-outline" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span aria-hidden="true">Menu</span>
          </button>
        </div>
      </div>

      <div className="promo-strip">
        <span>Special Easter packages and Egypt escapes are available now.</span>
        <Link className="btn-primary" href={withLocale("/egypt-tours/multi-days-tours/easter-packages", locale)}>
          Explore Offers
        </Link>
      </div>

      {menuOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,.5)",
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{ width: "min(86vw, 380px)", background: "#fff", padding: "2rem", overflow: "auto" }}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="btn-outline" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <span aria-hidden="true">×</span> Close
            </button>
            <div className="footer-links" style={{ marginTop: "2rem" }}>
              {[...tourLinks, ...links, ["Make Your Trip", "/make-your-trip"], ["Rent Car", "/rent-car"]].map(
                ([label, href]) => (
                  <Link key={href} href={withLocale(href, locale)} onClick={() => setMenuOpen(false)}>
                    {label}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
