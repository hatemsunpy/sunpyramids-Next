# Full route parity matrix

Audit date: 2026-08-24. Production evidence was collected with safe `GET`/`HEAD` requests only. “Exists” means a filesystem route or a matching catch-all exists; it does not imply functional or SEO parity.

## Executive inventory

| Inventory | Count | Interpretation |
|---|---:|---|
| Live production document URLs discovered | 4,551 | 4,473 sitemap URLs plus 78 unique navigation, API-discovered, manual, and legacy-redirect URLs. Assets are excluded. |
| Live sitemap URLs | 4,473 | 517 page, 734 post, and 3,222 tour URLs. |
| Nuxt physical page patterns | 49 | Includes `/`; excludes the 20 exact redirect rules. |
| Nuxt exact 301 redirect rules | 20 | Installed through `routeRules` outside development. |
| Next physical `page.tsx` patterns | 62 | 41 English and 21 locale-prefixed handlers. |
| Next locale-collapsed public page families | 41 | Multiple Nuxt category files are intentionally consolidated into catch-alls. |
| English route-shape matches | 49/49 | Every Nuxt page pattern resolves to an English Next handler or catch-all. |
| Exact redirect matches | 0/20 | `next.config.ts` has no equivalent redirect configuration. |

The full row-level live URL evidence is in [live-route-inventory.md](./live-route-inventory.md). Its 4,011 `PARTIAL` rows are dominated by tour/blog/event detail URLs whose Next loader cannot distinguish a confirmed 404 from an upstream failure and whose invalid slugs render HTTP 200.

## Nuxt-to-Next route families

Legend: locale columns are `Y` when a dedicated localized handler exists, `N` when it does not, and `P` where the handler exists but behavior/content is only partial.

