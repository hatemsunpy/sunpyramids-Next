# API-Driven Behavior Validation

## Confirmed In Code

| Requirement | Evidence | Status |
|---|---|---|
| Backend/API domain remains separate | `lib/config.ts` defaults `API_BASE` to `https://sunpyramidtours.com/api/`. | Passed. |
| Public SEO domain remains frontend | `lib/seo.ts` defaults `FRONTEND_ORIGIN` to `https://sunpyramidstours.com`. | Passed in code; raw HTML pending. |
| Server fetch passes locale | `lib/api.ts` sends `X-Localize`. | Passed in code; backend response pending. |
| Server fetch can pass auth token | `lib/api.ts` reads `sunpyramids-token` cookie. | Passed in code; auth flow pending. |
| Public pages fetch API data | `lib/data.ts` uses pages/tours/blogs/categories/destinations/faqs endpoints. | Partial pass. |
| Client contact form posts to backend | `components/ContactForm.tsx` posts backend-required `contact-requests` fields and includes `recaptcha_token` only when generated. | Code pass; backend discovery found no Laravel reCAPTCHA validator, tracking pending. |
| Client customer flow API layer | `components/CustomerFlows.tsx` wires auth, profile, bookings, favourites, cart list/clear/remove/coupon/edit, checkout booking creation, rent-car, and make-your-trip to confirmed endpoints. | Code pass; staging credentials/data pending. |
| Payment callbacks call API client-side only | `components/PaymentCallbackStatus.tsx` is `"use client"` and calls in `useEffect`. | Passed in code; backend sandbox pending. |
| Homepage hydration error fixed | `components/BlogCard.tsx` renders dashboard blog summaries as plain text after stripping HTML, avoiding browser/React HTML mismatch inside the card link. | Browser console pass; no React #418 observed. |
| Third-party diagnostic mode | `components/ThirdPartyScripts.tsx`, `components/TrustIndexLoader.tsx`, and `lib/recaptcha.ts` skip third-party loads when the URL contains `no-third-party=1`. | Implemented for local diagnosis; normal tracking parity remains active. |
| reCAPTCHA submit-time loading | `lib/recaptcha.ts` injects Enterprise script only when `generateRecaptchaToken()` runs. | Implemented; backend acceptance pending. |

## Confirmed Gaps / Pending Validation

| Area | Gap | Required action |
|---|---|---|
| Settings/header/footer | Nuxt fetches `settings`, `countries`, `currencies`; Next may use static shell values. | Confirm whether dashboard-managed header/footer/currency must be API-driven before cutover. |
| Auth | Next now posts login/register/password endpoints. | Validate with staging credentials and expired/invalid session cases. |
| Profile | Next now patches profile and fetches bookings/favourites client-side after token check. | Validate with staging account data. |
| Cart | Next now fetches cart list and supports clear/remove/coupon/tour edit via confirmed endpoints. | Validate with populated staging cart state. |
| Checkout | Next now posts `bookings` with `payment_method` and redirects to approved payment URLs; no active `bookings/update/{id}` call remains. | Critical staging payment validation blocker. |
| Make Your Trip | Next now posts `custom/trips` with submit-time reCAPTCHA token. | Validate backend acceptance in staging. |
| Rent Car | Next now fetches locations/destinations and appends rentals to cart. | Validate with staging cart/rental data. |
| Search/trips | Nuxt filters categories/destinations/tours with query params; Next representative route exists. | Validate filters, pagination, query behavior. |

## Cutover Status

Sprint 8 backend discovery found no inspected Laravel route for `bookings/update/{id}`. Sprint 9 aligned active checkout to backend booking creation by sending `payment_method` in `POST /api/bookings` and removing the unconfirmed payment-update call.

Not approved. Public content API behavior is partially implemented, customer/revenue flows have a first-pass client API layer, and local route smoke tests passed for the Sprint 3 route set. Customer/revenue flows still require staging backend validation.

## Sprint 9 Backend Contract Alignment

