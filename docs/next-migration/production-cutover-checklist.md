# Production Cutover Checklist

## Required Gates

| Gate | Status | Notes |
|---|---|---|
| Required migration docs completed | In progress | This folder contains the required discovery/validation docs. |
| Route parity | Passed for route existence | See `docs/nuxt-route-inventory.md`; customer flows still require validation. |
| UI parity | Partial | Sprint 2 captured Nuxt and Next screenshots for all priority pages desktop/mobile; parity not approved due documented gaps. |
| API-driven behavior | Partial | Public content mostly wired; Sprint 5 added confirmed customer-flow parity gaps. Staging validation, settings/menu/footer, and revenue flow approval remain pending. |
| SEO/domain validation | Partial | Code safeguards exist and Sprint 3 raw HTML checks passed locally for priority pages; staging still required. |
| Sitemap/robots validation | Partial | Sprint 2 added paginated tours/blogs plus categories/destinations/blog categories. Custom marketing page discovery still blocked by missing list endpoint. |
| Customer flows | Partial | Auth/profile/bookings/favourites/cart/checkout/rent-car/make-your-trip are client API-wired; staging validation is still a blocker. |
| Payment callback safety | Partial pass | Client-only implementation exists and no-invoice browser validation passed; sandbox invoice validation pending. |
| Forms | Partial | Contact posts Nuxt-compatible payload with recaptcha token attempt; backend recaptcha/tracking and other forms pending. |
| `npm run lint` | Passed | Passed on 2026-06-22. |
| `npm run build` | Passed | Passed on 2026-06-22. |
| Lighthouse performance | Partial | Sprint 4 explains the regression: diagnostic no-third-party runs pass strongly, but normal runs remain low due GTM-loaded third parties. Tour LCP fallback image issue was fixed. |
| Functional cutover blockers | Blocked | Hydration, customer flows, payment, recaptcha/tracking, sitemap completeness, and UI parity must be validated independently of Lighthouse performance. |
| Staging backend validation | Pending | Requires real staging credentials/data/payment sandbox. |
| Rollback plan | Documented below | Must be reviewed before DNS/proxy cutover. |
| Final approval | Pending | Product/engineering approval required. |

## Sprint 2 Final Checks

Date: 2026-06-22

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run build` | Passed |
| Route smoke tests | Passed HTTP 200 for requested priority routes and callback routes. |
| Browser console | Failed on homepage due React hydration error #418. Payment no-invoice callback had no console errors. |
| Payment callback no-invoice safety | Passed; no payment mutation API request observed. |
| Lighthouse mobile homepage | Passed locally: performance 100, LCP 0.8s, CLS 0, TBT 50ms. |
| Lighthouse mobile representative tour | Passed locally: performance 98, LCP 2.2s, CLS 0.004, TBT 0ms. |
| Nuxt-vs-Next screenshots | Captured for all priority routes desktop/mobile. Parity not approved due documented gaps. |

## Sprint 2 Cutover Verdict

Production cutover remains blocked.

Blocking items:

1. Auth/profile/cart/checkout routes are static clones and fail functional parity.
2. Checkout/payment business flows need staging credentials, cart state, and sandbox invoice validation.
3. Homepage hydration error #418 must be fixed.
4. UI parity gaps remain across category, auth, profile, cart, checkout, tour detail, contact, and mobile pages.
5. Custom marketing sitemap discovery needs backend support or explicit exclusion approval.
6. Form recaptcha token usage and conversion/thank-you tracking require validation.

## Sprint 3 Final Checks

Date: 2026-06-22

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run build` | Passed |
| Route smoke tests | Passed HTTP 200 for the full Sprint 3 route list, including auth/profile/cart/checkout/thankful/payment callbacks/sitemap/robots. |
| Browser console | Passed on homepage; no React hydration #418 or other console errors. Headless localhost warnings only from Hotjar/Plausible. |
| Homepage hydration #418 | Fixed. Confirmed cause was dashboard blog description HTML rendered inside the blog card link; `BlogCard` now strips HTML for the summary text. |
| Payment callback no-invoice safety | Passed; no payment mutation API request observed without `invoice_id`. |
| SEO raw HTML | Passed for `/`, `/egypt-tours/one-day-tours`, representative tour slug, and `/contact-us`. |
| Lighthouse mobile homepage | Needs optimization follow-up: performance 51, LCP 9.9s, CLS 0.029, TBT 1,100ms. Sprint 4 re-ran normal and `?no-third-party=1` diagnostic tests and attributed the gap primarily to GTM/GA-loaded third-party scripts. |
| Lighthouse mobile representative tour | Needs optimization follow-up: performance 47, LCP 12.7s, CLS 0.002, TBT 1,030ms. Sprint 4 found third-party script cost plus a raw fallback hero image; the hero image issue was fixed and the remaining normal-mode gap is third-party dominated. |

