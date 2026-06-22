# Forms and Flows Map

Source of truth: Nuxt components/pages and current Next routes/components.

## Public Lead Forms

| Flow | Nuxt source | Endpoint(s) | Current Next | Status |
|---|---|---|---|---|
| Contact form | `components/ContactUs/Form.vue` | `POST contact-requests` with recaptcha token | `components/ContactForm.tsx` posts `contact-requests` with `subject`, `type`, `country`, and `recaptcha_token` | Implemented; backend recaptcha/tracking parity pending. |
| Landing/contact forms | `components/BookEgyptTrip/ContactUs.vue`, `EgyptTripLanding*`, `MarktingPages/ContactUs.vue`, `Home/NeedHelp.vue` | `POST contact-requests` | Generic cloned route/contact form surfaces | Needs route-specific field parity validation. |
| Event booking/lead | `components/Event/RightPanal/Book.vue` | `POST contact-requests` | Event detail page exists | Needs form parity validation. |
| Make Your Trip | `components/MakeYourTrip/Form/*` | `POST custom/trips` | Route/UI clone exists | Functional flow pending. |
| Rent Car | `components/RentACar/Form/*` | `locations`, `car/rental/available/destinations`, `car/rental/search/for/route`, `cart/rentals/append` | Route/UI clone exists | Functional flow pending. |

## Booking, Cart, and Checkout

| Flow | Nuxt source | Endpoint(s) | Current Next | Status |
|---|---|---|---|---|
| Tour booking panel | `components/Tours/RightPanal/index.vue` | `cart/tours/append`, wishlist toggle, tour options/seasons | Tour detail route exists | Booking panel parity pending. |
| Cart list/edit/remove | `components/Cart/steps/Cart/*` | `cart/list`, `cart/remove/{id}`, `cart/clear`, `coupons/{code}/validate`, `cart/tours/append` | `/cart` uses `CartFlow` client API layer for list/clear | Partial implementation; edit/remove/coupon/staging validation pending. |
| Checkout billing/payment | `components/Checkout/*` | `POST bookings`, `POST bookings/update/{id}` | `/cart/checkout` posts `bookings` from client and redirects to returned payment URL | Partial implementation; `bookings/update/{id}` and staging payment validation pending. |
| Thank-you / confirmation | `pages/thankful.vue` | Redirect/result display | `/thankful` exists | Copy/redirect/history validation pending. |

## Auth and Customer Account

| Flow | Nuxt source | Endpoint(s) | Current Next | Status |
|---|---|---|---|---|
| Sign in | `components/Auth/SignIn.vue` | `POST auth/login` | `/auth/sign-in` posts login and stores `sunpyramids-token`, `sunpyramids-user`, optional `sunpyramids-email` | Implemented; staging credential validation pending. |
| Sign up | `components/Auth/SignUp.vue` | `POST auth/register` | `/auth/sign-up` posts registration and redirects to sign-in | Implemented; backend validation pending. |
| Forgot password | `components/Auth/ForgetPassword.vue` | `POST auth/password/forget` | `/auth/forget-password` posts email and redirects to confirm-code | Implemented; backend validation pending. |
| Confirm code | `components/Auth/ConfirmCode.vue` | `POST auth/password/otp/verify`, `POST auth/password/forget` | `/auth/confirm-code` verifies OTP and redirects to create-password | Implemented; resend flow still pending. |
| Create password | `components/Auth/CreatePassword.vue` | `POST auth/password/reset` | `/auth/create-password` posts email/OTP/password | Implemented; backend validation pending. |
| Reset password | `components/Auth/ResetPassword.vue` | `POST client/reset-password` | `/auth/reset-password` posts email/token/password | Implemented; backend validation pending. |
| Profile | `pages/profile.vue`, `pages/profile/settings.vue` | `PATCH profile` | `/profile`, `/profile/settings` load cookie user client-side and patch profile | Implemented; staging auth validation pending. |
| Bookings | `pages/profile/bookings.vue` | `bookings?page_limit=200&includes=currency,tours` | `/profile/bookings` fetches after client auth cookie check | Implemented; staging auth/data validation pending. |
| Favourites | `pages/profile/favourites.vue` | `wishlist?page=1&page_limit=200`, wishlist toggle | `/profile/favourites` fetches wishlist; toggle helper added | Partial implementation; card integration/staging validation pending. |

## Payment Callback Flows

| Flow | Nuxt endpoint | Current Next | Status |
|---|---|---|---|
| PayPal verify | `payments/paypal/capture?invoice_id=...` | Client-only call in `PaymentCallbackStatus` | SSR-safe implementation exists; backend validation pending. |
| PayPal canceled | `payments/paypal/cancel?invoice_id=...` | Client-only call in `PaymentCallbackStatus` | SSR-safe implementation exists; backend validation pending. |
| Fawaterk success/pending/canceled | `payments/fawaterk/update/invoice?invoice_id=...` | Client-only call in `PaymentCallbackStatus` | SSR-safe implementation exists; backend validation pending. |

## Cutover Blockers

- Auth, profile, wishlist, cart, checkout, payment, and booking confirmation now have a first-pass client API layer where listed above, but still require staging backend validation.
- Recaptcha and conversion tracking parity must be confirmed before replacing production Nuxt.