| Area | Sprint 9 result | Remaining evidence needed |
|---|---|---|
| Auth/session | Client API continues to use bearer token auth and does not rely on cross-site Laravel session cookies. | Valid staging account, expired-session behavior, and protected redirect evidence. |
| Checkout | `POST bookings` now includes `payment_method`; the unconfirmed `bookings/update/{id}` call was removed. | Booking creation, payment redirect, backend validation error, and post-payment cart/profile evidence. |
| Cart remove | Remove logic now follows Laravel semantics: tour rows use tour product ID, rental rows use rental row ID. | Populated staging cart with approved tour and rental rows. |
| Rent-car destinations | Destination lookup posts `pickup_location_id` in the body. | Approved pickup/dropoff IDs and rental append response evidence. |
| reCAPTCHA | Contact and make-your-trip include `recaptcha_token` only when generated; backend code discovery found no validator. | Owner confirmation whether backend requires reCAPTCHA and staging valid/missing/invalid token responses. |
| Tracking/debug | No backend tracking config was found; public IDs remain code-level parity only. | GTM Preview, GA4 DebugView, Google Ads test method, TikTok/Clarity approval. |

### Sprint 9 Local Validation

| Check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Route smoke | Passed HTTP 200 for `/`, `/egypt-tours/one-day-tours`, representative tour slug, `/contact-us`, `/make-your-trip`, `/rent-car`, `/cart`, `/cart/checkout`, `/thankful`, auth/profile routes, no-invoice PayPal callback, `/sitemap.xml`, and `/robots.txt`. |
| Browser diagnostic | Blocked by unavailable Playwright tooling in this workspace; no project dependency was added. |

## Sprint 10 Limited Production-API Validation

Date: 2026-06-25

| Area | Result | Notes |
|---|---|---|
| Frontend staging availability | Partial pass | `https://sunpyramids-next.vercel.app/` responds. Required routes mostly return `200`, but `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car` return `500` on deployed staging. |
| API availability | Pass with production risk | `https://sunpyramidtours.com/api/` responds. Treat all validation as production-API safe; no booking/payment/coupon/rental mutations were run. |
| Public SEO/domain | Partial pass | Staging raw HTML for `/` and `/egypt-tours/one-day-tours` uses frontend-domain canonicals. Sitemap uses `https://sunpyramidstours.com` and does not include staging/backend domains. Some raw HTML includes backend-domain media/API asset references, which is acceptable outside canonical/OG sitemap URLs but should remain monitored. |
| Auth | Partial | Sign-in route loads and invalid login fails safely with controlled `400`. Valid login/profile validation blocked because password was not available as a secure runtime value. |
| Token exposure | Pass for checked pages | Raw HTML checks did not find `sunpyramids-token` or bearer token values on checked public/auth pages. |
| Tour detail | Partial/blocking issue | Test tour data is slug `Test_tour`, numeric ID `664`, code `Test`, title `Test Tour`; use `664` for backend APIs requiring numeric `tour_id`. Deployed staging route `/tour/Test_tour` returns `500`, and deep include API request returns `500`. |
| Cart | Blocked | No cart add/remove was run against production API. Requires owner approval and healthy tour route. |
| Checkout | Safe UI only | `/cart/checkout` loads; no booking creation, payment redirect, invoice creation, or `bookings/update/{id}` call was run. Code inspection still shows no active `bookings/update/{id}` call. |
| Payment callback | No-invoice only | Callback routes without `invoice_id` return `200`; no invoice mutation test was run. Browser network validation remains manual-required because browser tooling is unavailable without adding dependencies. |
| reCAPTCHA | Code/raw HTML pass, backend blocked | Raw sign-in HTML does not include global reCAPTCHA script; frontend loads submit-time only. Backend acceptance remains blocked. |
| Tracking | Blocked for business validation | Public GTM/GA IDs remain code-level only; no GTM Preview, GA4 DebugView, Ads, TikTok, or Clarity approval was provided. |

## Sprint 11 Staging 500 Triage

Date: 2026-06-25

| Area | Result | Notes |
|---|---|---|
| Shared route-family failure | Frontend fix applied | Staging `/500` affects generic content routes and tour detail. Current code removed the server-side `isomorphic-dompurify` sanitizer dependency path and uses an SSR-safe sanitizer helper. |
| Tour API include failure | Frontend mitigation applied; backend issue remains | `GET /api/tours/Test_tour?includes=seo` returns 200, but adding `gallery` returns backend 500. `getTour()` now requests only `includes=seo` and falls back to slug list without includes. |
| Contact/make-your-trip/rent-car | Current build local pass | Backend page APIs for `contact-us`, `make-your-trip`, and `car-rental` return 200; deployed staging still returns cached `/500` until redeployed/verified. |
| Auth valid login | Blocked | Secure password runtime value was not available in checked env variables; invalid login remains safely validated from Sprint 10. |
| Production API risk | Still active | No cart, booking, payment, coupon, rent-car, or invoice mutation was run. |

