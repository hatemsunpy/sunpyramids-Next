# Sprint 13 live static parity report

Date: 2026-08-24. Live was inspected read-only; production API evidence used safe `GET`/`HEAD` only.

## Final ownership and parity

| Field/surface | Final ownership | Evidence | Result |
|---|---|---|---|
| Phone | `DEPLOYMENT_CONFIG` | Live + Nuxt static footer/contact values; no proven contact setting | PASS: `+20 109 588 8830`, `8831`, `8835` centralized in `lib/site-contact.ts`. |
| Physical address | `DEPLOYMENT_CONFIG` | Live current copy + Nuxt static implementation | PASS: exact Mansourieh/Faisal/Tseppas/Fourth Floor text centralized. |
| WhatsApp | `DEPLOYMENT_CONFIG` | Nuxt footer and tour inquiry use digits `201095888830`; Live displays `+20 109 588 8830` | PASS: display and normalized destination centralized; inquiry text remains the existing Nuxt contract. |
| Notification emails | `API_DASHBOARD_CONTROLLED` | Nuxt iterates `notification_emails` | PASS: filtered setting; live/Nuxt-static sustainability mailbox appended as intentional static content. |
| Social links | `API_DASHBOARD_CONTROLLED` | Nuxt consumes `social_links` | PASS: filtered setting feeds footer, gallery, and contact page. |
| Location link | `API_DASHBOARD_CONTROLLED` | Nuxt consumes `company_location_url` | PASS: filtered setting; physical label remains deployment-owned. |
| Logo | `INTENTIONAL_STATIC_CONTENT` | Header/footer Nuxt use `/images/logo.png`; Live raw asset is byte-identical to local | PASS: local asset, no hotlink and no stale backend-logo fallback. |
| Site title | `API_DASHBOARD_CONTROLLED` | Nuxt/setting contract | PASS: filtered `site_title` with safe display fallback. |

The approved local and Live raw logo both contain 73,687 bytes and have SHA-256 `F15C42CEB58B242F7F0234BCD57985C0341BEE9D25983175DA819CC10648189E`. The backend `logo` setting currently points at a visibly different asset; Nuxt proves that setting is not the owner of header/footer branding, so Next no longer requests it.

## Surface checks

- Header, compact/scrolled header, internal header, mobile drawer, and footer all use `APPROVED_BRAND_LOGO = "/images/logo.png"`, preserve aspect ratio through `next/image`, link internally to the locale-aware homepage, and expose meaningful home/brand alt text.
- Header keeps the current Live top-level structure and fixed route labels; Egypt Tours subfamilies, Rent Car, Special Offer, and Make Your Trip remain available in the full navigation/drawer.
- Footer renders the three phones, the confirmed WhatsApp display, API notification emails, static sustainability mailbox, exact physical address, filtered social links, certification, and TrustIndex.
- Contact page renders the same contact values, filtered email/social/location values, and the existing `POST contact-requests` form contract.
- The current Live Christmas promotion replaced the older local Nuxt Easter snapshot only for approved static campaign copy. Tour records remain API-driven.
- The homepage rendered all major Live sections in the same order with no placeholders or duplicate major sections.

## Locale result

Root English plus `/fr`, `/de`, `/it`, `/pt`, `/es`, and `/zh` rendered HTTP 200 with matching raw document languages. `/en` remained HTTP 404. Header/footer/mobile/home, contact, cart/checkout, profile, and payment labels now use confirmed Nuxt dictionaries where keys exist. Locale parity remains **PARTIAL**, because some page-specific marketing/status/error sentences still fall back to English where Nuxt has no confirmed key.

## Safe runtime evidence

- Local production homepage and contact: HTTP 200.
- Contact response contained all three phones, exact address, sustainability mailbox, and `/images/logo.png`.
- Homepage browser DOM contained all audited headings, two approved-logo instances, live/API records, and no console errors with third parties disabled diagnostically.
- No Live form, auth, cart, booking, payment, or dashboard mutation was performed.
