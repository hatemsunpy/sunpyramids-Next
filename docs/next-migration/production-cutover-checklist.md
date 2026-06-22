# Production Cutover Checklist

## Required Gates

| Gate | Status | Notes |
|---|---|---|
| Required migration docs completed | In progress | This folder contains the required discovery/validation docs. |
| Route parity | Passed for route existence | See `docs/nuxt-route-inventory.md`; customer flows still require validation. |
| UI parity | Partial | Sprint 2 captured Nuxt and Next screenshots for all priority pages desktop/mobile; parity not approved due documented gaps. |
| API-driven behavior | Partial | Public content mostly wired and local route smoke passed; customer flows/settings/menu/footer need validation. |
| SEO/domain validation | Partial | Code safeguards exist and homepage raw HTML passed local checks; all priority pages/staging still required. |
| Sitemap/robots validation | Partial | Sprint 2 added paginated tours/blogs plus categories/destinations/blog categories. Custom marketing page discovery still blocked by missing list endpoint. |
| Customer flows | Pending | Auth/profile/wishlist/cart/checkout are cutover blockers. |
| Payment callback safety | Partial | Client-only implementation exists; safety report required and backend validation pending. |
| Forms | Pending | Contact posts to API; recaptcha/tracking and other forms pending. |
| `npm run lint` | Passed | Passed on 2026-06-22. |
| `npm run build` | Passed | Passed on 2026-06-22. |
| Lighthouse homepage/tour detail | Passed locally | Homepage performance 100, LCP 0.8s, CLS 0, TBT 50ms. Representative tour performance 98, LCP 2.2s, CLS 0.004, TBT 0ms. |
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