## Sprint 3 Customer Flow Implementation

Date: 2026-06-22

Confirmed Nuxt sources inspected before implementation: `components/Auth/*`, `pages/profile*.vue`, `components/Cart/steps/Cart/*`, `components/Checkout/index.vue`, `components/Tours/RightPanal/index.vue`, `components/Shared/TourCard.vue`, and `components/ContactUs/Form.vue`.

Implemented in Next:

- `components/CustomerFlows.tsx` wires auth/password/profile/bookings/favourites/cart/checkout behavior to the Nuxt-confirmed endpoints.
- Private profile, bookings, favourites, cart, and checkout state is loaded client-side after hydration and is not exposed in public server HTML.
- `lib/client-api.ts` now supports client auth headers, `GET`, `POST`, `PATCH`, `PUT`, and `DELETE` helpers using the existing backend API base.
- `components/ContactForm.tsx` now submits Nuxt-compatible contact payload fields and redirects to `/thankful?name=...`.

Still blocked:

- No staging credentials, valid customer account, populated cart, checkout test data, or sandbox payment invoice IDs were available in this run.
- Rent car, make-your-trip, coupon, cart item edit/remove, full booking panel options/seasons, and `bookings/update/{id}` remain pending implementation/validation.

## Sprint 2 Backend Validation Result

Date: 2026-06-22

Environment tested: local Next production build at `http://localhost:3000`, connected to the configured live backend API domain. No staging user credentials, valid cart state, or sandbox payment invoice IDs were available in this run.

| Route | Nuxt endpoint(s) | Method | Auth/cookie behavior | Success result | Error result | Redirect behavior | Matches Nuxt | Pass/fail | Blocking issue |
|---|---|---|---|---|---|---|---|---|---|
| `/auth/sign-in` | `auth/login` | POST | Nuxt stores/uses `sunpyramids-token`; current Next form does not submit. | Not testable. | Not testable. | Not implemented. | No | Fail | Static clone only; must wire and validate login API. |
| `/auth/sign-up` | `auth/register` | POST | Current Next form does not submit. | Not testable. | Not testable. | Not implemented. | No | Fail | Static clone only; must wire and validate registration API. |
| `/auth/forget-password` | `auth/password/forget` | POST | Public. Current Next form does not submit. | Not testable. | Not testable. | Not implemented. | No | Fail | Static clone only. |
| `/auth/reset-password` | `client/reset-password` | POST | Public token/query flow must be confirmed. Current Next form does not submit. | Not testable. | Not testable. | Not implemented. | No | Fail | Static clone only. |
| `/auth/create-password` | `auth/password/reset` | POST | Public token/query flow must be confirmed. Current Next form does not submit. | Not testable. | Not testable. | Not implemented. | No | Fail | Static clone only. |
| `/auth/confirm-code` | `auth/password/otp/verify`, `auth/password/forget` | POST | Public OTP flow. Current Next form does not submit. | Not testable. | Not testable. | Not implemented. | No | Fail | Static clone only. |
| `/profile` | Profile/customer APIs | GET/PATCH as applicable | Requires `sunpyramids-token`; current Next page does not fetch user. | Not testable. | Not testable. | Shows sign-in CTA. | Partial UI only | Fail | Auth guard/user API missing. |
| `/profile/settings` | `profile` | PATCH | Requires token; current Next page does not submit. | Not testable. | Not testable. | Shows sign-in CTA. | No | Fail | Profile update flow missing. |
| `/profile/bookings` | `bookings?page_limit=200&includes=currency,tours` | GET | Requires token; current Next page does not fetch bookings. | Not testable. | Not testable. | Shows sign-in CTA. | No | Fail | Booking history API missing. |
| `/profile/favourites` | `wishlist?page=1&page_limit=200`, `wishlist/{id}/toggle` | GET/PUT | Requires token; current Next page does not fetch wishlist. | Not testable. | Not testable. | Shows sign-in CTA. | No | Fail | Wishlist API missing. |
| `/cart` | `cart/list`, `cart/remove/{id}`, `cart/clear`, `coupons/{code}/validate` | GET/DELETE | Optional/auth cart behavior must be confirmed; current Next page does not fetch cart. | Not testable. | Not testable. | Static empty cart UI. | No | Fail | Cart behavior missing. |
| `/cart/checkout` | `bookings`, `bookings/update/{id}` | POST | Requires cart/payment state; current Next page does not create bookings. | Not testable. | Not testable. | Static checkout UI. | No | Fail | Checkout is a critical production blocker. |
| `/thankful` | Final thank-you display/tracking | GET/display | Public. | Route loads HTTP 200. | Not applicable. | No backend redirect tested. | Partial | Partial | Final conversion/booking redirect parity pending. |
| Payment callbacks | `payments/paypal/capture`, `payments/paypal/cancel`, `payments/fawaterk/update/invoice` | GET | Client reads browser `invoice_id`; no server token required in current code unless cookie exists. | Route loads HTTP 200. Sandbox invoice not tested. | Missing `invoice_id` shows no backend payment call. | Links to bookings/contact. | Partial | Partial | Needs valid sandbox invoice validation. |
