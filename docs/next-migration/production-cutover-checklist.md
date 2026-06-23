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
| Checkout/booking validation | Blocked; cannot validate booking creation, `bookings/update/{id}`, payment URL, redirect, or profile booking appearance without staging cart/payment data. |
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
