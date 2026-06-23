# Sprint 6 Validation Report

Date: 2026-06-23

Sprint 6 goal: validate customer and revenue flows end to end with staging credentials and sandbox data, document remaining non-code blockers, and avoid UI polish until revenue validation is passed or formally blocked.

## Access and Test Data Checklist

| Required data | Available | Evidence / missing item | Impact |
|---|---|---|---|
| Staging frontend URL | No | No value provided in the Sprint 6 brief or workspace environment. | Staging route validation blocked. |
| Staging backend/API base URL | No | No value provided; code still defaults to backend/API domain `https://sunpyramidtours.com/api/`. | Staging API validation blocked. |
| Test user account | No | No username/email provided. | Auth/profile/cart/checkout validation blocked. |
| Test user password | No | No password provided. | Auth/profile/cart/checkout validation blocked. |
| Test admin/dashboard access | No | No admin/dashboard credential provided. | Dashboard SEO/content parity confirmation blocked. |
| Test tour slug | Partial | Representative production/API slug can be discovered locally, but no approved staging slug provided. | Staging tour booking validation blocked. |
| Test tour ID | No | No approved staging tour ID provided. | Cart tour append/edit validation blocked. |
| Rent-car route/location data | No | No approved staging pickup/dropoff data provided. | Rent-car cart validation blocked. |
| Valid coupon code | No | No approved coupon code provided. | Coupon success validation blocked. |
| Invalid coupon code | No | Can use arbitrary invalid input only after staging target is confirmed. | Coupon error validation blocked. |
| Test cart item data | No | No populated cart or item ID provided. | Remove/edit/checkout validation blocked. |
| Checkout billing data | No | No approved test billing profile provided. | Booking creation validation blocked. |
| Payment method test configuration | No | No approved sandbox method/config provided. | Checkout redirect validation blocked. |
| PayPal sandbox invoice ID | No | No invoice ID provided. | PayPal callback sandbox validation blocked. |
| Fawaterk sandbox invoice ID | No | No invoice ID provided. | Fawaterk callback sandbox validation blocked. |
| reCAPTCHA staging/site key | No | No staging key provided. | Backend acceptance validation blocked. |
| Backend reCAPTCHA acceptance settings | No | No backend setting or test mode details provided. | Valid/missing/invalid token validation blocked. |
| GTM preview/debug access | No | No preview access provided. | Conversion tracking validation blocked. |
| GA4 debug access | No | No debug access provided. | Analytics validation blocked. |
| Google Ads conversion test method | No | No test method provided. | Paid conversion validation blocked. |
| TikTok/Clarity owner or approval contact | No | No owner/contact approval provided. | Third-party performance approval blocked. |

## Staging Validation Status

| Area | Status | Evidence |
|---|---|---|
| Auth routes | Blocked | `/auth/sign-in`, `/auth/sign-up`, `/auth/forget-password`, `/auth/reset-password`, `/auth/create-password`, and `/auth/confirm-code` are code-wired from Sprint 5, but no staging URL or test account was available. |
| Profile routes | Blocked | `/profile`, `/profile/settings`, `/profile/bookings`, and `/profile/favourites` require a real authenticated staging account. |
| Cart | Blocked | Tour append/edit/remove, coupon validation, totals, guest/auth persistence, and cart state require staging cart data and coupon codes. |
| Rent-car cart flow | Blocked | Requires approved staging location/destination data and cart behavior. |
| Checkout/booking | Blocked | Requires staging cart, billing data, payment method config, and backend booking responses. |
| Payment callbacks | Partial code pass; sandbox blocked | No-invoice safety remains code-level safe from prior validation; valid/invalid/duplicate invoice behavior cannot be tested without sandbox IDs. |
| Backend reCAPTCHA acceptance | Blocked | Submit-time token generation exists, but valid/missing/invalid backend acceptance cannot be tested without staging settings/key. |
| Conversion/tracking | Blocked | Code-level GTM/GA parity exists; GTM preview, GA4 debug, Google Ads, TikTok, and Clarity validation require account access/owners. |
| Third-party performance approval | Blocked | Decision remains with marketing/tag owners; engineering must not remove or disable tags without approval. |
| Custom marketing sitemap | Blocked | No backend list endpoint, alternate slug source, approved manual slug list, or explicit exclusion was provided. |
| UI parity approval | Blocked | Screenshot review can continue, but broad UI fixes are intentionally deferred until revenue validation is passed or blocked by missing credentials. |
| SEO/domain validation | Local/code partial | Existing code keeps public SEO URLs on `https://sunpyramidstours.com` and backend API on `https://sunpyramidtours.com`; staging raw HTML validation is blocked without staging URLs. |

