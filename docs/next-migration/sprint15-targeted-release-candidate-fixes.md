# Sprint 15 — Targeted frontend release-candidate fixes

Date: 2026-08-25

Scope: the one P0 and five P1 frontend findings confirmed by the Sprint 14 read-only audit. Sprint 14 remains immutable historical evidence. Laravel, database/schema/API contracts, sitemap architecture, and production data were not changed. No dependency was installed and no commit was created.

## Result

All six targeted frontend findings are closed. The frontend release candidate is **PASS**. Production cutover remains **BLOCKED** by the external/backend gates listed below.

| Finding | Before Sprint 15 | Fix | Verification |
|---|---|---|---|
| P0 customer-editable backend IDs | Cart exposed comma-separated option IDs; checkout exposed coupon ID and Card payment-method ID. | Cart fetches the tour's existing API option objects and renders named/price-bearing checkboxes. Coupon code is validated and its returned ID is kept internally. Card/PayPal are meaningful choices; Nuxt's confirmed Card gateway value is internal only. | Source/rendered-control search found zero visible ID controls. Empty cart and all seven checkout locale forms contain no option/coupon/payment/database/backend-ID prompt. |
| P1 inquiry mobile overflow | At a 375px viewport, the document expanded to about 584px. | Collapsed grid uses `minmax(0, 1fr)` and grid/flex/gallery children have explicit intrinsic-width containment. | Inquiry tour document/client widths: 370/370 at 375, 426/426 at 430, 763/763 at 768, 1019/1019 at 1024, and 1435/1435 at 1440. Gallery thumbnails remain internally scrollable. |
| P1 `/book-egypt-trip` parity | Generic title and three generic cards replaced the dedicated Nuxt/live identity. | Restored localized hero, WhatsApp/planning CTAs, three Why cards, Nuxt category-54 API-selected tours, contact/custom-itinerary CTA, TrustIndex container, and gallery. | Live, Nuxt source, and Next all expose the same major section identity. Root plus `fr/de/it/pt/es/zh` render localized copy, four API tour cards, five gallery items, correct CTA targets, and correct `html lang`. |
| P1 title/description metadata | Layout branding could append a second brand; rich event HTML could enter description fallback. | Centralized absolute branded title and recursive entity/plain-text metadata normalization. Explicit backend descriptions remain preferred. | Representative home/about/contact/tour/blog/event/listing/localized raw HTML has zero duplicated brand suffixes and zero description tags. Parsed event description has no encoded `mdash`/`ndash`/`bull` markup entities. |
| P1 listing JSON-LD | Egypt Tours listing routes did not render backend `structure_schema`. | Root and localized catch-all listings pass backend schema through the existing safe `JsonLd` parser/renderer. | `/egypt-tours/one-day-tours` emits two backend-supplied JSON-LD scripts. Null/invalid input remains fail-closed through `validateAndParseSchema`; build and routes do not crash. |
| P1 customer-flow copy | Cart/checkout retained audited English headings, labels, placeholders, loading text, and controls. | Routed the touched visible copy through `uiCopy`, using confirmed Nuxt dictionaries for all seven supported locales. | Fourteen cart/checkout locale forms pass headings, placeholders, payment labels, `html lang`, width, and prohibited-ID checks. `/en` remains 404. |

## Customer-flow contract

- Tour options: meaningful API option name and adult/child price → checkbox selection → internal API option ID → `cart/tours/append` `options[]`.
- Coupon: customer-entered code → authenticated `coupons/{code}/validate` GET → authoritative response ID in internal state/cookie → booking `coupon_id`. Invalid or changed codes clear stale validated state.
- Payment: customer chooses Debit/Credit Card or PayPal. The request sends `payment_method`; the Nuxt-confirmed Card gateway method value `9` is assigned internally and is not present in an editable control.
- No production cart, coupon, booking, payment, contact, auth, or profile mutation was performed. A populated-cart option edit cannot be exercised safely until staging/test cart data is provided; its API/Nuxt/source contract and meaningful option rendering were verified without mutation.

## Read-only regression evidence

