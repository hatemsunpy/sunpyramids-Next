# Full migration completeness report

Audit date: 2026-08-24

## Cutover decision

| Dimension | Status | Decisive evidence |
|---|---|---|
| ROUTE MIGRATION | **PARTIAL** | Sprint 11 closed reliable details, redirects, localized customer contracts, and marketing mappings; the migration is not declared complete from filesystem presence alone. |
| DYNAMIC API MIGRATION | **PARTIAL** | Sprint 12 closed confirmed taxonomy/settings/team/rental-currency/profile gaps; broader content/UI and staging mutation proof remain. |
| DASHBOARD CONTROL | **PARTIAL** | Source and read-only runtime chains pass for current P1 surfaces; staging edit/observe/revert proof is unavailable. |
| LOCALE PARITY | **PARTIAL** | Localized route/lang contracts pass and targeted shared UI uses Nuxt dictionaries; broader page-specific copy still uses per-key fallback. |
| SEO PARITY | **PARTIAL** | Dynamic metadata/canonical/OG/Twitter/JSON-LD and frontend origin work; language declaration, capability-aware alternates, viewport, soft-404s, and sitemap integration do not. Meta keywords are correctly not rendered. |
| SITEMAP COVERAGE | **PASS** | Split API-driven sitemap: 4,972 URLs, strict XML, no duplicates, locale alternates/`x-default`, 86,400-second atomic cache. |
| PRODUCTION CUTOVER | **BLOCKED** | Staging dashboard propagation, protected mutation/payment approvals, settings API security, and owner decisions remain. |

## Counts

| Measure | Count / percentage | Notes |
|---|---:|---|
| Live document URLs discovered | **4,551** | 4,473 sitemap URLs plus 78 unique non-sitemap route discoveries; assets excluded. |
| Nuxt page route families | **49** | Physical pages, locale capability inherited from Nuxt i18n. |
| Nuxt exact redirect contracts | **20** | Counted separately; total public route contracts = 69. |
| Next physical page handlers | **62** | 41 English + 21 localized handlers. |
| Next locale-collapsed page families | **41** | Catch-alls consolidate several Nuxt page files. |
| Matched functional page families | **48/49 (98.0%)** | Includes 31 partial; excludes dead `/auth/reset-password` contract. At filesystem-shape level, Next accepts 49/49 English patterns. |
| Fully passing page families | **17/49 (34.7%)** | Per the route matrix. |
| Partial page families | **31/49 (63.3%)** | Per the route matrix. |
| Missing page families | **1/49 (2.0%)** | Reset-password page exists but posts to a nonexistent backend route. |
| Missing redirects | **20/20** | No Next redirect parity. |
| Exact discovered live/Nuxt URLs classified missing | **44** | 24 localized auth/cart/profile/thank-you paths plus 20 legacy redirect contracts. |
| Exact discovered live URLs classified partial | **4,011** | Mostly tour/blog/event detail URLs exposed to soft-200/error-collapsing behavior. |
| Next page families without a live/Nuxt equivalent | **0** | `robots`/`sitemap` are infrastructure endpoints; catch-alls are internal consolidation, not new public families. |

## Answers to the 20 cutover questions