## Sprint 12 Staging Redeploy Verification

Date: 2026-06-25

| Area | Result | Notes |
|---|---|---|
| Redeploy verification | Not verified | Deployed staging still maps `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car` to `/500`. Vercel branch/commit/env metadata was unavailable from this workspace. |
| Local current build | Pass | `npm run build` and local production route smoke pass for the target routes and safe callback routes. |
| Auth/profile | Blocked for valid login | Password was not available through checked secure runtime env variables. Invalid login still fails safely with controlled `400`. |
| Payment no-invoice | Route smoke pass | Callback routes without `invoice_id` return 200. No invoice mutation was run. |
| Mutation validation | Still blocked | No cart, checkout, payment, coupon, rent-car, or dashboard mutation was run. |

## Sprint 4 Performance and Behavior Validation

Date: 2026-06-22

Target: local Next production build at `http://localhost:3000`.

| Area | Result |
|---|---|
| Performance root cause | Normal Lighthouse runs are dominated by third-party scripts loaded through GTM/TrustIndex: GA/GTM, TikTok, Clarity, and TrustIndex. Home improves from 52 to 100 with `?no-third-party=1`. |
| Tour LCP root cause | The representative tour page loaded `/images/mainBanner.png` as a raw 2 MB CSS background when dashboard tour media was missing/fallback. |
| Performance fixes | Added diagnostic third-party gate, moved reCAPTCHA to submit-time loading, and changed tour hero to optimized `next/image`. |
| Customer-flow bundle scope | `CustomerFlows` is imported through `ClonedNuxtPages` for auth/profile/cart/payment/landing clones only; homepage and tour detail do not import auth/profile/cart/checkout flows. |
| Payment no-invoice callback | Fresh browser context with `/order/payment/callback/paypal/verify?no-third-party=1` had no payment API requests and no console errors. |
| Browser console | Fresh diagnostic home and tour contexts had no console errors. Normal tour mode showed a third-party page error, so production third-party behavior still needs validation. |
| reCAPTCHA | No global reCAPTCHA request is made on page load. Token generation remains submit-time only and backend acceptance is blocked without staging validation. |
| Route smoke | Passed HTTP 200 for the Sprint 4 route list, including public pages, auth/profile/cart/checkout, payment callback, sitemap, and robots. |
| SEO raw HTML | Passed for `/`, `/egypt-tours/one-day-tours`, representative tour slug, and `/contact-us`: title/description/canonical/OG/Twitter/robots present, no meta keywords, no backend canonical/OG leak. |
| Lighthouse mobile home normal | 52, LCP 6.8s, CLS 0.03, TBT 1,280ms. Low score remains due third-party scripts. |
| Lighthouse mobile home diagnostic | 100, LCP 1.2s, CLS 0.029, TBT 50ms. |
| Lighthouse mobile tour normal after hero fix | 65, LCP 2.9s, CLS 0.002, TBT 960ms. Low score remains due third-party scripts. |
| Lighthouse mobile tour diagnostic after hero fix | 94, LCP 1.7s, CLS 0.002, TBT 60ms. |

## Sprint 5 Validation Status

Date: 2026-06-22

| Area | Result |
|---|---|
| Staging credentials | Not available in this run. Auth/profile/cart/checkout cannot be marked passed. |
| Test cart/account data | Not available. Cart edit/remove/coupon and checkout are code-wired only. |
| Sandbox invoice IDs | Not available. Payment callback success/failure/pending backend behavior remains blocked. |
| reCAPTCHA backend acceptance | Not validated. Contact and make-your-trip generate tokens on submit, but staging acceptance is blocked. |
| Conversion/thank-you tracking | Not approved. Nuxt/Next tag loading was inspected at code level; no GTM preview or conversion account validation was available. |
| Customer-flow parity implementation | First-pass parity added for cart remove/coupon/edit, checkout booking creation, make-your-trip, and rent-car confirmed endpoints. Sprint 9 removed the unconfirmed active `bookings/update/{id}` call. |
| Third-party performance decision | Not approved. Diagnostic mode proves first-party performance; normal mode remains marketing/tag-owner decision. |