## Sprint 3 Cutover Verdict

Production cutover remains blocked.

Blocking items:

1. Auth/profile/cart/checkout need staging validation with real credentials, cart state, and backend responses.
2. Checkout/payment still needs `bookings/update/{id}` parity and sandbox invoice validation.
3. UI parity is not approved yet.
4. Custom marketing sitemap discovery needs backend support or explicit exclusion approval.
5. reCAPTCHA backend acceptance and conversion/thank-you tracking parity require validation.
6. Current Lighthouse mobile performance needs investigation before final approval.

## Sprint 4 Final Checks

Date: 2026-06-22

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npm run build` | Passed |
| Route smoke tests | Passed HTTP 200 for public, auth/profile/cart/checkout, thankful, no-invoice payment callback, sitemap, and robots routes. |
| Browser console | Diagnostic home/tour/customer/payment routes had no console errors. Normal third-party tour mode showed a third-party page error and remains a validation item. |
| Payment callback no-invoice safety | Passed in fresh browser context; no payment mutation request without `invoice_id`. |
| SEO raw HTML | Passed for `/`, `/egypt-tours/one-day-tours`, representative tour slug, and `/contact-us`. |
| Lighthouse mobile homepage normal | 52, LCP 6.8s, CLS 0.03, TBT 1,280ms. |
| Lighthouse mobile homepage diagnostic | 100, LCP 1.2s, CLS 0.029, TBT 50ms. |
| Lighthouse mobile representative tour normal | 65, LCP 2.9s, CLS 0.002, TBT 960ms. |
| Lighthouse mobile representative tour diagnostic | 94, LCP 1.7s, CLS 0.002, TBT 60ms. |

## Sprint 4 Cutover Verdict

Production cutover remains blocked.

Blocking items:

1. Auth/profile/cart/checkout still need staging validation with real credentials and cart state.
2. Checkout/payment still needs `bookings/update/{id}` parity and sandbox invoice validation.
3. Normal Lighthouse runs remain affected by production third-party scripts; business approval or tag optimization is required.
4. reCAPTCHA backend acceptance and conversion/thank-you tracking parity require validation.
5. Custom marketing sitemap discovery needs backend support or explicit exclusion approval.
6. UI parity is not approved yet.

## Sprint 5 Status

Date: 2026-06-22

| Check | Result |
|---|---|
| Confirmed parity gaps implemented | Cart remove/coupon/edit, checkout `bookings/update/{id}`, rent-car append, and make-your-trip submission. |
| `npm run lint` | Passed |
| `npm run build` | Passed |
| Route smoke tests | Passed HTTP 200 for required Sprint 5 route list plus `/make-your-trip` and `/rent-car`. |
| Browser validation | Diagnostic home/tour/customer/contact/payment routes had no console errors; no payment mutation request without `invoice_id`; no reCAPTCHA request on page load. |
| SEO raw HTML | Public routes passed frontend-domain SEO URL checks. Cart/checkout render basic metadata only and need business decision if richer SEO is required. |
| Lighthouse mobile homepage normal | 71, LCP 3.2s, CLS 0.029, TBT 970ms. |
| Lighthouse mobile homepage diagnostic | 88, LCP 3.7s, CLS 0.029, TBT 50ms. |
| Lighthouse mobile representative tour normal | 70, LCP 2.7s, CLS 0.002, TBT 920ms. |
| Lighthouse mobile representative tour diagnostic | 92, LCP 2.7s, CLS 0.002, TBT 0ms. |
| Staging auth/profile validation | Blocked; no staging credentials or test account provided. |
| Staging cart/checkout validation | Blocked; no populated cart, coupon, payment method, or sandbox data provided. |
| Payment sandbox callback validation | Blocked; no PayPal/Fawaterk sandbox invoice IDs provided. |
| reCAPTCHA backend acceptance | Blocked; no staging validation context provided. |
| Conversion/thank-you tracking | Blocked; no GTM preview/account approval provided. |
| Third-party performance approval | Blocked pending marketing/tag owner decision. |
| Custom marketing sitemap decision | Blocked pending backend list endpoint, approved manual slugs, or explicit exclusion. |
| Production cutover | Still blocked. |

## Sprint 6 Status

Date: 2026-06-23

| Check | Result |
|---|---|
| Staging frontend URL | Blocked; not provided. |
| Staging backend/API URL | Blocked; not provided. |
| Test account | Blocked; not provided. |
| Cart/coupon/test data | Blocked; no tour ID, rent-car data, populated cart item, valid coupon, invalid coupon confirmation, or checkout billing data provided. |
| Sandbox invoice IDs | Blocked; no PayPal or Fawaterk sandbox invoice IDs provided. |
| Auth staging validation | Blocked; cannot validate success/error/session/redirect behavior without staging account. |
| Profile staging validation | Blocked; cannot validate protected profile/bookings/favourites/settings without staging account. |
| Cart staging validation | Blocked; cannot validate append/edit/remove/coupon/totals/persistence without staging cart data. |
| Checkout/booking validation | Blocked; cannot validate booking creation, payment URL, redirect, or profile booking appearance without staging cart/payment data. |
| Payment callback sandbox validation | Blocked for valid/invalid/duplicate/refresh behavior; no-invoice code safety remains passed from prior browser checks. |
| Backend reCAPTCHA acceptance | Blocked; staging/site key and backend acceptance settings not provided. |
| Conversion/thank-you tracking | Blocked; GTM Preview, GA4 DebugView, ads test method, and tag owner access not provided. |
| Third-party performance approval | Blocked; marketing/tag-owner decision still required before disabling, deferring, route-scoping, or accepting cost. |
| Custom marketing sitemap decision | Blocked; no backend list endpoint, alternate slug source, approved manual slug list, or explicit exclusion provided. |
| UI parity approval | Blocked; no approval yet. Broad UI polish remains deferred until revenue-flow validation is passed or formally blocked. |
| SEO/domain validation | Partial local/code pass; staging raw HTML checks blocked without staging URL. |
| `npm run lint` | Passed locally on 2026-06-23. |
| `npm run build` | Passed locally on 2026-06-23. |
| Route smoke tests | Passed HTTP 200 for all required Sprint 6 routes on local production server. |
| Browser validation | Passed diagnostic Chrome checks for required customer/public/payment pages; no console errors, no page-load reCAPTCHA on form pages, and no no-invoice payment mutation request. |
| Lighthouse mobile homepage normal | 44, LCP 9.3s, CLS 0.029, TBT 1,400ms. |
| Lighthouse mobile homepage diagnostic | 89, LCP 3.7s, CLS 0.029, TBT 50ms. |
| Lighthouse mobile representative tour normal | 66, LCP 2.9s, CLS 0.002, TBT 1,090ms. |
| Lighthouse mobile representative tour diagnostic | 90, LCP 2.8s, CLS 0.002, TBT 80ms. |
| Production cutover | Still blocked. |

Sprint 6 required access/test-data checklist is documented in `docs/next-migration/sprint6-validation-report.md`.

## Sprint 7 Status

Date: 2026-06-23

| Check | Result |
|---|---|
| Access requirements checklist | Created in `docs/next-migration/sprint7-access-requirements.md`. |
| Staging frontend URL | Blocked; not provided. |
| Staging backend/API URL | Blocked; not provided. |
| Test account | Blocked; not provided. |
| Cart/coupon/test data | Blocked; no approved tour ID, rent-car data, cart item, coupon codes, or checkout billing details provided. |
| Sandbox invoice IDs | Blocked; no PayPal or Fawaterk sandbox invoice IDs provided. |
| reCAPTCHA settings | Blocked; no approved staging key, Enterprise config, or backend acceptance settings provided. |
| GTM/GA/Ads debug access | Blocked; no GTM Preview, GA4 DebugView, Google Ads test method, or TikTok/Clarity owner access provided. |
| Environment configuration check | Completed at code level; `NEXT_PUBLIC_APP_URL` controls public URL, `NEXT_PUBLIC_API_URL` controls backend API, `?no-third-party=1` suppresses diagnostic third parties, and payment callbacks remain client-side. |
| Auth staging validation | Blocked; cannot validate without staging URL and test account. |
| Profile staging validation | Blocked; cannot validate without authenticated staging account and profile/bookings/favourites data. |
| Cart/rent-car staging validation | Blocked; cannot validate without approved staging cart, tour, coupon, and rental data. |
| Checkout/booking validation | Blocked; cannot validate without staging cart, billing data, payment methods, and backend booking responses. |
| Payment callback sandbox validation | Blocked for sandbox behavior; no-invoice local safety remains covered by validation docs. |
| Backend reCAPTCHA acceptance | Blocked; missing staging key/config/backend settings. |
| Conversion/thank-you tracking | Blocked; missing debug/owner access. |
| Third-party performance approval | Blocked; marketing/tag-owner decision still required. |
| Custom marketing sitemap decision | Blocked; no backend endpoint, alternate slug source, approved manual slugs, or exclusion approval provided. |
| UI parity approval/fixes | Blocked; broad UI polish deferred until revenue-flow validation passes or is formally blocked by missing access. |
| SEO/domain validation | Local/code pass; staging blocked without staging URL. |
| `npm run lint` | Passed locally on 2026-06-23. |
| `npm run build` | Passed locally on 2026-06-23. |
| Route smoke tests | Passed HTTP 200 for all required Sprint 7 routes on local production server. |
| Browser validation | Passed diagnostic Chrome checks; no console errors, no page-load reCAPTCHA on form pages, and no no-invoice payment mutation request. |
| Lighthouse mobile homepage normal | 69, LCP 3.3s, CLS 0.029, TBT 1,090ms. |
| Lighthouse mobile homepage diagnostic | 91, LCP 3.4s, CLS 0.03, TBT 80ms. |
| Lighthouse mobile representative tour normal | 66, LCP 2.8s, CLS 0.002, TBT 1,190ms. |
| Lighthouse mobile representative tour diagnostic | 91, LCP 2.8s, CLS 0.002, TBT 80ms. |
| Production cutover | Still blocked. |

## Sprint 8 Status

Date: 2026-06-23

| Check | Result |
|---|---|
| Nuxt access/config discovery | Completed in `docs/next-migration/sprint8-nuxt-access-discovery.md`. |
| Nuxt `.env*` files | None found under `nuxt_sunpyramids/`. |
| Private credentials/secrets | None found in safe Nuxt docs/config/test/sample sources. |
| Public frontend URL | Found: `https://sunpyramidstours.com`. |
| Possible Nuxt demo/staging frontend | Partial: `https://new-sunpyramids-demo.vercel.app`; requires owner confirmation before staging use. |
| Backend/API URL | Partial: Nuxt fallback is `https://sunpyramidtours.com/api/`; no separate staging API URL found. |
| reCAPTCHA/GTM/GA public identifiers | Found; backend acceptance and debug access remain blocked. |
| Nuxt-derived values applied review | Completed in `docs/next-migration/nuxt-derived-values-applied.md`; safe public values were already present, so no production code change was required. |
| Backend access/config discovery | Completed in `docs/next-migration/sprint8-backend-access-discovery.md`; API contracts clarified, but staging/test data remains blocked. |
| Backend payment contract | Laravel `POST /api/bookings` requires `payment_method`; no `bookings/update/{id}` API route was found. |
| Backend frontend URL config | Blocked pending owner confirmation of `APP_FRONT_URL` vs `APP_FRONTEND_URL` for `site_url()` payment/sitemap output. |
| Tour/rent-car/coupon/checkout/payment data | Payload shapes and public slugs partially found; Sprint 10 confirms tour ID `664` for `Test_tour`, while valid coupon, real rental IDs, enabled gateway config, and sandbox invoices remain blocked. |
| Custom marketing sitemap source | Blocked; Nuxt confirms only `custom-pages/{slug}` detail usage and public static sitemap paths without an approved source-of-truth. |
| `npm run lint` | Passed locally on 2026-06-23. |
| `npm run build` | Passed locally on 2026-06-23. |
| Production cutover | Still blocked. |