## Local Validation Performed

This Sprint 6 pass did not change production code. Local validation was rerun against a production build at `http://127.0.0.1:3106`:

| Check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Route smoke | Passed HTTP 200 for `/`, `/egypt-tours/one-day-tours`, representative `/tour/[slug]`, `/contact-us`, `/cart`, `/cart/checkout`, `/make-your-trip`, `/rent-car`, `/thankful`, auth routes, profile routes, no-invoice PayPal callback, `/sitemap.xml`, and `/robots.txt`. |
| Browser checks | Passed in Chrome diagnostic mode for home, tour, contact, make-your-trip, rent-car, cart, checkout, sign-in, profile, and no-invoice payment callback. No console errors, no page-load reCAPTCHA request on form pages, and no payment API request without `invoice_id`. |
| SEO/domain raw HTML | Passed for public routes `/`, `/egypt-tours/one-day-tours`, representative `/tour/[slug]`, `/contact-us`, `/make-your-trip`, and `/rent-car`. Cart and checkout keep basic private-flow metadata. No backend SEO URL leak found in canonical/OG URL checks. |
| Lighthouse home normal | 44, LCP 9.3s, CLS 0.029, TBT 1,400ms. Not approved; normal mode remains third-party/TBT-heavy. |
| Lighthouse home diagnostic | 89, LCP 3.7s, CLS 0.029, TBT 50ms. |
| Lighthouse tour normal | 66, LCP 2.9s, CLS 0.002, TBT 1,090ms. Not approved; normal mode remains third-party/TBT-heavy. |
| Lighthouse tour diagnostic | 90, LCP 2.8s, CLS 0.002, TBT 80ms. |

Lighthouse JSON reports were written under `output/lighthouse/`. Lighthouse emitted Windows temp-profile cleanup `EPERM` warnings after report generation, but metrics were written and parsed.

## Production Cutover Verdict

Production cutover remains blocked.

Blocking reasons:

1. Staging auth/profile/cart/checkout validation cannot be performed without staging URLs and a test account.
2. Checkout/payment flow cannot be validated without cart data, billing data, payment method configuration, and sandbox invoice IDs.
3. Backend reCAPTCHA acceptance cannot be validated without staging key/settings.
4. Conversion and thank-you tracking cannot be validated without GTM/GA/ads debug access.
5. Third-party normal-mode performance still needs marketing/tag-owner approval or optimization.
6. Custom marketing sitemap coverage still needs backend list support, another confirmed slug source, approved manual slugs, or explicit exclusion.
7. UI parity is not approved.

## Recommended Sprint 7 Scope

1. Provide staging frontend/backend URLs, test account, test cart/tour/rental data, coupon codes, checkout billing data, and sandbox payment invoice IDs.
2. Run auth, profile, cart, rent-car, checkout, and payment callback validation against staging with browser/network evidence.
3. Validate backend reCAPTCHA acceptance for contact, make-your-trip, checkout if required, rent-car if required, and auth if required.
4. Run GTM Preview, GA4 DebugView, Google Ads conversion test method, and TikTok/Clarity owner review for conversion parity.
5. Resolve custom marketing sitemap by backend endpoint, confirmed alternate slug source, approved manual slugs, or explicit exclusion.
6. After revenue blockers are passed or formally blocked, run UI parity screenshot review and fix only small confirmed mismatches.
7. Rerun `npm run lint`, `npm run build`, route smoke, browser checks, SEO raw HTML checks, and Lighthouse normal/diagnostic before any cutover decision.
