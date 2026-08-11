"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/types/api";
import { withLocale } from "@/lib/locales";
import { LanguageCurrencyModal, LanguageCurrencyTrigger } from "@/components/LanguageCurrencyModal";

const tourLinks = [
  ["One Day Tours", "/egypt-tours/one-day-tours"],
  ["Multi Days Tours", "/egypt-tours/multi-days-tours"],
  ["Nile Cruises", "/egypt-tours/nile-cruises"],
  ["Shore Excursions", "/egypt-tours/shore-excursions"],
];

const mainNavLinks = [
  ["Home", "/"],
  ["About Us", "/about-us"],
  ["Contact Us", "/contact-us"],
  ["Blogs", "/blogs/all-blogs"],
  ["Events", "/events"],
];

const secondaryNavLinks = [
  ["Home", "/"],
  ["Rent Car", "/rent-car"],
  ["About Us", "/about-us"],
  ["Contact Us", "/contact-us"],
  ["Blogs", "/blogs/all-blogs"],
  ["Events", "/events"],
];

function NavDropdown({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when focus leaves the dropdown (button or panel) entirely.
  const handleBlur = () => {
    if (!containerRef.current) return;
    requestAnimationFrame(() => {
      if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
        setOpen(false);
      }
    });
  };

  return (
    <div
      className={`dropdown ${open ? "dropdown-open" : ""}`}
      ref={containerRef}
      onBlur={handleBlur}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
      >
        Egypt Tours <span aria-hidden="true">⌄</span>
      </button>
      <div className="dropdown-panel">
        {tourLinks.map(([label, href]) => (
          <Link key={href} href={withLocale(href, locale)}>
            {label}
            <span aria-hidden="true">›</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Header({ locale = "en" }: { locale?: Locale }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);

  const isHome = pathname === "/" || pathname === `/${locale}`;
  const firstStyle = isHome && isTop;

  const handleScroll = useCallback(() => {
    const mobile = window.innerWidth < 512;
    const top = window.scrollY < (mobile ? window.innerHeight - 440 : window.innerHeight);
    setIsTop(top);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    const id = window.requestAnimationFrame(handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.cancelAnimationFrame(id);
    };
  }, [handleScroll]);

  const openLangModal = useCallback(() => setLangOpen(true), []);
  const closeLangModal = useCallback(() => setLangOpen(false), []);

  return (
    <header className={`site-header ${isHome ? "site-header-home" : ""}`}>
      <div className="header-main">
        <Link href={withLocale("/", locale)} aria-label="Sun Pyramids home" className="header-logo">
          <Image src="/images/logo.png" alt="Sun Pyramids Tours" width={190} height={68} priority />
        </Link>

        {firstStyle ? (
          <nav className="header-inline-nav" aria-label="Main navigation">
            {mainNavLinks.slice(0, 1).map(([label, href]) => (
              <Link key={href} href={withLocale(href, locale)}>
                {label}
              </Link>
            ))}
            <NavDropdown locale={locale} />
            {mainNavLinks.slice(1).map(([label, href]) => (
              <Link key={href} href={withLocale(href, locale)}>
                {label}
              </Link>
            ))}
          </nav>
        ) : (
          <form className="header-search" action={withLocale("/trips", locale)}>
            <span aria-hidden="true">⌕</span>
            <input name="title" placeholder="Find places and things to do" />
          </form>
        )}

        <div className="header-actions">
          <LanguageCurrencyTrigger locale={locale} onClick={openLangModal} />
          <Link className="circle-action" href={withLocale("/cart", locale)} aria-label="Cart">
            <span aria-hidden="true">▱</span>
          </Link>
          <Link className="signin-action" href={withLocale("/auth/sign-in", locale)}>
            Sign in
          </Link>
          <button className="circle-action menu-action" type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span aria-hidden="true">☰</span>
          </button>
        </div>
      </div>

      {isHome && firstStyle ? (
        <div className="promo-strip original-strip">
          <div className="strip-icons" aria-hidden="true">
            <Image src="/images/clover.png" alt="" width={24} height={24} />
            <Image src="/images/easter-egg.png" alt="" width={32} height={32} />
          </div>
          <p>Book any package tour and enjoy a FREE tour experience included at no extra cost!</p>
          <Link className="btn-primary" href={withLocale("/egypt-tours/multi-days-tours/easter-packages", locale)}>
            View Packages
          </Link>
        </div>
      ) : null}

      {!firstStyle ? (
        <div className="header-nav-row">
          <nav className="desktop-nav" aria-label="Main navigation">
            {secondaryNavLinks.slice(0, 1).map(([label, href]) => (
              <Link key={href} href={withLocale(href, locale)}>
                {label}
              </Link>
            ))}
            <NavDropdown locale={locale} />
            {secondaryNavLinks.slice(1).map(([label, href]) => (
              <Link key={href} href={withLocale(href, locale)}>
                {label}
              </Link>
            ))}
            <Link className="special-offer-link" href={withLocale("/trips?main=special-offers", locale)}>
              <span aria-hidden="true">✥</span>
              Special Offer
            </Link>
          </nav>

          <Link className="make-trip-action" href={withLocale("/make-your-trip", locale)}>
            Make Your Trip
          </Link>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="mobile-drawer-backdrop" role="dialog" aria-modal="true" onClick={() => setMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="mobile-drawer-head">
              <Image src="/images/logo.png" alt="Sun Pyramids Tours" width={180} height={64} />
              <button className="circle-action" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                ×
              </button>
            </div>
            <nav className="mobile-links" aria-label="Mobile navigation">
              {[...mainNavLinks, ["Rent Car", "/rent-car"], ...tourLinks, ["Make Your Trip", "/make-your-trip"], ["Special Offer", "/trips?main=special-offers"]].map(
                ([label, href]) => (
                  <Link key={`${label}-${href}`} href={withLocale(href, locale)} onClick={() => setMenuOpen(false)}>
                    {label}
                  </Link>
                ),
              )}
            </nav>
            <div className="mobile-drawer-lang">
              <LanguageCurrencyTrigger
                locale={locale}
                onClick={() => {
                  setMenuOpen(false);
                  openLangModal();
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {langOpen ? <LanguageCurrencyModal locale={locale} pathname={pathname} onClose={closeLangModal} /> : null}
    </header>
  );
}