1. **Route-family existence:** 49/49 English route shapes exist, but only 48/49 are functionally matched; 17 pass, 31 are partial, one is missing.
2. **Missing families:** functional reset-password, the legacy redirect behavior family, and localized auth/cart/checkout/profile/payment/book-trip/thank-you families.
3. **Missing live URLs:** 44 exact audited contracts. The row-level URLs and observed production statuses are in `live-route-inventory.md`.
4. **Next-only routes:** no unapproved public page family. Framework sitemap/robots and the consolidated catch-all are expected implementation differences. A 618-entry sitemap snapshot did contain 121 URLs not in the live English baseline, but those are entity/static URL-set differences, not new route families.
5. **Fully API-driven areas:** core page records, featured/home tour lists, destinations, blogs, FAQs, tour/category/destination content, travel-guide content, events list, currencies primary path, cart tour CRUD, booking creation, and payment callback contracts.
6. **Partially API-driven areas:** home/shell translation, currency fallback, tour/blog/English-event failure handling, Trips filtering, authentication/session lifecycle, rentals, SEO completeness, and sitemap generation.
7. **Incorrectly hardcoded dynamic content:** confirmed Sprint 12 substitutions are removed. Phone/address/WhatsApp remain explicitly deployment-controlled because no equivalent setting exists.
8. **Nuxt endpoint parity:** categories/count/settings/rental route/profile refresh-image-logout/social callback are now consumed. Booking detail, review submission, blog search, and direct rental inventory/checkout were not active current Nuxt UI contracts.
9. **Absent endpoints:** the stale `client/reset-password` and `custom-pages/{slug}` calls remain removed; supported routes are used instead.
10. **Backend-only routes:** booking detail, blog search, rental inventory/detail, and convenience record endpoints remain classified `BACKEND_ONLY`, not falsely “implemented.”
11. **Proven dashboard fields:** page/tour/blog/category/destination localized content and SEO; tour prices, offers, seasons, options, categories, destinations and media; page assets; blog state/media/relationships; FAQ records; currencies/rates. SEO title, description, canonical, robots, OG/Twitter and valid schema reach Next. Meta keywords are intentionally suppressed.
12. **Still requires staging validation:** every mutation flow (contact/custom trip/rental/auth/profile/wishlist/cart/coupon/checkout/payment), authenticated/guest identity transitions, actual dashboard-edit propagation, API failure injection, and payment sandbox callbacks.
13. **Incomplete locale routes:** auth, cart/checkout, profile subroutes, payment callbacks, book-trip, underscore make-trip, and thank-you. All localized UI and document `lang` are also incomplete.
14. **Incomplete SEO:** wrong document language, alternates asserted for nonexistent routes, viewport not mapped, soft-200 invalid details, marketing metadata substitution, and invalid/incomplete sitemap. Public canonical/OG page origin is correct.
15. **Incomplete sitemap:** all event detail and travel-guide article URLs, many tours/blogs/nested Egypt-tour routes, `x-default`, route-capability filtering, stable pagination, and XML escaping.
16. **False-404 risk:** yes. Unreliable helpers collapse transient API failure and 404. Some current detail pages avoid false 404 only by rendering 200 for both; reliable routes correctly throw on transient results.
17. **Invalid-route duplicate-content risk:** yes. Invalid tour, blog, and English event slugs return HTTP 200; marketing slugs can render the same generic search page.
18. **Technically route-complete:** no. English filesystem shapes alone are insufficient because redirects, functional reset, localized customer paths, and status semantics are incomplete.
19. **Dynamically API-complete:** no. Settings, taxonomy, marketing-page mapping, rentals, and session lifecycle have proven gaps.
20. **Production cutover:** blocked.

## Representative runtime verification

| Group | Routes tested | Result |
|---|---|---|
| Core pages | `/`, `/about-us`, `/contact-us`, `/privacy-and-cookies`, `/terms-and-conditions`, `/sustainability`, `/faqs` | Valid routes resolved. Intermittent API latency caused isolated long requests; persistent route absence was not inferred from timeouts. |
| Content lists/details | `/blogs/all-blogs`, valid blog, `/events`, valid event, one-day category, nested category/destination, valid tour | Valid routes resolved with API content. |
| Travel guide | index, category, article | Valid routes 200; invalid category/article/invalid-parent combinations 404. |
| Conversion/account shells | make-trip, rent-car, cart, checkout, sign-in/up, profile and three subpages | English routes resolved; production mutations were not triggered. |
| Payment callbacks | PayPal/Fawaterk routes without invoice ID | 200 shell only; source guard prevented mutation. |
| Locales | six locale homes and representative localized tour/blog/guide/event | Content routes resolved; shared UI and `html lang` failed parity. |
| Invalid routes | tour, blog, event, guide category/article, invalid parent + valid article, destination | Tour/blog/English event incorrectly 200; reliable guide/destination and localized event routes 404. |
| Marketing | four live API-discovered campaign paths | 200 but wrong generic “Tours Search Results” content. |

