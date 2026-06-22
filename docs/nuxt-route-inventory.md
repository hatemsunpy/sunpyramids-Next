# Nuxt Route Inventory and Cutover Gate

This inventory compares the original Nuxt route tree in `nuxt_sunpyramids/pages` with the current Next.js `app` router.

Status definitions:

- `already exists in Next`: route exists and renders in the current Next app.
- `requires backend/API validation`: route exists, but production cutover needs API/auth/payment behavior verified against backend contracts.
- `requires business decision`: route exists or is mapped, but product/payment/account behavior must be approved before cutover.
- `intentionally excluded`: no route should be excluded without explicit approval. Current inventory has no intentionally excluded Nuxt routes.

## Summary

Every Nuxt page file is currently accounted for in the Next route tree on this branch.

No Nuxt route is silently excluded.

Production cutover remains blocked until customer flows are validated end-to-end:

- Auth and password flows
- Profile/account area
- Wishlist/favourites
- Cart
- Checkout
- Payment callbacks
- Booking confirmation and booking history

## Public Marketing and Content Routes

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/` | `/` and `/[locale]` | already exists in Next | Home page renders cloned original-style shell and sections. |
| `/about-us` | `/about-us`, `/[locale]/about-us` | already exists in Next | Uses dashboard page data, metas, gallery/team-style sections. |
| `/accessible-travel` | `/accessible-travel`, `/[locale]/accessible-travel` | already exists in Next | Uses cloned impact-page layout. |
| `/blogs/all-blogs` | `/blogs/all-blogs`, `/[locale]/blogs/all-blogs` | already exists in Next | Blog list uses API data and cards. |
| `/blog/[slug]` | `/blog/[slug]`, `/[locale]/blog/[slug]` | already exists in Next | Blog detail exists; validate exact Nuxt sidebar/related behavior before final cutover. |
| `/contact-us` | `/contact-us`, `/[locale]/contact-us` | already exists in Next | Contact form posts to API. |
| `/events` | `/events`, `/[locale]/events` | already exists in Next | Event index uses category cards from API. |
| `/event/[slug]` | `/event/[slug]` | already exists in Next | Requires backend/API validation for category event details and related tours. |
| `/faqs` | `/faqs`, `/[locale]/faqs` | already exists in Next | FAQ list uses API data. |
| `/privacy-and-cookies` | `/privacy-and-cookies`, `/[locale]/privacy-and-cookies` | already exists in Next | Static dashboard content. |
| `/sustainability` | `/sustainability`, `/[locale]/sustainability` | already exists in Next | Uses cloned impact-page layout. |
| `/terms-and-conditions` | `/terms-and-conditions`, `/[locale]/terms-and-conditions` | already exists in Next | Static dashboard content. |
| `/book-egypt-trip` | `/book-egypt-trip` | already exists in Next | Marketing landing route exists; requires business decision for exact campaign parity. |

## Egypt Tours and Travel Guide Routes

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/tour/[id]` | `/tour/[slug]`, `/[locale]/tour/[slug]` | already exists in Next | Nuxt param is named `id`, but data uses slug-like identifiers. Validate booking panel parity. |
| `/trips` | `/trips` | already exists in Next | Search/results page exists; requires backend/API validation for filters, pagination, query params. |
| `/egypt-tours/[slug]` | `/egypt-tours/[...slug]`, `/[locale]/egypt-tours/[...slug]` | already exists in Next | Catch-all covers this route family. |
| `/egypt-tours/one-day-tours` | `/egypt-tours/one-day-tours`, localized catch-all | already exists in Next | Renders destination/category cards like Nuxt. |
| `/egypt-tours/one-day-tours/[slug]` | `/egypt-tours/one-day-tours/[slug]` via catch-all | already exists in Next | Requires backend/API validation for destination-specific tour filtering. |
| `/egypt-tours/multi-days-tours` | `/egypt-tours/multi-days-tours`, localized catch-all | already exists in Next | Covered by catch-all. |
| `/egypt-tours/multi-days-tours/[slug]` | `/egypt-tours/multi-days-tours/[slug]` via catch-all | already exists in Next | Requires backend/API validation for category-specific tour filtering. |
| `/egypt-tours/nile-cruises` | `/egypt-tours/nile-cruises`, localized catch-all | already exists in Next | Covered by catch-all. |
| `/egypt-tours/nile-cruises/[slug]` | `/egypt-tours/nile-cruises/[slug]` via catch-all | already exists in Next | Requires backend/API validation for child category behavior. |
| `/egypt-tours/shore-excursions` | `/egypt-tours/shore-excursions`, localized catch-all | already exists in Next | Covered by catch-all. |
| `/egypt-tours/plan-your-egypt-journy` | `/egypt-tours/plan-your-egypt-journy` | already exists in Next | Alias route exists. Spelling matches Nuxt route. |
| `/egypt-tours/tailor-your-egypt-trip` | `/egypt-tours/tailor-your-egypt-trip` | already exists in Next | Alias route exists. |
| `/egypt-travel-guide` | `/egypt-travel-guide` | already exists in Next | Uses blog category API. |
| `/egypt-travel-guide/[cate]` | `/egypt-travel-guide/[cate]` | already exists in Next | Requires backend/API validation for category children/blogs. |
| `/egypt-travel-guide/[cate]/[id]` | `/egypt-travel-guide/[cate]/[id]` | already exists in Next | Requires backend/API validation for nested category/blog lists. |