### Local Validation

Target: local production build at `http://127.0.0.1:3000`.

| Check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Route smoke | Passed HTTP 200 for `/`, `/egypt-tours/one-day-tours`, representative tour, `/contact-us`, `/cart`, `/cart/checkout`, `/thankful`, auth routes, profile routes, no-invoice PayPal callback, `/sitemap.xml`, `/robots.txt`, `/make-your-trip`, and `/rent-car`. |
| Browser diagnostic console | Passed for home, tour, cart, make-your-trip, contact, and no-invoice payment callback; no console errors. |
| Browser diagnostic network | No payment API requests without `invoice_id`; no reCAPTCHA requests on page load. External diagnostic requests on cart/make-your-trip were backend API calls only. |
| Raw SEO HTML | Public routes passed canonical/OG/Twitter/frontend-domain checks; cart routes render basic/private-flow metadata only. |
| Lighthouse mobile home normal | 71, LCP 3.2s, CLS 0.029, TBT 970ms. |
| Lighthouse mobile home diagnostic | 88, LCP 3.7s, CLS 0.029, TBT 50ms. |
| Lighthouse mobile tour normal | 70, LCP 2.7s, CLS 0.002, TBT 920ms. |
| Lighthouse mobile tour diagnostic | 92, LCP 2.7s, CLS 0.002, TBT 0ms. |

Lighthouse produced valid JSON reports under `output/lighthouse/` but emitted Windows temp-profile cleanup `EPERM` warnings after each run.

### Tag/Tracking Parity Matrix

| Tag/event | Nuxt trigger | Next trigger | Route/action | Diagnostic mode | Approved | Status | Risk |
|---|---|---|---|---|---|---|---|
| GA4 `G-NKZ6W32C4J` | `nuxt.config.ts` global script | `ThirdPartyScripts` client effect | All normal routes | No | No | Code parity pending marketing validation | Medium |
| GTM `GTM-KDF33T7` | `nuxt.config.ts` global script | `ThirdPartyScripts` client effect | All normal routes | No | No | Code parity pending GTM preview validation | High |
| TikTok | Loaded through GTM/original tags | Loaded through GTM in normal mode | Marketing tags | No | No | Detected as third-party performance contributor | High |
| Clarity | Loaded through GTM/original tags | Loaded through GTM in normal mode | Analytics/session recording | No | No | Detected as third-party performance contributor | High |
| TrustIndex | Nuxt widget/script surfaces | `TrustIndexLoader` client effect | Widget routes/components | No | No | Functional validation pending | Medium |
| reCAPTCHA Enterprise | Nuxt global script/token calls | Submit-time `generateRecaptchaToken()` | Contact and make-your-trip submit | No | No | Backend acceptance pending | Medium |
| Thank-you conversion | Needs GTM/account confirmation | No explicit invented event added | `/thankful` | No | No | Must not fire purchase before confirmed success | Critical |

## Sprint 6 Validation Status

Date: 2026-06-23

Sprint 6 could not perform real staging/backend validation because the required access and test data were not provided. No API contracts were changed and no endpoints were invented.

| Area | Sprint 6 status | Required before pass |
|---|---|---|
| Auth API behavior | Blocked | Staging URL, test account, password, valid/invalid login evidence, session persistence, expired session, protected redirect, logout if present. |
| Profile API behavior | Blocked | Authenticated profile load/update, bookings list, favourites list/add/remove, empty/error/unauthorized/session-expired evidence. |
| Cart API behavior | Blocked | Staging tour/rental data, cart item IDs, valid/invalid coupons, totals, reload/login persistence, empty/error evidence. |
| Checkout API behavior | Blocked | Booking creation, backend validation errors, payment URL, failed booking behavior, cart state after booking, and profile booking appearance. |
| Payment callbacks | Partial code pass; sandbox blocked | Approved PayPal/Fawaterk invoice IDs for valid/invalid/duplicate/refresh outcomes. |
| reCAPTCHA backend acceptance | Blocked | Staging/site key and backend valid/missing/invalid response evidence. |
| Conversion/tracking | Blocked | GTM Preview, GA4 DebugView, ads conversion test method, TikTok/Clarity owner approval. |
| Public SEO/domain API behavior | Partial local/code pass | Staging raw HTML verification that public SEO URLs use `https://sunpyramidstours.com` and backend/API URLs do not leak. |