| Gate | Result |
|---|---|
| Invalid detail semantics | PASS — invalid tour, blog, event, travel-guide parent, and travel-guide article all return 404. |
| Redirects | PASS — 20/20 return HTTP 301 with the exact configured `Location`. |
| Locale roots | PASS — `/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh` return 200 with the correct raw `html lang`; `/en` returns 404. |
| Homepage/shared shell | PASS — dynamic cards and all required sections render, 16 tour cards and four blog cards are present, contact phones remain exact, no browser warning/error was recorded, and no horizontal overflow was found. |
| Dynamic ownership | PASS for frontend read paths — Book selected tours remain API-driven; cart options are fetched from the tour API; schema remains backend-owned; no tour record or schema was copied into frontend source. |
| Sitemap index | PASS — HTTP 200 with six child sitemaps. |
| Sitemap coverage | PASS — 4,972 URLs, 4,972 `x-default`, zero duplicates, zero `/en`, zero wrong-origin URLs, strict XML. |
| Sitemap supporting files | PASS — robots references the public sitemap; XSL returns 200. |
| Sitemap revalidation | PASS — remains 86,400 seconds; Sprint 15 did not redesign or edit Phase 1 sitemap implementation. |
| SEO raw HTML | PASS — representative home/about/contact/tour/blog/event/listing/localized pages have correct frontend canonicals, matching `og:url`, `x-default`, correct language, no Meta Keywords, no duplicate brand, and plain descriptions. |
| Egypt Tours JSON-LD | PASS — backend listing schema emitted; routes without schema omit it. |
| Logo P2 | FIXED — approved image retained; intrinsic dimensions now preserve the approximately 3.546 ratio in desktop header, drawer, and footer. Runtime header is 190×54 and footer is 260×73. |
| Laravel writes | PASS — no backend action was executed; no backend source file has a Sprint 15 write timestamp. |
| `npm run lint` | PASS — no diagnostics. |
| `npm run build` | PASS — Next 16.2.9 compiled, type-checked, generated 40 static pages, and emitted the expected route manifest. |
| `git diff --check` | PASS — no whitespace errors; line-ending notices are informational. |

The `next-dev-loop` skill was not used because the repository declares Next 16.2.9 while that skill requires 16.3 or newer. The user prohibited installs/upgrades. Equivalent production-build, raw HTTP, and in-app browser checks were completed against `next start`.

## Release status after Sprint 15

| Dimension | Status |
|---|---|
| ROUTE PARITY | **PASS** |
| HOMEPAGE PARITY | **PASS** |
| STATIC CONTENT PARITY | **PASS** |
| DYNAMIC API PARITY | **PASS for frontend read/source ownership** |
| DASHBOARD CONTROL PARITY | **PARTIAL — frontend consumption passes; approved staging propagation proof is external** |
| LOCALE PARITY | **PASS for the supported seven-locale frontend contract** |
| SEO PARITY | **PASS for the audited frontend scope** |
| SITEMAP COVERAGE | **PASS** |
| RESPONSIVE/UI PARITY | **PASS** |
| CUSTOMER FLOW SOURCE PARITY | **PASS; protected mutation outcomes remain staging-gated** |
| FRONTEND RELEASE CANDIDATE | **PASS** |
| PRODUCTION CUTOVER | **BLOCKED** |

Remaining confirmed frontend P0 findings: **0**. Remaining confirmed frontend P1 findings from the Sprint 14 six-item audit: **0**.

## Exact remaining external/backend cutover gates

1. Approved staging frontend/API/dashboard targets, credentials, reversible test identities, and seeded cart/coupon/rental data for protected mutation and dashboard-propagation evidence.
2. PayPal and Fawaterk sandbox credentials/invoices plus signed-off success, pending/cancel, redirect, and retry outcomes.
3. Marketing preview/debug access and owner sign-off for GTM/GA4/conversion delivery.
4. Backend remediation or explicit risk acceptance for public settings exposure and any exposed credential rotation.
5. Backend remediation or explicit risk acceptance for booking-detail ownership/access, backend reCAPTCHA verification, guest-cart IP identity, state-changing payment GET design, PayPal null handling, exception/trace exposure, special-offers count omission, and anonymous profile 200-shell behavior.
6. Final business/QA approval after the staging/payment/marketing/backend evidence above. Production DNS/cutover must not proceed before those gates are closed or formally accepted.