## Planner, Rental, and Lead Flows

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/make-your-trip` | `/make-your-trip`, `/[locale]/make-your-trip` | already exists in Next | UI exists. Requires backend/API validation for full multi-step submission parity. |
| `/make_your_trip` | `/make_your_trip` | already exists in Next | Legacy alias exists and maps to make-your-trip page. |
| `/rent-car` | `/rent-car`, `/[locale]/rent-car` | already exists in Next | UI exists. Requires backend/API validation for pricing/route submission. |

## Customer Account, Auth, Cart, and Checkout

These routes are required customer flows. They are currently represented in Next, but production cutover is blocked until they are validated end-to-end with backend APIs, auth cookies, protected-route behavior, and form submissions.

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/auth/sign-in` | `/auth/sign-in` | requires backend/API validation | Route exists with cloned UI. Must validate login API, token cookie, redirects, errors. |
| `/auth/sign-up` | `/auth/sign-up` | requires backend/API validation | Route exists with cloned UI. Must validate registration API and validation messages. |
| `/auth/forget-password` | `/auth/forget-password` | requires backend/API validation | Route exists with cloned UI. Must validate password reset request API. |
| `/auth/reset-password` | `/auth/reset-password` | requires backend/API validation | Route exists with cloned UI. Must validate reset token flow. |
| `/auth/create-password` | `/auth/create-password` | requires backend/API validation | Route exists with cloned UI. Must validate backend flow and route params/query requirements. |
| `/auth/confirm-code` | `/auth/confirm-code` | requires backend/API validation | Route exists with cloned UI. Must validate email/code verification API. |
| `/profile` | `/profile` | requires backend/API validation | Route exists. Must validate auth guard and user profile API. |
| `/profile/bookings` | `/profile/bookings` | requires backend/API validation | Route exists. Must validate bookings API and order history display. |
| `/profile/favourites` | `/profile/favourites` | requires backend/API validation | Route exists. Must validate wishlist API and remove/add behavior. |
| `/profile/settings` | `/profile/settings` | requires backend/API validation | Route exists. Must validate account update API. |
| `/cart` | `/cart` | requires backend/API validation | Route exists. Must validate cart storage, edit/remove, tour/rent item support. |
| `/cart/checkout` | `/cart/checkout` | requires backend/API validation | Route exists. Production cutover blocked until checkout, billing, payment selection, and booking creation are validated. |

## Payment and Booking Confirmation

Payment routes must not trigger payment mutation APIs server-side. In the current Next implementation, payment update calls are client-side only after hydration and only when `invoice_id` exists in the browser URL.

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/order/payment/callback/paypal/verify` | `/order/payment/callback/paypal/verify` | requires backend/API validation | Calls `payments/paypal/capture?invoice_id=...` client-side only. |
| `/order/payment/callback/paypal/canceled` | `/order/payment/callback/paypal/canceled` | requires backend/API validation | Calls `payments/paypal/cancel?invoice_id=...` client-side only. |
| `/order/payment/callback/fawaterk/success` | `/order/payment/callback/fawaterk/success` | requires backend/API validation | Calls `payments/fawaterk/update/invoice?invoice_id=...` client-side only. |
| `/order/payment/callback/fawaterk/pending` | `/order/payment/callback/fawaterk/pending` | requires backend/API validation | Calls `payments/fawaterk/update/invoice?invoice_id=...` client-side only. |
| `/order/payment/callback/fawaterk/canceled` | `/order/payment/callback/fawaterk/canceled` | requires backend/API validation | Calls `payments/fawaterk/update/invoice?invoice_id=...` client-side only. |
| `/thankful` | `/thankful` | already exists in Next | Booking confirmation/thank-you page exists. Validate final booking copy and redirect targets. |

## Intentionally Excluded Routes

None.

No Nuxt route should be excluded from production cutover unless product/engineering explicitly approves it here.

## Production Cutover Blockers

Before cutover, verify these flows in a staging environment connected to the real backend:

1. Auth: sign in, sign up, forgot/reset/create password, confirm code.
2. Protected account pages: profile, bookings, favourites, settings.
3. Wishlist: add/remove and persisted state.
4. Cart: add tour, add rent car, edit item, remove item, persist after reload/login.
5. Checkout: billing, payment method, booking creation, validation errors.
6. Payment callbacks: PayPal capture/cancel and Fawaterk update invoice, with valid real/sandbox invoice IDs.
7. Booking confirmation: final success route, email/invoice display, booking history update.

Cutover should remain blocked if any required checkout, payment, booking confirmation, or auth flow is missing or unvalidated.
