# Production Cutover Checklist

## Required Gates

| Gate | Status | Notes |
|---|---|---|
| Required migration docs completed | In progress | This folder contains the required discovery/validation docs. |
| Route parity | Passed for route existence | See `docs/nuxt-route-inventory.md`; customer flows still require validation. |
| UI parity | Partial | Sprint 2 captured Nuxt and Next screenshots for all priority pages desktop/mobile; parity not approved due documented gaps. |
| API-driven behavior | Partial | Public content mostly wired; Sprint 3 added first-pass customer-flow API layer. Staging validation, settings/menu/footer, and revenue flow parity remain pending. |
| SEO/domain validation | Partial | Code safeguards exist and Sprint 3 raw HTML checks passed locally for priority pages; staging still required. |
| Sitemap/robots validation | Partial | Sprint 2 added paginated tours/blogs plus categories/destinations/blog categories. Custom marketing page discovery still blocked by missing list endpoint. |
| Customer flows | Partial | Auth/profile/bookings/favourites/cart list/clear/checkout booking creation are client API-wired; staging validation and remaining parity gaps are blockers. |
| Payment callback safety | Partial pass | Client-only implementation exists and no-invoice browser validation passed; sandbox invoice validation pending. |
| Forms | Partial | Contact posts Nuxt-compatible payload with recaptcha token attempt; backend recaptcha/tracking and other forms pending. |
| `npm run lint` | Passed | Passed on 2026-06-22. |
| `npm run build` | Passed | Passed on 2026-06-22. |
| Lighthouse performance | Needs performance follow-up | Sprint 2 fast local run passed; Sprint 3 mobile Lighthouse reported lower scores under current CLI/throttling: home 51, tour 47. This is performance-only and does not clear functional cutover blockers. |
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
| Lighthouse mobile homepage | Needs optimization follow-up: performance 51, LCP 9.9s, CLS 0.029, TBT 1,100ms. |
| Lighthouse mobile representative tour | Needs optimization follow-up: performance 47, LCP 12.7s, CLS 0.002, TBT 1,030ms. |

## Sprint 3 Cutover Verdict

Production cutover remains blocked.

Blocking items:

1. Auth/profile/cart/checkout need staging validation with real credentials, cart state, and backend responses.
2. Checkout/payment still needs `bookings/update/{id}` parity and sandbox invoice validation.
3. UI parity is not approved yet.
4. Custom marketing sitemap discovery needs backend support or explicit exclusion approval.
5. reCAPTCHA backend acceptance and conversion/thank-you tracking parity require validation.
6. Current Lighthouse mobile performance needs investigation before final approval.

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
