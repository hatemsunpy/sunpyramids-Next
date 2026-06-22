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
| Payment callbacks call API client-side only | `components/PaymentCallbackStatus.tsx` is `"use client"` and calls in `useEffect`. | Passed in code; backend sandbox pending. |

## Confirmed Gaps / Pending Validation

| Area | Gap | Required action |
|---|---|---|
| Settings/header/footer | Nuxt fetches `settings`, `countries`, `currencies`; Next may use static shell values. | Confirm whether dashboard-managed header/footer/currency must be API-driven before cutover. |
| Auth | Nuxt posts login/register/password endpoints; Next routes are UI clones. | Implement/validate endpoint behavior if required for cutover. |
| Profile | Nuxt fetches profile bookings/favourites and patches settings; Next routes are UI clones. | Implement/validate authenticated APIs. |
| Cart | Nuxt has cart list/edit/remove/coupon APIs; Next route is UI clone. | Implement/validate cart behavior. |
| Checkout | Nuxt creates bookings and updates booking/payment state; Next route is UI clone. | Critical cutover blocker. |
| Make Your Trip | Nuxt posts `custom/trips`; Next route needs full flow validation. | Implement/validate. |
| Rent Car | Nuxt fetches locations/destinations and appends rentals to cart; Next route needs full flow validation. | Implement/validate. |
| Search/trips | Nuxt filters categories/destinations/tours with query params; Next representative route exists. | Validate filters, pagination, query behavior. |

## Cutover Status

Not approved. Public content API behavior is partially implemented, and local route smoke tests passed for the priority route set. Customer/revenue flows require staging backend validation.

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