## Exact next fixes

| Priority | Files / routes | Change and acceptance criterion |
|---:|---|---|
| P0 | `lib/data.ts`; English and localized `/tour/[slug]`, `/blog/[slug]`; English `/event/[slug]` | Use discriminated reliable fetch results. Confirmed invalid = 404; injected timeout/429/5xx = error/5xx, never 404 or generic 200. |
| P0 | `next.config.ts`; `nuxt_sunpyramids/redirect-rules.js` | Port all 20 exact permanent redirects; test status and `Location`. |
| P0 | locale route tree, `Header.tsx`, `Footer.tsx`, `BottomBar.tsx`, form redirects | Provide real localized customer routes or stop generating those localized targets. Seven-locale route-contract suite passes. |
| P0 | `app/layout.tsx` and locale architecture | Server-render the correct `<html lang>` for all seven locale forms. |
| P0 | `app/egypt-tours/[...slug]/page.tsx` and locale twin | Map four marketing slugs to existing `pages/{key}?includes=seo`; never substitute `tours-search-results`. |
| P0 | `app/sitemap.ts` | Escape XML, make API enumeration stable/fail-closed, include events and guide articles, filter alternates by capability, add `x-default`; strict XML and baseline diff pass. |
| DONE P1 | Trips listing/loaders | Categories/count/destinations and backend identifiers are live. |
| DONE P1 | Footer/contact/about/shell | Filtered public settings and `company_team` are live. |
| DONE P1 | Customer flows | Selected rental currency, route lookup, supported reset, `profile/me`, logout, image, and social callback are wired. |
| PARTIAL P1 | shared UI | Targeted header/footer/auth/profile/planner dictionaries migrated; full site-wide static copy remains broader follow-up. |
| P1 | `lib/seo.ts` and metadata call sites | Emit only capability-valid alternates, retain frontend canonical origin, map approved viewport handling, and keep meta keywords suppressed. |

## Evidence files

- [Live route inventory](./live-route-inventory.md)
- [Full route parity matrix](./full-route-parity-matrix.md)
- [Dynamic API control matrix](./full-dynamic-api-control-matrix.md)
- [Hardcoded production content audit](./hardcoded-production-content-audit.md)
- [Locale route/API parity](./locale-route-api-parity.md)
- [API endpoint parity matrix](./full-api-endpoint-parity-matrix.md)
- [Dashboard control proof](./dashboard-control-proof.md)
- [Sitemap route coverage](./sitemap-route-coverage-matrix.md)

## Validation

| Check | Result | Evidence |
|---|---|---|
| `npm run lint` | **PASS** | ESLint exited successfully with no diagnostics. |
| `npm run build` | **PASS** | Next 16.2.9 compiled, type-checked, generated 40 static pages, and printed the expected route manifest. |
| `git diff --check` | **PASS** | No whitespace errors. |

The `next-dev-loop` skill could not be used because it requires Next 16.3 or newer and this repository is on 16.2.9. No dependency upgrade or installation was authorized; equivalent local runtime checks were performed with the existing development server and safe requests.

## Sprint 11 P0 update — 2026-08-24

This section preserves the audit above as the **Before Sprint 11** baseline. The following is the **After Sprint 11** result.

| Dimension | After Sprint 11 | Evidence |
|---|---|---|
| ROUTE MIGRATION | **PARTIAL** | P0 detail status, 20 redirects, localized customer contracts, and four campaign mappings pass. P1 behavioral/data-authority gaps remain, so route migration is not declared complete from filesystem presence. |
| DYNAMIC API MIGRATION | **PARTIAL** | Campaign pages and reliable details are now API-correct; Trips taxonomy, settings/team/contact, rental currency, and profile lifecycle remain. |
| DASHBOARD CONTROL | **PARTIAL** | Page/campaign/sitemap entities remain dashboard/API controlled; the existing P1 bypasses remain. |
| LOCALE PARITY | **PARTIAL** | 126/126 customer locale paths and all seven raw document languages pass. Shared UI translation remains a P1 gap. |
| SEO PARITY | **PARTIAL** | P0 canonicals, capability-aware alternates, `x-default`, status semantics, no `/en`, meta-keyword suppression, and sitemap integration pass; broader SEO parity remains. |
| SITEMAP COVERAGE | **PASS** | 4,972 current API-driven localized document URLs; strict XML; complete pagination; events/guide/taxonomy/tours/blogs/pages; zero duplicates; daily atomic cache. |
| PRODUCTION CUTOVER | **BLOCKED** | No Sprint 11 P0 blocker remains, but out-of-scope data-authority, translation, mutation/payment, and approval gates remain open. |

