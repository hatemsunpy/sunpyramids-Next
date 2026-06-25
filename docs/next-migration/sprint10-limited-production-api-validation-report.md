# Sprint 10 Limited Production-API Validation Report

Date: 2026-06-25

## Summary

Limited safe validation can proceed because a frontend staging URL, confirmed API URL, test customer email, tour slug, and dashboard verifier are now available. The API URL appears to be production, so this sprint avoided destructive or irreversible actions.

No checkout submission, booking creation, payment redirect, invoice callback with `invoice_id`, coupon success validation, rent-car append, or cart mutation was run.

Production cutover remains blocked.

## Provided Data

| Item | Value/status |
|---|---|
| Frontend staging URL | `https://sunpyramids-next.vercel.app/` |
| API URL | `https://sunpyramidtours.com/api/` |
| API risk | Production-domain API; treat as production-risk, not sandbox. |
| Test customer email | Available. Password redacted and not written to docs. |
| Dashboard verifier | Available. |
| Test tour slug | `Test_tour` |
| Test tour public URL | `https://sunpyramidstours.com/tour/Test_tour` |
| Test tour numeric ID | `664` |
| Test tour code | `Test` |
| Test tour title | `Test Tour` |

## Data Still Invalid or Missing

| Item | Status |
|---|---|
| Test account password | Not available in this thread or checked local secure env variables; valid-login automation blocked. |
| Numeric tour ID | Available: use `664` wherever the backend API requires numeric `tour_id`. |
| Tour code | `Test`; do not use this value as `tour_id`. |
| Valid coupon | Blocked; not provided. |
| Real rental IDs | Blocked; not provided. |
| Sandbox invoice IDs | Blocked; not provided. |
| Backend reCAPTCHA confirmation | Blocked. |
| GTM/GA/Ads/TikTok/Clarity debug access | Blocked. |
| UI approval owner | Blocked unless separately provided. |

## Environment Confirmation

| Area | Current project control |
|---|---|
| Public frontend URL/site URL | `NEXT_PUBLIC_APP_URL` in `lib/seo.ts` and `app/layout.tsx`; fallback `https://sunpyramidstours.com`. |
| API base URL | `NEXT_PUBLIC_API_URL` in `lib/config.ts`; fallback `https://sunpyramidtours.com/api/`. |
| reCAPTCHA site key | Public Enterprise key in `lib/recaptcha.ts`; loaded at submit time only. |
| GTM/GA IDs | GTM `GTM-KDF33T7` and GA4 `G-NKZ6W32C4J` in `components/ThirdPartyScripts.tsx`; GTM noscript in `app/layout.tsx`. |
| Diagnostic no-third-party mode | `?no-third-party=1` suppresses client GTM/GA, TrustIndex, and reCAPTCHA loaders. |

No credential or password was hardcoded.

## Tests Executed

| Test | Result |
|---|---|
| Staging route smoke | Partial; several required routes returned `500`. |
| Local production route smoke | Passed all required routes. |
| Safe API reads | Partial; core API works, but some route-specific data fails. |
| Public SEO/domain checks | Partial pass for checked pages and sitemap. |
| Invalid login | Passed safe negative check. |
| Valid login/profile | Blocked; password unavailable as secure runtime value. |
| Payment callback no-invoice route smoke | Passed HTTP route smoke without `invoice_id`. |
| reCAPTCHA page-load check | Raw HTML check found no global reCAPTCHA script on sign-in. |
| Token exposure raw HTML check | No auth token or bearer token found in checked public/auth HTML. |
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| `git diff --check` | Passed; only LF-to-CRLF working-copy warnings were emitted. |

## Staging Route Smoke

| Route | Status | Result |
|---|---:|---|
| `/` | 200 | Pass |
| `/egypt-tours/one-day-tours` | 200 | Pass |
| `/tour/Test_tour` | 500 | Fail on deployed staging |
| `/contact-us` | 500 | Fail on deployed staging |
| `/cart` | 200 | Pass |
| `/cart/checkout` | 200 | Pass |
| `/make-your-trip` | 500 | Fail on deployed staging |
| `/rent-car` | 500 | Fail on deployed staging |
| `/thankful` | 200 | Pass |
| `/auth/sign-in` | 200 | Pass |
| `/auth/sign-up` | 200 | Pass |
| `/profile` | 200 | Loads; expected private client behavior still needs login validation |
| `/profile/bookings` | 200 | Loads; expected private client behavior still needs login validation |
| `/profile/favourites` | 200 | Loads; expected private client behavior still needs login validation |
| PayPal no-invoice callback | 200 | Pass route smoke |
| PayPal canceled callback | 200 | Pass route smoke |
| Fawaterk success callback | 200 | Pass route smoke |
| Fawaterk pending callback | 200 | Pass route smoke |
| Fawaterk canceled callback | 200 | Pass route smoke |
| `/sitemap.xml` | 200 | Pass |
| `/robots.txt` | 200 | Pass |