### Sprint 6 Local Validation

Target: local production build at `http://127.0.0.1:3106`.

| Check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Route smoke | Passed HTTP 200 for the full Sprint 6 route list, including auth/profile/cart/checkout, payment no-invoice callback, sitemap, and robots. |
| Browser diagnostic console/network | Passed for home, tour, contact, make-your-trip, rent-car, cart, checkout, sign-in, profile, and payment no-invoice callback. No console errors, no page-load reCAPTCHA requests on form pages, and no payment API request without `invoice_id`. |
| Raw SEO HTML | Public routes passed title/description/canonical/hreflang/OG/Twitter/robots/no-keywords checks where applicable; no backend SEO URL leak in canonical/OG. Cart/checkout remain basic private-flow metadata. |
| Lighthouse mobile home normal | 44, LCP 9.3s, CLS 0.029, TBT 1,400ms. |
| Lighthouse mobile home diagnostic | 89, LCP 3.7s, CLS 0.029, TBT 50ms. |
| Lighthouse mobile tour normal | 66, LCP 2.9s, CLS 0.002, TBT 1,090ms. |
| Lighthouse mobile tour diagnostic | 90, LCP 2.8s, CLS 0.002, TBT 80ms. |

## Sprint 7 Validation Status

Date: 2026-06-23

Sprint 7 access discovery found no `.env*` file and no provided staging credentials/test data. No API contracts were changed.

| Area | Sprint 7 status | Evidence / required data |
|---|---|---|
| Environment configuration | Code-level pass | `NEXT_PUBLIC_API_URL` controls backend API fallbacking to `https://sunpyramidtours.com/api/`; `NEXT_PUBLIC_APP_URL` controls public SEO fallbacking to `https://sunpyramidstours.com`. |
| Auth API behavior | Blocked | Requires staging URLs and test account. |
| Profile API behavior | Blocked | Requires authenticated staging account and data. |
| Cart/coupon API behavior | Blocked | Requires cart items, tour ID/slug, valid/invalid coupons, and auth/guest evidence. |
| Rent-car API behavior | Blocked | Requires staging pickup/dropoff data. |
| Checkout API behavior | Blocked | Requires booking/payment staging data and enabled payment methods. |
| Payment callbacks | Sandbox blocked | Requires PayPal/Fawaterk invoice IDs; no server-side mutation rules remain in force. |
| reCAPTCHA backend acceptance | Blocked | Requires staging key/config and backend expected token field behavior. |
| Conversion/tracking | Blocked | Requires GTM/GA/Ads/TikTok/Clarity debug or owner approval. |
| Third-party performance | Blocked | Requires marketing/tag-owner decision. |

### Sprint 7 Local Validation

Target: local production build at `http://127.0.0.1:3107`.

| Check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Route smoke | Passed HTTP 200 for the full Sprint 7 route list, including auth/profile/cart/checkout, payment no-invoice callback, sitemap, and robots. |
| Browser diagnostic console/network | Passed for home, tour, contact, make-your-trip, rent-car, cart, checkout, sign-in, sign-up, profile, profile bookings, and payment no-invoice callback. No console errors, no page-load reCAPTCHA requests on form pages, and no payment API request without `invoice_id`. |
| Raw SEO HTML | Public routes passed frontend-domain canonical/hreflang/OG/Twitter checks where applicable; no backend SEO URL leak. Cart/checkout remain basic private-flow metadata. |
| Lighthouse mobile home normal | 69, LCP 3.3s, CLS 0.029, TBT 1,090ms. |
| Lighthouse mobile home diagnostic | 91, LCP 3.4s, CLS 0.03, TBT 80ms. |
| Lighthouse mobile tour normal | 66, LCP 2.8s, CLS 0.002, TBT 1,190ms. |
| Lighthouse mobile tour diagnostic | 91, LCP 2.8s, CLS 0.002, TBT 80ms. |