Closed Sprint 11 P0 evidence:

- Valid/invalid tour, blog, and event status tests: 3 valid 200 and 3 invalid 404.
- Mock 429/500/502/503/504: all surfaced as HTTP 500 after bounded retries; malformed JSON also surfaced as 500.
- Redirects: 20/20 exact status and `Location` matches.
- Locale customer contracts: 126/126 across `fr/de/it/pt/es/zh`; `/en` remains 404.
- Raw `<html lang>`: 7/7.
- Campaign pages: 4/4 API titles/H1s, no generic substitute; invalid slug 404.
- Dynamic Sitemap Phase 1: PASS; see [Sprint 11 sitemap report](./sprint11-dynamic-sitemap-phase1-report.md).

## Sprint 12 P1 update — 2026-08-24

Sprint 12 closes the previously listed taxonomy, settings/contact/social/team, rental currency/route, profile lifecycle, reset, and social-callback gaps. Lint/build and read-only runtime pass. The 61 current Laravel routes classify as 45 MATCHED, 2 BLOCKED, and 14 BACKEND_ONLY; two absent historical contracts are separately DEPRECATED.

**Remaining blockers:** approved staging dashboard propagation proof; backend restriction/credential rotation for the unfiltered public settings endpoint; owner decision for phone/address/WhatsApp control; protected mutation/payment/tracking approvals; inherited guest-cart IP identity acceptance. See the three Sprint 12 reports.

## Sprint 13 frontend-only update — 2026-08-24

The final frontend scope passes: 20/20 homepage sections have proven ownership (12 API-driven/mixed, 8 intentional static, 0 unknown); current Live contact/logo parity passes; filtered settings remain narrow; invalid tour/blog/event routes are 404; redirects remain 20/20; and the split sitemap remains 4,972 URLs with daily revalidation, complete `x-default`, zero `/en`, and zero duplicates. The full profile payload is no longer persisted in a frontend cookie, and callback requests are invoice-gated/client-only with same-load in-flight deduplication.

Final status: **route PARTIAL; dynamic API PARTIAL; dashboard PARTIAL; locale PARTIAL; SEO PARTIAL; sitemap PASS; frontend cutover readiness PASS WITH EXTERNAL GATES; production cutover BLOCKED**. Exact evidence and blockers are in `sprint13-frontend-cutover-report.md`.

## Sprint 15 targeted release-candidate update — 2026-08-25

Sprint 15 closes the exact one P0 and five P1 frontend defects confirmed by Sprint 14: editable internal cart/checkout IDs, inquiry-tour overflow, Book Egypt Trip identity/locale parity, duplicate title/rich description metadata, missing backend listing JSON-LD, and cart/checkout visible localization. Read-only regression passes 20/20 redirects, five invalid-content 404 families, all seven locale roots and raw languages, `/en` 404, homepage/shared-shell behavior, and the unchanged 4,972-URL Phase 1 sitemap at 86,400-second revalidation. Lint, Next 16.2.9 production build/type-check, and `git diff --check` pass.

Current frontend status: **route PASS; homepage PASS; static content PASS; dynamic frontend ownership PASS; dashboard control PARTIAL pending external staging propagation proof; locale PASS; SEO PASS for audited frontend scope; sitemap PASS; responsive/UI PASS; customer-flow source PASS; frontend release candidate PASS; production cutover BLOCKED**.

Exact implementation and evidence: [Sprint 15 targeted release-candidate fixes](./sprint15-targeted-release-candidate-fixes.md).