## Local Route Smoke

Current local production build returned HTTP 200 for the full required route set, including `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car`. This points to a deployed staging/runtime/config gap rather than the current local build failing the route set.

## Safe API Read Results

| API request | Result |
|---|---|
| `GET /api/countries` | 200 |
| `GET /api/locations?page_limit=1` | 200 |
| `GET /api/pages/contact-us?includes=seo,metas` | 200 |
| `GET /api/pages/make-your-trip?includes=seo,metas` | 200 |
| `GET /api/pages/rent-car?includes=seo,metas` | 404 |
| `GET /api/tours/Test_tour` | 200; numeric ID `664`, code `Test`, title `Test Tour` |
| `GET /api/tours/Test_tour?includes=seo,gallery,category,destination,itinerary,includes,excludes,faqs,reviews` | 500 |

## Auth Validation Result

| Check | Result |
|---|---|
| Login route loads | Passed: staging `/auth/sign-in` returned 200. |
| Invalid login fails safely | Passed: `POST /api/auth/login` with a wrong password returned controlled `400` and message `The provided password is incorrect.` |
| Valid login succeeds | Blocked; password was not available in this thread or checked local secure env variables. |
| Bearer auth used by protected requests | Code-level confirmed in `lib/client-api.ts`; runtime protected API validation blocked without valid login. |
| Token storage | Code-level client cookie storage in `CustomerFlows`; no token found in checked raw HTML. |
| Profile after login | Blocked without valid login. |
| Logged-out profile behavior | Route loads shell; client auth behavior still needs browser/manual validation with and without token. |
| Session reload/logout | Blocked without valid login. |

## Tour Validation Result

`/tour/Test_tour` fails on deployed staging with HTTP 500. Test tour data is now confirmed as slug `Test_tour`, numeric ID `664`, code `Test`, and title `Test Tour`. Use `664` wherever the backend API requires numeric `tour_id`; do not use `Test` as `tour_id`. The deep include API request used by the detail flow returns HTTP 500.

## Cart Validation Result

Blocked. No cart add/remove was run because the API appears to be production, the deployed tour route is unhealthy, and explicit owner approval for production-API cart mutation was not provided. If approved later, use numeric tour ID `664` for `tour_id` only after confirming the production API/cart mutation is safe and reversible.

## Checkout Safety Result

Checkout UI route `/cart/checkout` returned 200 on staging and local. No checkout form was submitted. No booking was created. No payment redirect was followed. Code inspection remains aligned to `POST /api/bookings` with `payment_method`, and no active `bookings/update/{id}` call exists.

## Payment No-Invoice Safety Result

No callback route was called with `invoice_id`. HTTP route smoke without invoice ID returned 200 for PayPal verify/canceled and Fawaterk success/pending/canceled routes. Browser network validation remains manual-required because browser tooling is unavailable without adding dependencies.

## reCAPTCHA Result

Raw HTML for staging `/auth/sign-in` did not include `recaptcha`, `grecaptcha`, or the Enterprise script. Current code loads reCAPTCHA only through `generateRecaptchaToken()` at submit time and returns `null` in `?no-third-party=1` mode. Backend reCAPTCHA acceptance remains blocked because no backend validation setting/owner confirmation was provided.

## Tracking Result

Tracking remains code-level only. GTM/GA public IDs are present in code, and the diagnostic `?no-third-party=1` mode remains the intended suppression mechanism. GTM Preview, GA4 DebugView, Google Ads test method, TikTok approval, and Clarity approval were not provided, so tracking validation is not passed.

## Remaining Blockers

- Sprint 11 applied frontend fixes for staging 500 candidates; redeploy and verify staging routes returning `500`.
- Securely provide the test account password at runtime for valid-login/profile validation.
- Confirm whether production-API cart mutation is approved and reversible before add/remove testing.
- Approve whether production-API cart testing may safely use tour ID `664`, and provide rental IDs if rent-car validation is in scope.
- Provide a valid coupon.
- Provide sandbox invoice IDs or a true sandbox API.
- Confirm backend reCAPTCHA expectations.
- Provide GTM/GA/Ads/TikTok/Clarity debug access or owner approval.
- Provide custom marketing sitemap decision and UI approval owner.

## Cutover Verdict

Production cutover remains blocked. Limited validation can proceed carefully, but full checkout/payment/coupon/rent-car validation remains blocked until real numeric IDs, valid coupon, rental IDs, sandbox payment data, and owner approvals are provided.
