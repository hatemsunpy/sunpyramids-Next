import Image from "next/image";
import Link from "next/link";
import type { Locale, PublicSiteSettings } from "@/types/api";
import { withLocale } from "@/lib/locales";
import { TrustIndexLoader } from "@/components/TrustIndexLoader";
import { uiCopy } from "@/lib/ui-copy";
import { APPROVED_BRAND_LOGO, siteContact } from "@/lib/site-contact";

const links = [
  ["home", "/"], ["oneDay", "/egypt-tours/one-day-tours"], ["multiDays", "/egypt-tours/multi-days-tours"],
  ["nileCruises", "/egypt-tours/nile-cruises"], ["shoreExcursions", "/egypt-tours/shore-excursions"],
  ["specialOffer", "/trips?main=special-offers"], ["rentCar", "/rent-car"], ["about", "/about-us"],
  ["contact", "/contact-us"], ["guide", "/egypt-travel-guide"], ["faqs", "/faqs"],
  ["events", "/events"], ["accessible", "/accessible-travel"],
] as const;

const footerSocialTypes = new Set(["youtube", "google-plus", "facebook", "instagram"]);

export function Footer({ locale = "en", settings }: { locale?: Locale; settings: PublicSiteSettings }) {
  const copy = uiCopy(locale);
  const dynamicEmails = settings.notificationEmails.length ? settings.notificationEmails : siteContact.safeFallbackEmails;
  const emails = [...new Set([...dynamicEmails, ...siteContact.staticEmails])];
  const logo = APPROVED_BRAND_LOGO;
  const title = settings.siteTitle || "Sun Pyramids Tours";
  const socialLinks = settings.socialLinks.filter((social) => footerSocialTypes.has(social.type));
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Image src={logo} alt={title} width={260} height={73} />
          <h2>Need Our Help ?</h2>
          <p>We Would Happy To Help You ...</p>
          {socialLinks.length ? (
            <div className="footer-social-links" aria-label="Social links">
              {socialLinks.map((item) => (
                <a key={`${item.type}-${item.url}`} href={item.url} target="_blank" rel="noreferrer">{item.type}</a>
              ))}
            </div>
          ) : null}
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
          <p className="footer-title">{copy.links}</p>
          <nav className="footer-links" aria-label="Footer navigation">
            {links.map(([key, href]) => (
              <Link key={href} href={withLocale(href, locale)}>
                {copy[key]}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="footer-title">{copy.contactInfo}</p>
          <div className="footer-links">
            {siteContact.phones.map((phone) => <a key={phone.href} href={phone.href}>{phone.display}</a>)}
            <a href={siteContact.whatsapp.contactUrl} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${siteContact.whatsapp.display}`}>
              {siteContact.whatsapp.display}
            </a>
            {emails.map((email) => <a key={email} href={`mailto:${email}`}>{email}</a>)}
            {settings.locationUrl ? (
              <a href={settings.locationUrl} target="_blank" rel="noreferrer">{siteContact.address}</a>
            ) : <p>{siteContact.address}</p>}
            <div id="footer-cert" />
            <TrustIndexLoader containerId="footer-cert" script="https://cdn.trustindex.io/loader-cert.js?c80e286451c98153d1567b8885a" />
          </div>
        </div>
      </div>
      <hr style={{ borderColor: "#444", margin: "3rem 0 2rem" }} />
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <p>All rights reserved to {title}, Egypt ©{new Date().getFullYear()}</p>
        <div style={{ display: "flex", gap: "2rem" }}>
          <Link href={withLocale("/privacy-and-cookies", locale)}>Privacy and Cookies</Link>
          <Link href={withLocale("/terms-and-conditions", locale)}>Terms and Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
