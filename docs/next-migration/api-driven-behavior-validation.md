# API-Driven Behavior Validation

## Confirmed In Code

| Requirement | Evidence | Status |
|---|---|---|
| Backend/API domain remains separate | `lib/config.ts` defaults `API_BASE` to `https://sunpyramidtours.com/api/`. | Passed. |
| Public SEO domain remains frontend | `lib/seo.ts` defaults `FRONTEND_ORIGIN` to `https://sunpyramidstours.com`. | Passed in code; raw HTML pending. |
| Server fetch passes locale | `lib/api.ts` sends `X-Localize`. | Passed in code; backend response pending. |
| Server fetch can pass auth token | `lib/api.ts` reads `sunpyramids-token` cookie. | Passed in code; auth flow pending. |
| Public pages fetch API data | `lib/data.ts` uses pages/tours/blogs/categories/destinations/faqs endpoints. | Partial pass. |
| Client contact form posts to backend | `components/ContactForm.tsx` posts `contact-requests`. | Partial pass; recaptcha/tracking pending. |
| Client customer flow API layer | `components/CustomerFlows.tsx` wires auth, profile, bookings, favourites, cart list/clear, and checkout booking creation to confirmed endpoints. | Code pass; staging credentials/data pending. |
| Payment callbacks call API client-side only | `components/PaymentCallbackStatus.tsx` is `"use client"` and calls in `useEffect`. | Passed in code; backend sandbox pending. |
| Homepage hydration error fixed | `components/BlogCard.tsx` renders dashboard blog summaries as plain text after stripping HTML, avoiding browser/React HTML mismatch inside the card link. | Browser console pass; no React #418 observed. |

## Confirmed Gaps / Pending Validation

| Area | Gap | Required action |
|---|---|---|
| Settings/header/footer | Nuxt fetches `settings`, `countries`, `currencies`; Next may use static shell values. | Confirm whether dashboard-managed header/footer/currency must be API-driven before cutover. |
| Auth | Next now posts login/register/password endpoints. | Validate with staging credentials and expired/invalid session cases. |
| Profile | Next now patches profile and fetches bookings/favourites client-side after token check. | Validate with staging account data. |
| Cart | Next now fetches cart list and clears cart; edit/remove/coupon remain pending. | Complete cart parity and validate with populated cart state. |
| Checkout | Next now posts `bookings` and redirects to returned payment URL; `bookings/update/{id}` remains pending. | Critical staging cutover blocker. |
| Make Your Trip | Nuxt posts `custom/trips`; Next route needs full flow validation. | Implement/validate. |
| Rent Car | Nuxt fetches locations/destinations and appends rentals to cart; Next route needs full flow validation. | Implement/validate. |
| Search/trips | Nuxt filters categories/destinations/tours with query params; Next representative route exists. | Validate filters, pagination, query behavior. |

## Cutover Status

Not approved. Public content API behavior is partially implemented, customer/revenue flows have a first-pass client API layer, and local route smoke tests passed for the Sprint 3 route set. Customer/revenue flows still require staging backend validation.

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