| Nuxt route | Next equivalent | Dynamic source | en | fr | de | it | pt | es | zh | HTTP/404 behavior | Status | Notes |
|---|---|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|---|---|---|
| `/` | `/`, `/[locale]` | `pages/home`, home tours/offers/destinations/blogs/FAQs | P | P | P | P | P | P | P | 200 | PARTIAL | API content localizes, but navigation and substantial home UI remain English; root layout always emits `lang=en`. |
| `/about-us` | same + locale | `pages/about-us`; Nuxt also uses `settings?option_key=company_team` | P | P | P | P | P | P | P | 200 | PARTIAL | Team/settings dashboard data is not consumed by Next. |
| `/accessible-travel` | same + locale | `pages/accessible-travel` | Y | Y | Y | Y | Y | Y | Y | 200/confirmed 404 path | PASS | Page/SEO API-backed. |
| `/auth/confirm-code` | same | `auth/password/otp/verify` | P | N | N | N | N | N | N | 200 shell | PARTIAL | Localized Nuxt URL family is missing. |
| `/auth/create-password` | same | `auth/password/reset` | P | N | N | N | N | N | N | 200 shell | PARTIAL | Localized family missing. |
| `/auth/forget-password` | same | `auth/password/forget` | P | N | N | N | N | N | N | 200 shell | PARTIAL | Localized family missing. |
| `/auth/reset-password` | same | Next calls nonexistent `client/reset-password` | N | N | N | N | N | N | N | Page 200; submit fails | MISSING | Current Laravel `routes/api.php` exposes no such endpoint. |
| `/auth/sign-in` | same | `auth/login` | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Header creates broken localized links. |
| `/auth/sign-up` | same | `auth/register` | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Localized family missing. |
| `/blog/[slug]` | same + locale | `blogs/{slug}?includes=seo` | P | P | P | P | P | P | P | Invalid slug 200 | PARTIAL | Loader collapses 404 and transient errors to `null`; fallback page is a soft 404. |
| `/blogs/all-blogs` | same + locale | `blogs`, `pages/all-blogs` | Y | Y | Y | Y | Y | Y | Y | 200 | PASS | API-driven list and metadata. |
| `/book-egypt-trip` | same | page/form content | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Localized Nuxt family is missing. |
| `/cart` | same | `cart` endpoints, currency | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Localized header cart links are broken. |
| `/cart/checkout` | same | `cart`, `coupons`, `bookings`, payment redirects | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Localized checkout family missing. |
| `/contact-us` | same + locale | `pages/contact-us`, `countries`, `contact-requests`; Nuxt settings | P | P | P | P | P | P | P | 200 | PARTIAL | Contact/social/company data is hardcoded instead of `settings`. |
| `/egypt-tours/[slug]` | `/egypt-tours/[...slug]` + locale | `pages/{key}` or category/destination API | P | P | P | P | P | P | P | Unknown marketing key can render generic 200 | PARTIAL | Four live marketing pages render “Tours Search Results”; current API has no `custom-pages`. |
| `/egypt-tours/multi-days-tours` | catch-all + locale | `categories/{slug}`, tours | Y | Y | Y | Y | Y | Y | Y | Confirmed invalid 404 | PASS | Reliable loader distinguishes confirmed 404. |
| `/egypt-tours/multi-days-tours/[slug]` | catch-all + locale | category/destination/tours | Y | Y | Y | Y | Y | Y | Y | Confirmed invalid 404 | PASS | Consolidated route retains behavior. |
| `/egypt-tours/nile-cruises` | catch-all + locale | category/tours | Y | Y | Y | Y | Y | Y | Y | Confirmed invalid 404 | PASS | API-driven. |
| `/egypt-tours/nile-cruises/[slug]` | catch-all + locale | category/destination/tours | Y | Y | Y | Y | Y | Y | Y | Confirmed invalid 404 | PASS | API-driven. |
| `/egypt-tours/one-day-tours` | catch-all + locale | category/tours | Y | Y | Y | Y | Y | Y | Y | Confirmed invalid 404 | PASS | API-driven. |
| `/egypt-tours/one-day-tours/[slug]` | catch-all + locale | category/destination/tours | Y | Y | Y | Y | Y | Y | Y | Confirmed invalid 404 | PASS | API-driven. |
| `/egypt-tours/plan-your-egypt-journy` | same | `pages/plan-your-egypt-journey` | P | N | N | N | N | N | N | 200/locale catch-all ambiguity | PARTIAL | No dedicated localized handler. Preserve the misspelled legacy URL or 301 it deliberately. |
| `/egypt-tours/shore-excursions` | catch-all + locale | category/tours | Y | Y | Y | Y | Y | Y | Y | Confirmed invalid 404 | PASS | API-driven. |
| `/egypt-tours/tailor-your-egypt-trip` | same | `pages/tailor-your-egypt-trip` | P | N | N | N | N | N | N | 200/locale catch-all ambiguity | PARTIAL | Dedicated localized behavior not proven. |
| `/egypt-travel-guide` | same + locale | `blog-categories`, page SEO | Y | Y | Y | Y | Y | Y | Y | 200 | PASS | API-driven. |
| `/egypt-travel-guide/[cate]` | same + locale | `blog-categories/{slug}`, blogs | Y | Y | Y | Y | Y | Y | Y | Invalid slug 404 | PASS | Reliable 404/transient separation. |
| `/egypt-travel-guide/[cate]/[id]` | same + locale | blog category + blog detail | Y | Y | Y | Y | Y | Y | Y | Invalid category/article 404 | PASS | Reliable 404/transient separation. |
| `/event/[slug]` | same + locale | category/event detail | P | Y | Y | Y | Y | Y | Y | English invalid slug 200; localized 404 | PARTIAL | English loader uses the unreliable helper; locale implementation is safer. |
| `/events` | same + locale | `pages/events`, categories/events | Y | Y | Y | Y | Y | Y | Y | 200 | PASS | API-driven listing. |
| `/faqs` | same + locale | `pages/faqs`, `faqs` | Y | Y | Y | Y | Y | Y | Y | 200 | PASS | API-driven. |
| `/make_your_trip` | same | custom trip endpoints | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Legacy underscore variant is English-only. |
| `/make-your-trip` | same + locale | customized categories, countries, `custom/trips` | P | P | P | P | P | P | P | 200 | PARTIAL | API behavior exists; form labels remain English. |
| `/order/payment/callback/fawaterk/canceled` | same | `payments/fawaterk/update-invoice` | P | N | N | N | N | N | N | 200 shell; guarded without invoice | PARTIAL | Localized family missing; state-changing call is client-only and invoice-gated. |
| `/order/payment/callback/fawaterk/pending` | same | same | P | N | N | N | N | N | N | 200 shell; guarded | PARTIAL | Localized family missing. |
| `/order/payment/callback/fawaterk/success` | same | same | P | N | N | N | N | N | N | 200 shell; guarded | PARTIAL | Localized family missing. |
| `/order/payment/callback/paypal/canceled` | same | `payments/paypal/cancel` | P | N | N | N | N | N | N | 200 shell; guarded | PARTIAL | Localized family missing. |
| `/order/payment/callback/paypal/verify` | same | `payments/paypal/capture` | P | N | N | N | N | N | N | 200 shell; guarded | PARTIAL | Localized family missing. |
| `/privacy-and-cookies` | same + locale | page API/static content | Y | Y | Y | Y | Y | Y | Y | 200 | PASS | Route parity present. |
| `/profile` | same | client cookie only | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Does not refresh from `profile/me`; logout does not call `profile/logout`. |
| `/profile/bookings` | same | `bookings` with bearer token | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Localized family missing. |
| `/profile/favourites` | same | `wishlists` | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Localized family missing. |
| `/profile/settings` | same | `profile` PATCH | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Localized family and `profile/me` refresh missing. |
| `/rent-car` | same + locale | locations, available destinations, rental cart | P | P | P | P | P | P | P | 200 | PARTIAL | Rental payload hardcodes `currency_id: 1`; localized UI text remains English. |
| `/sustainability` | same + locale | page API | Y | Y | Y | Y | Y | Y | Y | 200 | PASS | Route/API parity present. |
| `/terms-and-conditions` | same + locale | page API/static content | Y | Y | Y | Y | Y | Y | Y | 200 | PASS | Route parity present. |
| `/thankful` | same | query/display | P | N | N | N | N | N | N | 200/locale 404 | PARTIAL | Localized form submissions navigate to missing thank-you routes. |
| `/tour/[id]` | `/tour/[slug]` + locale | `tours/{slug}?includes=...` | P | P | P | P | P | P | P | Invalid slug 200 | PARTIAL | 404 and transient failures collapse to a generic 200 page. |
| `/trips` | same + locale | tours plus category/destination filters | P | P | P | P | P | P | P | 200 | PARTIAL | Next hardcodes five category and five destination labels; Nuxt fetches taxonomy/counts dynamically. |

