# Sprint 13 frontend cutover report

Date: 2026-08-24

Sprint 13 frontend acceptance: **PASS**. Overall production cutover: **BLOCKED** by backend/security, staging mutation, payment sandbox, marketing-debug, and owner-approval gates—not by the completed frontend parity scope.

## Outcome

- Backend files modified: **0**.
- Homepage ownership: **20/20 audited**; 12 API-driven/mixed, 8 intentional static, 0 unknown.
- Current Live contact values and approved Since 1970 logo: **PASS**.
- No confirmed dynamic entity was converted to static content. Hardcoded-but-intentional presentation is no longer reported as a migration defect.
- Filtered settings usage remains narrow: `site_title`, `notification_emails`, `social_links`, `company_location_url`; `company_team` stays independently filtered where needed. The unused/non-owning `logo` setting call was removed.
- Auth/profile source status: PASS; end-to-end account mutation `BLOCKED_BY_STAGING_ACCESS`. Reload hydration uses `profile/me`; invalid 401 clears token; full profile payload is no longer persisted in a client cookie.
- Guest cart: `GUEST_CART_IP_IDENTITY = ACCEPTED_EXISTING_PARITY`; mutation runtime blocked without staging/test data.
- Rental/checkout/PayPal/Fawaterk: source contract PASS/PARTIAL as documented; real outcomes blocked without safe staging IDs, cart/coupon data, and sandbox invoices.
- Contact/inquiry: payload contract PASS; `FRONTEND_TOKEN_PRESENT`; `BACKEND_VERIFICATION_NOT_CONFIRMED`.
- Tracking: GTM `GTM-KDF33T7`, GA4 `G-NKZ6W32C4J`, and TrustIndex are present. Google Ads/TikTok/Clarity are not separately hardcoded in Next; any active delivery depends on the existing GTM container. Preview/debug/conversion proof is `BLOCKED_BY_MARKETING_ACCESS`.

## Regression evidence

| Check | Result |
|---|---|
| Invalid tour/blog/event | 3/3 HTTP 404 |
| Exact permanent redirects | 20/20 status and `Location` PASS |
| Locale roots/html lang/shared UI | root + six prefixed locales PASS; `/en` 404; confirmed homepage/contact/cart/checkout/profile/payment labels migrated |
| Marketing/customer route build manifest | PASS |
| Sitemap index/children | 6/6 HTTP 200 |
| Sitemap documents | 4,972 URLs; 4,972 `x-default`; 0 `/en`; 0 duplicate `<loc>` |
| Sitemap revalidation | `86400` unchanged |
| Robots | HTTP 200 |
| Payment callback without invoice | 200 shell; “Missing Invoice”; no console error; source returns before API call |
| `npm run lint` | PASS (first post-implementation pass; repeated at handoff) |
| `npm run build` | PASS — Next 16.2.9 compile, type-check, 40 static pages, expected route manifest |
| `git diff --check` | Repeated at final handoff |

`next-dev-loop` requires Next 16.3+, while this repository is on 16.2.9. No unapproved dependency upgrade was performed; the equivalent production build, local server, browser DOM, console, and safe HTTP checks were used.

## Final migration dimensions

| Dimension | Sprint 13 result | Reason |
|---|---|---|
| ROUTE MIGRATION | **PARTIAL** | Required route/404/redirect families pass; owner-only mutation and remaining broader parity evidence keep overall status partial. |
| DYNAMIC API MIGRATION | **PARTIAL** | Confirmed public content is dynamic; protected/staging propagation evidence remains unavailable. |
| DASHBOARD CONTROL | **PARTIAL** | Proven dynamic fields are connected; no approved edit/observe/revert staging run. |
| LOCALE PARITY | **PARTIAL** | Route contracts, lang, and major shared/home/form copy pass; unconfirmed page-specific strings retain English fallback. |
| SEO PARITY | **PARTIAL** | P0 status/canonical/alternate/sitemap work passes; full business SEO approval is outstanding. |
| SITEMAP COVERAGE | **PASS** | 4,972 URLs, daily revalidation, complete `x-default`, no `/en`, no duplicates. |
| FRONTEND CUTOVER READINESS | **PASS WITH EXTERNAL GATES** | Sprint 13 frontend implementation and safe regressions pass. |
| PRODUCTION CUTOVER | **BLOCKED** | Backend security fixes/acceptance, staging mutation/payment tests, tracking access, and owner approvals remain. |

## Exact remaining blockers

Frontend-owned: no approved staging frontend/API/test customer; no safe coupon/cart/rental fixtures; no PayPal/Fawaterk sandbox invoice IDs; no GTM Preview/GA4 DebugView/Ads/TikTok/Clarity access; no final visual/business owner signoff. These block proof, not current source wiring.

Backend-owned: unfiltered public settings exposure/credential rotation; booking-detail authorization scope; absent backend reCAPTCHA validation; IP guest-cart identity if business rejects existing parity; payment GET-mutation/guard/config hardening; missing explicitly owned contact settings if the business wants dashboard control.

## Recommendation

Approve Sprint 13 frontend scope and freeze it for cutover candidate testing. Do **not** approve production DNS/cutover until the backend/security owner closes or explicitly accepts the documented risks and the business provides staging payment, mutation, tracking-debug, and final UI approval evidence.
