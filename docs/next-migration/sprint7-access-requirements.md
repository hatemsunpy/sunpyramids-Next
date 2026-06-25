# Sprint 7 Access Requirements

Date: 2026-06-23

Sprint 7 is access-first. Staging validation cannot pass until the required URLs, credentials, test data, sandbox IDs, and owner approvals are available. No secrets should be committed to this repository; this file records availability and blockers only.

## Required Access and Test Data

| Item | Available | Owner | Source | Date received | Blocker | Notes |
|---|---|---|---|---|---|---|
| Staging frontend URL | Partial | Engineering / hosting owner | Nuxt `APP_URL` fallback found in `nuxt_sunpyramids/nuxt.config.ts` | 2026-06-23 | Yes | Nuxt fallback is `https://new-sunpyramids-demo.vercel.app`; this requires owner confirmation before treating it as current staging. |
| Staging backend/API base URL | Partial | Backend / engineering owner | Nuxt `API_URL` fallback found in `nuxt_sunpyramids/nuxt.config.ts` | 2026-06-23 | Yes | Nuxt fallback is `https://sunpyramidtours.com/api/`; no separate staging API URL was found. |
| Test customer account email | No | Support / QA / backend owner | Not provided | N/A | Yes | Required for valid login, profile, cart, checkout, and bookings. |
| Test customer account password | No | Support / QA / backend owner | Not provided | N/A | Yes | Required for authenticated flow validation. |
| Test admin/dashboard access | No | Dashboard / content owner | Not provided | N/A | Yes | Required if dashboard SEO/content parity must be confirmed from source records. |
| Test tour slug | Partial | Product / QA owner | Nuxt public sitemap and `Llms.txt` | 2026-06-23 | Yes | Public slugs are available, but staging availability and selected validation slug still require confirmation. |
| Test tour ID | No | Product / QA owner | Nuxt confirms `tour_id` field only | 2026-06-23 | Yes | Required where `cart/tours/append` needs numeric ID; no fixed numeric fixture was found. |
| Test rent-car location/destination data | Partial | Product / QA owner | Nuxt rent-car components | 2026-06-23 | Yes | Endpoints and payload shape found; real staging location/destination IDs still required. |
| Valid coupon code | No | Marketing / revenue owner | Not provided | N/A | Yes | Required for `coupons/{code}/validate` success behavior. |
| Invalid coupon code | Yes, synthetic | Marketing / QA owner | Sprint 8 discovery | 2026-06-23 | No | Use `INVALID-TEST-CODE` for negative testing only after staging target is confirmed. |
| Test checkout billing details | Partial, synthetic | QA / revenue owner | Nuxt checkout field names plus synthetic values | 2026-06-23 | Yes | Safe synthetic values are documented in `sprint8-nuxt-access-discovery.md`; backend may still require API-derived country/state values. |
| Enabled payment methods on staging | Partial | Payments / backend owner | Nuxt checkout payment step | 2026-06-23 | Yes | Static Nuxt UI options are `card` and `paypal`; card maps to `payment_method_id: 9`. Actual staging gateway enablement is still blocked. |
| PayPal sandbox invoice ID | No | Payments owner | Not provided | N/A | Yes | Required for PayPal callback valid/invalid/duplicate behavior. |
| Fawaterk sandbox invoice ID | No | Payments owner | Not provided | N/A | Yes | Required for Fawaterk success/pending/canceled behavior. |
| reCAPTCHA site key | Partial | Backend / security owner | Nuxt `nuxt.config.ts` and current Next code | 2026-06-23 | Yes | Public Enterprise site key is available; need confirmation it is accepted for staging. |
| reCAPTCHA Enterprise configuration | Partial | Backend / security owner | Nuxt reCAPTCHA composable and form payloads | 2026-06-23 | Yes | Enterprise script, action `submit`, and `recaptcha_token` field are confirmed; backend accept/reject settings remain missing. |
| Backend reCAPTCHA acceptance settings | No | Backend / security owner | Not provided | N/A | Yes | Required to test valid, missing, and invalid tokens. |
| GTM preview access | Partial | Marketing / tag owner | Nuxt `app.vue` | 2026-06-23 | Yes | Container ID `GTM-KDF33T7` found; preview access not found. |
| GA4 debug access | Partial | Marketing / analytics owner | Nuxt `app.vue` | 2026-06-23 | Yes | Measurement ID `G-NKZ6W32C4J` found; DebugView access not found. |
| Google Ads conversion test method | No | Marketing / ads owner | Not provided | N/A | Yes | Required for paid conversion validation. |
| TikTok/Clarity owner approval or debug access | No | Marketing / product analytics owner | Not provided | N/A | Yes | Required before changing or approving tag behavior. |
| Custom marketing pages sitemap decision | Partial | Business / SEO owner | Nuxt marketing page component and public sitemap | 2026-06-23 | Yes | Nuxt confirms detail endpoint only; public sitemap has static marketing URLs but no approved source-of-truth. |

## Environment Configuration Check

