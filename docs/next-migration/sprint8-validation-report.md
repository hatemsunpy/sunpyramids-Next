# Sprint 8 Validation Report

Date: 2026-06-23

Sprint 8 scope: inspect the original Nuxt project for safe staging/test/config data that can reduce manual access requests. No production code changes were made.

Follow-up application review: `docs/next-migration/nuxt-derived-values-applied.md` compares each public Nuxt-derived value with the current Next.js project. The safe values were already present, so no runtime/config code changes were required.

Backend discovery review: `docs/next-migration/sprint8-backend-access-discovery.md` inspected the Laravel backend folder. It confirmed several API contracts and private config risks, but did not provide enough owner data to unblock end-to-end staging validation.

## Discovery Result

| Area | Status |
|---|---|
| Nuxt access/config discovery report | Created: `docs/next-migration/sprint8-nuxt-access-discovery.md`. |
| Public frontend URL | Found: `https://sunpyramidstours.com`. |
| Nuxt demo/deployed frontend fallback | Found: `https://new-sunpyramids-demo.vercel.app`; requires confirmation before treating as staging. |
| Public backend/API fallback URL | Found: `https://sunpyramidtours.com/api/`. |
| reCAPTCHA public site key | Found. |
| GTM/GA public IDs | Found. |
| Representative tour slugs | Found in public Nuxt sitemap/Llms data. |
| Numeric tour ID | Blocked; must come from backend/API response. |
| Rent-car endpoint/payload shape | Found; real location/destination IDs blocked. |
| Valid coupon code | Blocked; no public test coupon found. |
| Invalid coupon code | Synthetic negative value proposed: `INVALID-TEST-CODE`. |
| Checkout billing payload | Field names found; safe synthetic values proposed. |
| Payment methods | Static Nuxt options `card` and `paypal` found; staging enablement blocked. |
| Sandbox invoice IDs | Blocked. |
| Backend reCAPTCHA acceptance | Blocked. |
| Conversion/debug access | Blocked. |
| Custom marketing sitemap decision | Blocked; Nuxt confirms detail endpoint only and public sitemap contains static marketing URLs without an approved source-of-truth. |
| UI parity approval owner | Blocked. |

## Applied Values Review

| Area | Result |
|---|---|
| Public frontend domain | Already present in Next SEO/layout/sitemap configuration. |
| Backend/API fallback domain | Already present in `lib/config.ts`; backend-domain separation preserved. |
| reCAPTCHA public site key/action/field | Already present; no secret key added; submit-time loading preserved. |
| GTM/GA IDs | Already present; no new conversion events added. |
| Tour/rental/checkout/payment references | Already documented or wired from confirmed Nuxt endpoints; no invented IDs, coupons, payment methods, or invoices added. |
| Possible demo/staging frontend | Not applied; still requires owner confirmation. |
| Custom marketing sitemap | Not applied; still blocked pending backend endpoint, approved manual list, or explicit exclusion. |

## Backend Discovery Result

| Area | Result |
|---|---|
| Backend folder | Inspected `D:\Sun Pyramids\sun pyramids tours - Web\sunpyramids-backend-main`. |
| API prefix | Confirmed `/api` from Laravel `RouteServiceProvider`. |
| Auth/session | Client API auth uses Passport bearer tokens on guard `auth:client`; CORS allows all origins and `supports_credentials` is false. |
| Frontend URL config | `.env` has `APP_FRONTEND_URL=https://sunpyramidstours.com`; `site_url()` reads `APP_FRONT_URL`, so payment/sitemap frontend URL config needs owner confirmation. |
| Booking/payment contract | Backend accepts `payment_method` in `POST /api/bookings`; no `bookings/update/{id}` API route was found in Laravel routes. |
| Cart remove contract | Backend `cart/remove/{item}` removes tour rows by `tour_id` and rental rows by rental row `id`. |
| reCAPTCHA | No backend validation logic or request rule for `recaptcha_token` was found. |
| Tracking | No backend GTM/GA/Ads/TikTok/Clarity debug or owner access was found. |
| Custom marketing sitemap | Backend has `GET /api/pages` and a sitemap generator with hardcoded static marketing routes; SEO/business decision still required. |
| Private values | PayPal credentials and admin seed password were found but redacted; secure remediation/handoff required. |

## Validation Commands

| Command | Result |
|---|---|
| `npm run lint` | Passed on 2026-06-23 after the backend discovery documentation update. |
| `npm run build` | Passed on 2026-06-23 after the backend discovery documentation update. |
| `php artisan route:list --path=api --columns=method,uri,name,action,middleware` | Not run successfully; `php` is not available on PATH in this shell. Routes were inspected directly from `routes/api.php`. |

## Sprint 8 Verdict

Sprint 8 cannot proceed to end-to-end staging validation. It can proceed only with limited preparation using public Nuxt-derived values until owners provide staging credentials, test data, sandbox IDs, and tracking/debug access.