## Redirect parity

All 20 exact 301 rules in `nuxt_sunpyramids/redirect-rules.js` are **MISSING** in Next. They cover seven locale variants of `2-day-cairo-adventure-tours`, seven Khan El Khalili variants, two malformed Aswan URLs, two Citadel URLs, and two additional encoded blog variants. Their targets are recorded row-by-row in [live-route-inventory.md](./live-route-inventory.md). Business and SEO impact: historic backlinks and indexed aliases lose link equity or resolve through the wrong dynamic page. Required fix: port the exact decoded/encoded matches to Next redirects, then test status and `Location` for all 20.

## Exceptions and cutover decisions

| Code | Reason | Business impact | SEO impact | Recommended fix | Cutover blocker |
|---|---|---|---|---|:--:|
| R1 | Invalid tour/blog/English-event slugs return 200. | Users see an empty/generic page. | Soft-404 indexing and crawl waste across 4,011 inventoried detail URLs. | Migrate all detail loaders to the reliable discriminated result and call `notFound()` only on confirmed 404; throw on transient errors. | Yes |
| R2 | 20 legacy redirects absent. | Historic/bookmarked URLs break. | Link equity and canonical consolidation regress. | Add exact permanent redirects and automated status/location tests. | Yes |
| R3 | Localized auth/cart/profile/payment/thank-you routes absent. | Localized users hit 404 during conversion/account flows. | Broken internal links and hreflang-equivalent gaps. | Add locale route wrappers or intentionally route all customer flows to English without emitting nonexistent alternates. | Yes |
| R4 | Four live marketing routes use the generic search page. | Campaign visitors receive the wrong content. | Page intent, metadata, and internal-link relevance are lost. | Map each slug to `GET /api/pages/{key}?includes=seo` (or add a supported backend custom-page endpoint). | Yes |
| R5 | Trips taxonomy is hardcoded. | Dashboard taxonomy changes do not reach filtering UI. | Stale landing/filter paths and mismatched labels. | Restore category/count/destination API queries and key filters by IDs/slugs. | Yes |

Overall route migration: **PARTIAL**. Production cutover: **BLOCKED**.

## Sprint 11 P0 route override — 2026-08-24

The matrix above is retained as **Before Sprint 11** evidence. These rows supersede its P0 findings for the current implementation.

| Contract | After Sprint 11 | Runtime evidence |
|---|---|---|
| `/tour/[slug]` + locale | PASS | Valid 200; confirmed invalid 404; mock transient/malformed responses 500, never fake 404/200. |
| `/blog/[slug]` + locale | PASS | Valid 200; confirmed invalid 404; metadata uses the same result distinction. |
| `/event/[slug]` + locale | PASS | Valid 200; confirmed invalid 404, including English. |
| 20 Nuxt redirects | PASS | 20/20 HTTP 301 and exact `Location`; see [redirect report](./sprint11-redirect-parity-report.md). |
| Localized customer-flow contracts | PASS | 21 paths × 6 prefixed locales = 126/126 HTTP 200; `/en` and `/en/cart` are 404. |
| Four campaign routes | PASS | API page title/H1/SEO; no generic “Tours Search Results”; unknown confirmed invalid route 404. |
| `/thankful` + locale | PASS | Root and six prefixed handlers exist and were exercised with GET only. |

**After Sprint 11:** all scoped P0 route blockers are closed. Overall route migration remains **PARTIAL** because P1 behavior/data-authority items such as Trips filtering and settings-driven content are not made complete by route existence.

**Remaining blocker scope:** dashboard-control parity, full localized UI copy, and approved mutation-flow cutover evidence.