## Sprint 8 Nuxt-Derived Values Application Review

Date: 2026-06-23

| Area | Result |
|---|---|
| Frontend/API domains | Current Next configuration already matches Nuxt-derived public values: SEO uses `https://sunpyramidstours.com`, API uses `https://sunpyramidtours.com/api/`. |
| reCAPTCHA | Current Next code already uses the Nuxt public Enterprise site key, action `submit`, and payload field `recaptcha_token`. Loading remains submit-time only. |
| GTM/GA | Current Next code already uses `GTM-KDF33T7` and `G-NKZ6W32C4J`; no unconfirmed events were added. |
| Tour/rental/checkout/payment endpoints | Current docs/code already preserve the confirmed endpoint shapes. Public slugs were not promoted to numeric tour IDs, and no rental IDs, coupon codes, payment methods, or sandbox invoices were invented. |
| Custom marketing sitemap | Still blocked. No custom marketing slugs were hardcoded from the public static sitemap without owner approval or backend source-of-truth. |
| Staging validation | Still blocked pending owner-provided access/data. |

## Sprint 3 Validation Result

Date: 2026-06-22

Target: local Next production build at `http://localhost:3000`, connected to the configured backend API domain.

| Area | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Route smoke | Passed HTTP 200 for `/`, all required auth/profile/cart/checkout/thankful routes, all required payment callback routes, `/sitemap.xml`, and `/robots.txt`. |
| Homepage browser console | Passed; no console errors and no React hydration #418. Only localhost/headless third-party warnings from Hotjar/Plausible. |
| Payment no-invoice callback | Passed; browser network log for `/order/payment/callback/paypal/verify` without `invoice_id` made no `payments/paypal/*` or `payments/fawaterk/*` request. |
| SEO raw HTML | Passed for `/`, `/egypt-tours/one-day-tours`, representative tour slug, and `/contact-us`: title/description/canonical/OG URL/robots present, no meta keywords, no backend domain leak in canonical/OG URLs. |
| reCAPTCHA | Contact form now attempts Enterprise token generation and submits `recaptcha_token`; real backend acceptance remains pending because no staging validation data was available. |
| Lighthouse mobile | Home performance 51, LCP 9.9s, CLS 0.029, TBT 1,100ms. Representative tour performance 47, LCP 12.7s, CLS 0.002, TBT 1,030ms. Reports were written, but Lighthouse emitted a Windows temp-profile cleanup warning after each run. |

## Local Route Smoke Result

Date: 2026-06-22

Target: `http://localhost:3000` from the production build.

Passed with HTTP 200:

- `/`
- `/egypt-tours/one-day-tours`
- `/contact-us`
- `/cart`
- `/cart/checkout`
- `/auth/sign-in`
- `/auth/sign-up`
- `/profile`
- `/profile/bookings`
- `/profile/favourites`
- `/profile/settings`
- `/order/payment/callback/paypal/verify`

## Sprint 2 Validation Result

Date: 2026-06-22

| Area | Result |
|---|---|
| Route smoke | Passed HTTP 200 for `/`, `/egypt-tours/one-day-tours`, representative `/tour/[slug]`, `/contact-us`, auth routes, profile routes, cart routes, `/thankful`, and payment callback routes. |
| Public API data | Representative tour slug was fetched from the live backend API and rendered in the Next tour route. |
| Sitemap API behavior | Fixed confirmed issue where paginated `data.data` responses were not parsed. Tours/blogs/categories/destinations/blog categories now appear in local sitemap. |
| Auth/profile/cart/checkout | Failed functional validation because current Next routes are static clones and do not call the Nuxt-confirmed APIs. |
| reCAPTCHA | Nuxt loads enterprise reCAPTCHA globally in `nuxt.config.ts`; Next loads the same script globally in `app/layout.tsx` with `lazyOnload`. Parity preserved, but form token usage is incomplete in current Next forms. |
| Tracking | Next layout includes GTM `GTM-KDF33T7` and GA4 `G-NKZ6W32C4J`; browser showed analytics requests. Full conversion/thank-you tracking parity still needs business validation. |
| Console | Homepage produced React hydration error #418 in local production browser check. Payment callback no-invoice route had no console errors. |
