# Sprint 11 P0 migration blockers report

Date: 2026-08-24

## Outcome

Sprint 11 closes the scoped P0 route, status, redirect, locale-contract, document-language, campaign-page, sitemap, and directly related SEO blockers. The Sprint 11 acceptance gate is **PASS**. Broader route, dashboard-control, translation, and mutation-flow parity remains outside this sprint, so the overall migration and production cutover remain **PARTIAL/BLOCKED**.

## Before Sprint 11

| Area | Before |
|---|---|
| Detail status semantics | Invalid tour/blog/English-event slugs could render HTTP 200; transient API failures were indistinguishable from absence. |
| Redirects | 0/20 Nuxt contracts existed in Next. |
| Localized customer routes | Auth, cart, checkout, profile, payment, book-trip, thank-you, and underscore make-trip targets were missing. |
| Document language | Every raw document emitted `lang="en"`. |
| Campaign pages | Four live slugs rendered generic “Tours Search Results” content. |
| Sitemap | Single incomplete generator; invalid escaping, missing route families, no `x-default`, and failure could shrink output. |
| SEO alternates | Locales were emitted without route-capability filtering. |

## After Sprint 11

| P0 item | Implementation | Result |
|---|---|---|
| Reliable dynamic details | `ApiResult` distinguishes found, confirmed not-found, invalid response, and upstream error. Tour/blog/event root and locale routes use reliable detail fetches in both metadata and render paths. | PASS |
| Retry rules | Safe GETs use at most 3 attempts, 12-second detail timeout, 20-second sitemap timeout, and bounded exponential backoff. 429/500/502/503/504 plus network/timeout are retried; 404 and non-transient bad requests are not. | PASS |
| Redirect contracts | All exact rules from the Nuxt redirect source are in `next.config.ts` with HTTP 301 semantics. | 20/20 PASS |
| Customer locale contracts | Six prefixed locales now expose all 21 audited customer-flow paths; English remains unprefixed and `/en` is rejected. | 126/126 PASS |
| Server-rendered language | Request-path locale is forwarded through `proxy.ts`; the root layout emits the matching raw `<html lang>`. | 7/7 PASS |
| Campaign mapping | Four confirmed slugs map to the same backend page key and retrieve API content/SEO. Unknown confirmed-invalid slugs return 404. | 4/4 PASS |
| Dynamic sitemap Phase 1 | Custom XML index/children, full Laravel pagination, normalized catalog cache, daily revalidation, dynamic tour chunks, media, reciprocal hreflang, and strict escaping. | PASS |
| SEO alignment | Frontend-domain canonical, `x-default`, no `/en`, no meta keywords, reliable invalid-content metadata, and English-only alternates for plan/tailor routes. | PASS for Sprint 11 scope |

## Reliable status regression

Production-build runtime at `localhost` used safe GET requests only.

| Case | Expected | Actual | Result |
|---|---:|---:|---|
| Valid tour | 200 | 200 | PASS |
| Invalid tour | 404 | 404 | PASS |
| Valid blog | 200 | 200 | PASS |
| Invalid blog | 404 | 404 | PASS |
| Valid event | 200 | 200 | PASS |
| Invalid event | 404 | 404 | PASS |
| Invalid travel-guide category | 404 | 404 | PASS |
| Invalid guide article | 404 | 404 | PASS |
| Invalid parent + valid guide article | 404 | 404 | PASS |

An isolated local mock API returned 429, 500, 502, 503, 504, malformed JSON, confirmed 404, and valid JSON. All five transient statuses produced HTTP 500 after bounded retries; malformed JSON produced HTTP 500 without becoming not-found; confirmed 404 remained 404; valid content remained 200. Mock counters showed each reliable invocation made no more than 3 attempts.

## Locale customer-route regression

The following 21 paths were tested under each of `fr`, `de`, `it`, `pt`, `es`, and `zh`: six auth modes, cart, checkout, profile plus three subviews, five payment callback contracts, book-trip, thank-you, hyphenated make-trip, and underscore make-trip.

| Locale | Passing paths |
|---|---:|
| FR | 21/21 |
| DE | 21/21 |
| IT | 21/21 |
| PT | 21/21 |
| ES | 21/21 |
| ZH | 21/21 |
| Total | **126/126** |

`/en` and `/en/cart` both returned 404. Audited links and client redirects use `withLocale`, which keeps English unprefixed and targets the new locale contracts for supported locales.

## Raw document language

| Route | Raw `lang` | Result |
|---|---|---|
| `/` | `en` | PASS |
| `/fr` | `fr` | PASS |
| `/de` | `de` | PASS |
| `/it` | `it` | PASS |
| `/pt` | `pt` | PASS |
| `/es` | `es` | PASS |
| `/zh` | `zh` | PASS |

## Campaign mapping regression

| Route key | Runtime title/H1 source | Generic substitution | Result |
|---|---|---|---|
| `egypt-sightseeing-tours` | API page: Egypt Sightseeing Tours | No | PASS |
| `egypt-travel-packages` | API page: Egypt Travel Packages | No | PASS |
| `egypt-vacation-packages` | API page: Egypt Vacation Packages | No | PASS |
| `pyramids-tours` | API page: Pyramids Tours | No | PASS |
| unknown campaign slug | Confirmed invalid | N/A; HTTP 404 | PASS |

## Changed implementation areas

- Reliable fetch/data/error resolution: `lib/api.ts`, `lib/data.ts`, `lib/resolve-api-result.ts`, and tour/blog/event/campaign route handlers.
- Locale contracts and language: locale auth/cart/profile/payment/book-trip/thank-you/make-trip handlers, `proxy.ts`, root layout, and customer-flow/link components.
- Redirects: `next.config.ts`.
- Sitemap: custom sitemap route handlers, `lib/sitemap/*`, `public/sitemap.xsl`, and removal of the old `app/sitemap.ts` metadata route.
- SEO: `lib/seo.ts` plus plan/tailor metadata.
- Migration evidence: this report, the Phase 1 sitemap report, redirect report, and the required audit status documents.

## Remaining blockers

No scoped Sprint 11 P0 blocker remains. Production cutover is still blocked by out-of-scope migration work and approvals, including dashboard-driven Trips taxonomy, settings/contact/team authority, rental currency authority, remaining shared UI translation, and uncompleted mutation/payment cutover evidence.

## Recommended Sprint 12 scope

Run a focused P1 dynamic-backend-control sprint:

1. Replace hardcoded Trips categories/destinations with `categories/count`, category, and destination API data keyed by backend identity.
2. Restore `settings` authority for footer/contact/social/location and About team data.
3. Remove the fixed rental `currency_id` and bind submission to the selected API currency.
4. Complete profile session lifecycle parity (`profile/me`, backend logout, approved image/detail flows).
5. Add API-control regression tests for dashboard edits, degraded-state behavior, and locale propagation without redesigning UI or performing production mutations.

## Final status

| Dimension | Status after Sprint 11 |
|---|---|
| ROUTE MIGRATION | **PARTIAL** — Sprint 11 P0 route/status/redirect contracts pass; broader behavioral parity remains. |
| LOCALE PARITY | **PARTIAL** — customer route contracts and raw language pass; full shared-UI translation remains. |
| SEO PARITY | **PARTIAL** — Sprint 11 canonical/hreflang/status/sitemap scope passes; broader SEO parity remains. |
| SITEMAP COVERAGE | **PASS** |
| PRODUCTION CUTOVER | **BLOCKED** |