| Area | Current implementation | Sprint 7 status |
|---|---|---|
| Frontend public base URL | `NEXT_PUBLIC_APP_URL` in `lib/seo.ts` and `app/layout.tsx`; fallback is `https://sunpyramidstours.com`. | Code-level pass. No staging override provided. Public SEO URLs must remain frontend-domain. |
| Backend/API base URL | `NEXT_PUBLIC_API_URL` in `lib/config.ts`; fallback is `https://sunpyramidtours.com/api/`. | Code-level pass. No staging API value provided. Backend domain is not a typo. |
| reCAPTCHA key | Public site key is currently hardcoded in `lib/recaptcha.ts`; script loads only on submit unless diagnostic mode is enabled. | Needs staging/backend acceptance confirmation. Do not commit secret keys. |
| GTM/GA | GTM `GTM-KDF33T7` is loaded by `components/ThirdPartyScripts.tsx` and noscript in `app/layout.tsx`; GA4 `G-NKZ6W32C4J` is loaded by `ThirdPartyScripts`. | Code-level parity only; debug access not provided. |
| Diagnostic no-third-party flag | `?no-third-party=1` suppresses client GTM/GA, TrustIndex, and reCAPTCHA script injection. | Code-level pass for local diagnostics; must not change SEO raw HTML. |
| Image/media domains | `next.config.ts` allows `sunpyramidtours.com`, `sunpyramidstours.com`, and `new-sunpyramids-demo.vercel.app`. | Needs staging media domain decision if staging uses another host. |
| Payment callback domain behavior | `PaymentCallbackStatus` calls mutation-like endpoints client-side only with browser `invoice_id`; `CustomerFlows` payment redirects are allow-listed for PayPal, Fawaterk, backend, and frontend domains. | Code-level safety pass; sandbox invoice behavior blocked. |
| Public HTML secrets | Auth tokens are client cookies and private data loads client-side; no staging secrets are present in the workspace. | Continue checking raw HTML before cutover. |

## Sprint 8 Applied-Values Follow-Up

Sprint 8 compared the Nuxt-derived public values with the current Next.js implementation. The public frontend URL, backend/API fallback, reCAPTCHA public site key/action/field, GTM ID, GA4 ID, payment callback endpoints, and rent-car/checkout payload references were already present where appropriate. No private values were added and no blocked staging/test data was invented.

## Sprint 8 Backend Discovery Follow-Up

Laravel backend discovery added these access facts:

- Client auth uses Passport bearer tokens with `auth:client`.
- CORS is open to all origins and does not support credentials, so protected Next client calls should continue using bearer tokens rather than cookie credentials.
- Backend `.env` contains `APP_FRONTEND_URL=https://sunpyramidstours.com`, while `site_url()` reads `APP_FRONT_URL`; payment callback and backend sitemap frontend URL configuration needs owner confirmation.
- Seeded admin credentials exist in `database/seeders/AdminSeeder.php`; password is private and redacted.
- PayPal credentials are present in `config/paypal.php`; values are private and redacted.
- No safe test customer, valid coupon, real tour ID, real rental IDs, or sandbox invoice IDs were found.
- No backend reCAPTCHA validation logic was found.

## Access Verdict

Sprint 7 staging validation remains blocked after Sprint 8 Nuxt discovery. Public identifiers and payload shapes were recovered from `nuxt_sunpyramids/`, but no private credentials, confirmed staging URLs, valid coupon, sandbox invoice IDs, or analytics/debug access were found.

## Sprint 10 Limited Production-API Access Update

Date: 2026-06-25

| Item | Sprint 10 status | Notes |
|---|---|---|
| Frontend staging URL | Available | `https://sunpyramids-next.vercel.app/` responds, but some required public routes return `500` on the deployed staging build. |
| API URL | Available with production risk | Confirmed as `https://sunpyramidtours.com/api/`. Treat as production API; do not create bookings, invoices, or irreversible data without explicit owner approval. |
| Test customer account email | Available | Email received. Password is provided separately by owner and must not be written to docs or committed. |
| Test customer account password | Partially available outside repo | Not present in this thread or in checked local secure env variables. Valid-login automation remains blocked until supplied securely at runtime. |
| Dashboard verifier | Available | Assigned verifier is available for dashboard-side confirmation if a safe operation needs review. |
| Test tour slug | Available | `Test_tour`; public route target is `/tour/Test_tour`. |
| Numeric tour ID | Available | Use `664` wherever the backend API requires numeric `tour_id`. Tour code is `Test`; do not use `Test` as `tour_id`. Deep include detail API currently returns `500`. |
| Valid coupon | Blocked | Not provided; do not run coupon success validation. |
| Rental IDs | Blocked | Not provided; do not run rent-car append validation against production API. |
| Sandbox invoice IDs | Blocked | Not provided; do not run payment callback mutation APIs with `invoice_id`. |
| Backend reCAPTCHA confirmation | Blocked | No backend validator was found previously; owner/security confirmation still required. |
| Tracking debug access | Blocked | GTM/GA/Ads/TikTok/Clarity debug access not provided. |
| UI approval owner | Blocked | Not provided separately. |