## Sprint 9 Status

Date: 2026-06-23

| Check | Result |
|---|---|
| Backend contract alignment | Completed for confirmed active frontend mismatches. |
| Checkout contract | Active Next checkout now sends `payment_method` in `POST /api/bookings`; no active `bookings/update/{id}` call remains. |
| Cart remove contract | Active remove action now sends tour product ID for tour rows and rental row ID for rental rows, matching inspected Laravel behavior. |
| Rent-car destination contract | Destination lookup now posts `pickup_location_id` in the request body. |
| Contact/custom-trip fields | Contact phone/country and custom-trip first/last name payload fields were aligned to backend-required fields. |
| reCAPTCHA backend status | Frontend treats token as optional because no Laravel validator was found; owner/security confirmation remains required. |
| Payment callback safety | No payment callback mutation behavior was changed; sandbox invoice validation remains blocked. |
| Custom marketing sitemap | No unapproved `/api/pages` or manual marketing sitemap integration was added. |
| Tracking/debug access | Still blocked; no GTM/GA/Ads/TikTok/Clarity debug or owner approval was provided. |
| `npm run lint` | Passed locally on 2026-06-23. |
| `npm run build` | Passed locally on 2026-06-23. |
| Route smoke tests | Passed HTTP 200 for the Sprint 9 route set on local production server. |
| Browser diagnostic | Blocked by unavailable Playwright tooling; no repo dependency was installed. |
| Staging validation | Blocked; no staging URL, test account, valid coupon, real tour/rental IDs, sandbox invoice IDs, backend reCAPTCHA settings, tracking debug access, or UI approval owner provided. |
| Production cutover | Still blocked. |

