import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/types/api";
import { withLocale } from "@/lib/locales";
import { TrustIndexLoader } from "@/components/TrustIndexLoader";

const links = [
  ["Home", "/"],
  ["One Day Tours", "/egypt-tours/one-day-tours"],
  ["Multi Days Tours", "/egypt-tours/multi-days-tours"],
  ["Nile Cruises", "/egypt-tours/nile-cruises"],
  ["Shore Excursions", "/egypt-tours/shore-excursions"],
  ["Special Offers", "/trips?main=special-offers"],
  ["Rent Car", "/rent-car"],
  ["About", "/about-us"],
  ["Contact", "/contact-us"],
  ["Egypt Travel Guide", "/egypt-travel-guide"],
  ["FAQs", "/faqs"],
  ["Events", "/events"],
  ["Accessible Travel", "/accessible-travel"],
];

export function Footer({ locale = "en" }: { locale?: Locale }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Image src="/images/logo.png" alt="Sun Pyramids Tours" width={260} height={90} />
          <h2>Need Our Help ?</h2>
          <p>We Would Happy To Help You ...</p>
          <Link href={withLocale("/sustainability", locale)}>
            <Image
              src="/images/certified_footer_white.png"
              alt="Certified sustainable travel"
              width={292}
              height={120}
              style={{ marginTop: "1.5rem" }}
            />
          </Link>
        </div>
        <div>
          <p className="footer-title">Sun Pyramids Links</p>
          <nav className="footer-links" aria-label="Footer navigation">
            {links.map(([label, href]) => (
              <Link key={href} href={withLocale(href, locale)}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="footer-title">Contact Info</p>
          <div className="footer-links">
            <a href="tel:+201095888830">+20 109 588 8830</a>
            <a href="tel:+201095888831">+20 109 588 8831</a>
            <a href="tel:+201095888835">+20 109 588 8835</a>
            <a href="mailto:info@sunpyramidstours.com">info@sunpyramidstours.com</a>
            <a href="mailto:sustainability@sunpyramidstours.com">sustainability@sunpyramidstours.com</a>
            <p>Pyramids View Tower - Mansourieh Intersection with Faisal - Above Tseppas Pastry - Fourth Floor</p>
            <div id="footer-cert" />
            <TrustIndexLoader containerId="footer-cert" script="https://cdn.trustindex.io/loader-cert.js?c80e286451c98153d1567b8885a" />
          </div>
        </div>
      </div>
      <hr style={{ borderColor: "#444", margin: "3rem 0 2rem" }} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <p>All rights reserved to sunpyramids company, Egypt ©2024</p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <Link href={withLocale("/privacy-and-cookies", locale)}>Privacy and Cookies</Link>
          <Link href={withLocale("/terms-and-conditions", locale)}>Terms and Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