## Sprint 10 Limited Production-API Validation

Date: 2026-06-25

| Check | Result |
|---|---|
| Frontend staging URL | Available: `https://sunpyramids-next.vercel.app/`. |
| API URL | Available: `https://sunpyramidtours.com/api/`; production-risk API, not sandbox. |
| Environment/config usage | Confirmed: `NEXT_PUBLIC_APP_URL` controls public frontend/SEO URL, `NEXT_PUBLIC_API_URL` controls API base URL, reCAPTCHA site key is in `lib/recaptcha.ts`, GTM/GA IDs are in `components/ThirdPartyScripts.tsx` and `app/layout.tsx`, and `?no-third-party=1` suppresses client third-party loaders. |
| Staging route smoke | Partial: required routes mostly returned `200`, but `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car` returned `500` on deployed staging. |
| Local route smoke | Passed HTTP 200 for all required Sprint 10 routes on the current local production build. |
| API safe reads | Passed for `countries`, `locations?page_limit=1`, `pages/contact-us`, `pages/make-your-trip`, and `tours/Test_tour`; blocked/failing for `pages/rent-car` (`404`) and `tours/Test_tour?includes=...reviews` (`500`). |
| Test account | Email available; password redacted/not stored. Valid login blocked in this run because the password was not available as a secure runtime value. |
| Invalid login | Passed safe negative check: `POST /api/auth/login` returned controlled `400` for wrong password. |
| Numeric tour ID | Confirmed numeric tour ID `664`; tour code is `Test`, not a valid integer `tour_id`. Use `664` wherever the backend API requires numeric `tour_id`. |
| Cart validation | Blocked pending owner approval for production-API cart mutation and healthy deployed tour route. No cart add/remove was run. |
| Checkout validation | UI/page load only. No checkout submission, booking creation, payment redirect, or invoice creation was run. |
| Payment callback no-invoice | HTTP route smoke passed without `invoice_id`; no invoice mutation paths were called. Browser/network validation remains manual because browser tooling is unavailable without adding dependencies. |
| reCAPTCHA | Raw HTML check shows no global reCAPTCHA script on sign-in page; backend acceptance remains blocked. |
| Tracking | Code-level/public-ID only; debug validation remains blocked. |
| `npm run lint` | Passed locally on 2026-06-25. |
| `npm run build` | Passed locally on 2026-06-25. |
| `git diff --check` | Passed on 2026-06-25; only LF-to-CRLF working-copy warnings were emitted. |
| Production cutover | Still blocked. |

## Sprint 11 Staging 500 Triage

Date: 2026-06-25

| Check | Result |
|---|---|
| Staging 500 investigation | Completed without Vercel logs. Response headers show the failing deployed routes match `/500`; local production build passes. |
| Tour root cause | Backend deep include failure confirmed: `includes=seo` works, `includes=seo,gallery` and broader sets return 500 for `Test_tour`. |
| Generic route root cause | Likely SSR runtime incompatibility on shared sanitized HTML rendering path; generic content routes and tour content share `sanitizeHtml`. |
| Code fixes | `lib/data.ts` now avoids unsupported tour deep includes; `lib/sanitize-html.ts` now uses an SSR-safe sanitizer helper. |
| Local route smoke | Passed HTTP 200 for home, tour, contact, make-your-trip, rent-car, generic pages, auth/profile shell, no-invoice callbacks, sitemap, and robots. |
| Staging route smoke | Still failing on deployed staging for `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car` until redeploy/verification. Other checked safe routes returned 200. |
| Auth valid login | Blocked; secure runtime password value was not available. |
| Browser validation | Blocked/manual-required; no browser tooling dependency was installed. |
| Production cutover | Still blocked. |

## Sprint 12 Staging Redeploy Verification

Date: 2026-06-25

| Check | Result |
|---|---|
| Staging redeploy verified | No. Target routes still return `/500`. |
| Vercel deployment metadata | Unavailable from this workspace; no `.vercel/project.json` and no configured Vercel project metadata. |
| Vercel env confirmation | Unknown; expected `NEXT_PUBLIC_APP_URL=https://sunpyramidstours.com` and `NEXT_PUBLIC_API_URL=https://sunpyramidtours.com/api/`. |
| Staging target routes | `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car` still return 500. |
| Other safe staging routes | `/`, `/cart`, `/cart/checkout`, `/auth/sign-in`, `/profile`, no-invoice callbacks, `/sitemap.xml`, and `/robots.txt` returned 200. |
| Auth valid login | Blocked; secure runtime password value was unavailable. |
| Invalid login | Passed safe negative check with controlled `400`. |
| Local route smoke | Passed for the Sprint 12 route set. |
| `npm run lint` | Passed locally on 2026-06-25. |
| `npm run build` | Passed locally on 2026-06-25. |
| Production cutover | Still blocked. |

## Rollback Triggers

- SEO tags missing or wrong.
- Canonical/hreflang/OG URLs broken.
- Sitemap invalid or leaking backend/admin/API URLs.
- Booking/contact/auth/cart/checkout/payment flow broken.
- Tour pages fail or dashboard data does not load.
- API requests fail because of domain/header/auth changes.
- Major visual regression.
- Multilingual routes broken.
- Tracking/conversions broken.

## Rollback Steps

1. Restore the current Nuxt deployment.
2. Revert DNS/proxy/routing change.
3. Purge Cloudflare/cache layers.
4. Verify homepage, representative tour page, contact page, and booking flow.
5. Restore previous sitemap if needed.
6. Investigate Next.js issue on staging.
7. Retry cutover only after the failed gate passes.
