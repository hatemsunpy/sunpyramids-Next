# Forms and Flows Map

Source of truth: Nuxt components/pages and current Next routes/components.

## Public Lead Forms

| Flow | Nuxt source | Endpoint(s) | Current Next | Status |
|---|---|---|---|---|
| Contact form | `components/ContactUs/Form.vue` | `POST contact-requests` with recaptcha token | `components/ContactForm.tsx` posts backend-required contact fields and includes `recaptcha_token` when submit-time generation succeeds | Implemented; backend discovery found no Laravel reCAPTCHA validator, tracking parity pending. |
| Landing/contact forms | `components/BookEgyptTrip/ContactUs.vue`, `EgyptTripLanding*`, `MarktingPages/ContactUs.vue`, `Home/NeedHelp.vue` | `POST contact-requests` | Generic cloned route/contact form surfaces | Needs route-specific field parity validation. |
| Event booking/lead | `components/Event/RightPanal/Book.vue` | `POST contact-requests` | Event detail page exists | Needs form parity validation. |
| Make Your Trip | `components/MakeYourTrip/Form/*` | `POST custom/trips` | `PlannerRequestFlow` posts backend-aligned payload fields and includes `recaptcha_token` when submit-time generation succeeds | Implemented; staging/backend reCAPTCHA validation pending. |
| Rent Car | `components/RentACar/Form/*` | `locations`, `car/rental/available/destinations`, `cart/rentals/append` | `PlannerRequestFlow` fetches locations, posts `pickup_location_id` for destinations, and appends rental to cart | Implemented; staging cart validation pending. |

## Booking, Cart, and Checkout

| Flow | Nuxt source | Endpoint(s) | Current Next | Status |
|---|---|---|---|---|
| Tour booking panel | `components/Tours/RightPanal/index.vue` | `cart/tours/append`, wishlist toggle, tour options/seasons | Tour detail route exists | Booking panel parity pending. |
| Cart list/edit/remove | `components/Cart/steps/Cart/*` | `cart/list`, `cart/remove/{item}`, `cart/clear`, `coupons/{code}/validate`, `cart/tours/append` | `/cart` uses `CartFlow` client API layer for list/clear/remove/coupon and tour edit via `cart/tours/append`; remove sends tour product ID for tour rows and rental row ID for rental rows | Implemented; guest cart works with zero cookies/auth (IP-keyed server-side, matching live Nuxt); see `guest-cart-session-investigation.md`. |
| Checkout billing/payment | `components/Checkout/*` | `POST bookings` | `/cart/checkout` posts `bookings` with `payment_method`; no active `bookings/update/{id}` call remains | Implemented first pass; staging payment validation pending. |
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

## Sprint 8 Backend Discovery Notes

- Laravel `POST /api/bookings` validates `payment_method` directly and resolves the payment gateway during booking creation.
- No inspected Laravel route matches `bookings/update/{id}`; Sprint 9 removed the active Next checkout call and aligned checkout to `POST /api/bookings`.
- Laravel `POST /api/car/rental/available/destinations` and `POST /api/car/rental/search/for/route` require location IDs in the request body.
- Laravel contact/custom-trip request classes do not validate `recaptcha_token`; backend/security confirmation is still required before treating reCAPTCHA as accepted.

## Sprint 9 Backend Contract Alignment

- Checkout now sends `payment_method` in the `POST bookings` payload and no longer calls the unconfirmed `bookings/update/{id}` endpoint.
- Cart removal now follows inspected Laravel semantics: tour rows remove by tour product ID, while rental rows remove by the rental cart row ID.
- Rent-car dependent destinations now post `pickup_location_id` in the request body.
- Contact and make-your-trip forms no longer hard-fail when submit-time reCAPTCHA is intentionally unavailable; `recaptcha_token` is included only when generated.
- Contact phone/country and custom-trip first/last name payloads were aligned to backend-required fields.

## Sprint 10 Limited Production-API Validation

Date: 2026-06-25

| Flow | Sprint 10 result |
|---|---|
| Contact form page | Deployed staging `/contact-us` returns `500`; current local production build returns `200`. No contact submit was run against production API. |
| Make Your Trip page | Deployed staging `/make-your-trip` returns `500`; current local production build returns `200`. No custom-trip submit was run against production API. |
| Rent Car page | Deployed staging `/rent-car` returns `500`; current local production build returns `200`. Backend `pages/rent-car` returns `404`; no rental append/search mutation was run. |
| Auth sign-in | Page loads on staging. Invalid login against `POST /api/auth/login` fails safely with controlled `400`; valid login blocked because password was not available as a secure runtime value. |
| Tour detail | Test tour data is slug `Test_tour`, numeric ID `664`, code `Test`, title `Test Tour`; use `664` for backend APIs requiring numeric `tour_id`. Staging `/tour/Test_tour` returns `500` and the deep include API detail request returns `500`. |
| Cart add/remove | Blocked. No production-API cart mutation was run without explicit approval. |
| Checkout | UI/page load only; no booking creation or payment redirect was run. Active code remains aligned to `POST bookings` with `payment_method` and no active `bookings/update/{id}` call. |
| Payment callbacks | No-invoice route smoke only; no `invoice_id` callback mutation was run. |

## Sprint 11 Staging 500 Triage

Date: 2026-06-25

| Flow | Sprint 11 result |
|---|---|
| Tour detail | Frontend now avoids backend-crashing `gallery` and deeper includes for `Test_tour`; `getTour()` uses `includes=seo` and a no-include fallback. Deployed staging still needs redeploy/verification. |
| Generic content pages | Frontend sanitizer path changed to be SSR-safe without `isomorphic-dompurify`, which is shared by contact, make-your-trip, rent-car, about, FAQ, and tour content rendering. |
| Contact form page | Local production build returns 200. No contact submit was run. |
| Make Your Trip page | Local production build returns 200. No custom-trip submit was run. |
| Rent Car page | Local production build returns 200 using the `car-rental` page API slug. No rental/cart mutation was run. |
| Auth | Valid login/profile remains blocked until the password is provided through a secure runtime-only mechanism. |

## Sprint 12 Staging Redeploy Verification

Date: 2026-06-25

| Flow | Sprint 12 result |
|---|---|
| Tour detail | Deployed staging `/tour/Test_tour` still returns `500` and matches `/500`; redeploy with Sprint 11 fixes is not verified. |
| Contact page | Deployed staging `/contact-us` still returns `500`; local current build passes. |
| Make Your Trip page | Deployed staging `/make-your-trip` still returns `500`; local current build passes. No custom-trip submit was run. |
| Rent Car page | Deployed staging `/rent-car` still returns `500`; local current build passes. No rent-car/cart mutation was run. |
| Auth/profile | Sign-in route loads and invalid login fails safely; valid login/profile remains blocked without secure runtime password. |
| Payment callbacks | No-invoice route smoke only; no `invoice_id` callback mutation was run. |

## Sprint 14 Secure Auth/Profile Validation

Date: 2026-06-25

| Flow | Sprint 14 result |
|---|---|
| Tour detail | Staging `/tour/Test_tour` returns 200. Numeric `tour_id` remains 664; code remains `Test`. |
| Contact page | Staging `/contact-us` returns 200; form markup present; no submit run. |
| Make Your Trip page | Staging `/make-your-trip` returns 200; form markup present; no submit run. |
| Rent Car page | Staging `/rent-car` returns 200; form markup present; no rent-car/cart mutation run. |
| Auth | Sign-in loads; invalid login fails safely; valid login blocked without secure runtime password. |
| Profile | Profile shell loads; authenticated profile/settings/bookings/favourites API validation blocked without valid login. |
| Cart readiness | Ready for approved test using `tour_id` 664, but add/remove mutation remains blocked without explicit owner approval. |
| Checkout | Page loads only; no submit run. |
| Payment callbacks | No-invoice route smoke passed; no `invoice_id` callback mutation was run. |

## Sprint 15 Secure Auth/Profile and Cart Readiness

Date: 2026-06-25

| Flow | Sprint 15 result |
|---|---|
| Auth | Sign-in route loads and invalid login fails safely; valid login blocked because no secure runtime password was available. |
| Profile | `/profile`, `/profile/settings`, `/profile/bookings`, and `/profile/favourites` return 200 shells; authenticated API validation blocked without valid login. |
| Cart | Readiness documented for approved future use of `tour_id` 664; no add/remove mutation run because approval text was not provided. |
| Checkout | Page loads only; no submit run and no booking/payment/invoice mutation. |
| Forms | Contact, make-your-trip, and rent-car pages load with form markup; no submit run. |
| Payment callbacks | No-invoice route smoke passed; no `invoice_id` callback mutation was run. |

## Sprint 16 Secure Auth/Profile and Approved Cart Validation

Date: 2026-06-25

| Flow | Sprint 16 result |
|---|---|
| Auth | Valid login blocked because runtime credentials were not visible to this shell. |
| Profile | Blocked; requires valid login. |
| Cart | Owner approval for reversible add/remove using `tour_id` 664 was provided, but mutation was not run because login was blocked. |
| Checkout | Page-load safety check passed; no submit run. |
| Payment callbacks | No-invoice route smoke passed; no `invoice_id` callback mutation was run. |

## Sprint 16 Owner-Approved Checkout Booking Attempt

Date: 2026-06-25

| Flow | Result |
|---|---|
| Auth | Blocked because runtime credentials were not visible to this shell. |
| Profile | Blocked; requires valid login. |
| Cart setup | Blocked; requires valid login. |
| Checkout submit | Blocked; requires valid login and cart setup. |
| Booking creation | Not run; no booking created. |
| Payment | Not reached; no provider URL opened and no callback with `invoice_id` called. |

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
- Rent car, make-your-trip, coupon, cart item edit/remove, full booking panel options/seasons, and checkout payment behavior remain pending implementation/validation. Sprint 9 later removed the unconfirmed active `bookings/update/{id}` call.

## Sprint 4 reCAPTCHA and Tracking Status

Date: 2026-06-22

- Nuxt globally loaded Enterprise reCAPTCHA in `nuxt.config.ts`; Next now loads the Enterprise script only when a form calls `generateRecaptchaToken()` immediately before submission.
- Contact form still submits Nuxt-compatible `recaptcha_token`, `subject`, `type`, `country`, and contact fields.
- `?no-third-party=1` suppresses diagnostic third-party loading, including reCAPTCHA, GTM/GA, TrustIndex, TikTok, and Clarity.
- Backend reCAPTCHA acceptance was not validated because staging credentials/backend test context are unavailable.
- Conversion/thank-you tracking remains code-level parity only: Nuxt and Next both load GA4/GTM globally in normal mode, but no GTM preview or conversion account validation was available.

No additional customer-flow endpoint parity was implemented in Sprint 4 because staging data and confirmed payment/cart state remain missing. `bookings/update/{id}`, cart edit/remove/coupon, rent-car, and make-your-trip remain Sprint 5 candidates after endpoint/payload confirmation.

## Sprint 5 Customer/Revenue Flow Status

Date: 2026-06-22

Confirmed Nuxt sources inspected: `components/Checkout/index.vue`, `components/Cart/steps/Cart/index.vue`, `components/Cart/steps/Cart/Card.vue`, `components/Cart/steps/Cart/Edit.vue`, `components/RentACar/Form/*`, `components/MakeYourTrip/Form/*`, and payment callback pages.

Implemented in Next:

- Cart remove uses confirmed `DELETE cart/remove/{item}` from cart item actions.
- Cart coupon uses confirmed `GET coupons/{code}/validate` and requires the auth token like Nuxt.
- Cart tour edit posts confirmed `POST cart/tours/append` with `tour_id`, `start_date`, passenger counts, and option IDs.
- Checkout now uses `POST bookings` with `payment_method`; Sprint 9 removed the unconfirmed active `bookings/update/{id}` call after backend discovery found no matching Laravel API route.
- Make Your Trip posts confirmed `POST custom/trips` with submit-time reCAPTCHA token and Nuxt-aligned field names.
- Rent Car fetches `locations`, fetches dependent destinations through `car/rental/available/destinations`, and posts confirmed `cart/rentals/append`.

Blocked validation:

- No staging credentials, test customer account, populated cart state, coupon code, or sandbox invoice IDs were provided.
- Auth/profile/cart/checkout/rent-car/make-your-trip behavior is code-wired but not marked passed.
- Backend reCAPTCHA acceptance is still blocked because no staging key/account validation context was available.
- Conversion/thank-you tracking remains unapproved; no GTM preview or marketing owner approval was available.

## Sprint 6 Staging Flow Validation

Date: 2026-06-23

No staging credentials, test account, approved cart data, coupon codes, checkout billing data, or sandbox invoice IDs were available in this run. The current statuses therefore remain evidence-based:

| Flow | Sprint 6 status | Missing evidence |
|---|---|---|
| Sign in / sign up / password routes | Blocked | Staging URL, test account, success/error responses, redirect/session behavior, expired/invalid session evidence. |
| Profile/settings/bookings/favourites | Blocked | Authenticated staging account, profile data, bookings/favourites data, update/remove/add favourite evidence. |
| Cart tour append/edit/remove/clear | Blocked | Approved staging tour ID/slug, cart item ID, populated cart, auth/guest persistence evidence. |
| Coupon validation | Blocked | Valid coupon code, invalid coupon test, backend response examples. |
| Rent-car cart flow | Blocked | Approved pickup/dropoff data, rental payload evidence, cart display/removal behavior. |
| Checkout/booking | Blocked | Staging cart, billing data, payment method config, booking creation response, payment URL/redirect evidence. |
| Payment callbacks | Blocked for sandbox behavior | PayPal/Fawaterk sandbox invoice IDs for valid, invalid, duplicate, refresh, success, pending, and canceled states. |
| Contact/make-your-trip reCAPTCHA | Blocked for backend acceptance | Staging key/settings and backend valid/missing/invalid token responses. |
| Thank-you/conversion tracking | Blocked | GTM Preview, GA4 DebugView, Google Ads test method, TikTok/Clarity owner validation. |

## Sprint 7 Staging Flow Validation

Date: 2026-06-23

No staging URL, backend URL, customer credentials, cart/coupon data, rental data, checkout billing details, payment configuration, sandbox invoice IDs, or reCAPTCHA/tracking settings were available. No staging flow is marked passed.

| Flow | Sprint 7 status | Missing evidence |
|---|---|---|
| Auth routes | Blocked | Valid/invalid login, logout if implemented, token/cookie behavior, session persistence, protected redirect, expired/invalid session, validation messages, and Nuxt parity. |
| Profile routes | Blocked | Auth guard, profile loading/update, bookings, favourites add/remove, empty/error/unauthorized/expired-session states. |
| Cart and coupon | Blocked | Tour append, edit, remove by cart row ID, clear, valid/invalid coupon, totals, passenger/date/options behavior, reload/login persistence, guest/auth behavior. |
| Rent-car | Blocked | Location/destination loading, rental append, cart display, rental removal if supported, Nuxt parity. |
| Checkout/booking | Blocked | Billing validation, booking creation, payment URL/redirect, failed booking, backend validation errors, cart state after booking, `/thankful`, profile booking appearance. |
| Payment callbacks | Blocked for sandbox behavior | Valid/invalid/duplicate/refresh invoice behavior and backend response handling. |
| reCAPTCHA acceptance | Blocked | Submit-time token generation can be checked locally; backend accept/reject behavior requires staging settings. |
| Conversion tracking | Blocked | GTM/GA/Ads/TikTok/Clarity debug evidence. |

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

## Sprint 17 Booking Evidence and Cleanup Flow Status

Date: 2026-06-25

| Flow | Sprint 17 status | Outstanding evidence |
|---|---|---|
| Auth | Passed in Sprint 16 retry (local untracked credentials). | None for login itself. |
| Profile | Passed in Sprint 16 retry. | None for profile shell. |
| Cart | Passed pre-booking in Sprint 16 retry. | Cart post-booking state (cleared? `Test_tour` still present?); read-only confirmation only, no new mutation. |
| Checkout/booking | One booking created for `tour_id` 664; stopped before payment. | Booking ID/reference, payment redirect, duplicate-booking check, dashboard verifier cleanup decision. |
| Payment | Not completed; no `invoice_id` callback; no-invoice route safety unchanged. | Sandbox invoice IDs or approved payment handoff test. |
| Coupon | Not run. | Valid coupon code; invalid-coupon negative test. |
| Rent-car | Not run. | Pickup/destination IDs; approved reversible rental test. |
| Tracking | Not run. | GTM Preview, GA4 DebugView, Google Ads test method, TikTok/Clarity approval. |
| Sitemap | Not changed. | `GET /api/pages` approval, backend list endpoint, manual slugs, or temporary exclusion. |
| UI parity | Not approved. | Owner name, pages, desktop/mobile approval method. |
| Credentials cleanup | Confirmed: ignored, not staged/tracked/committed; no value saved. | Owner deletes `.local-test-creds.json` and rotates test password after verifier cleanup. |

Full detail in `docs/next-migration/sprint17-booking-evidence-cleanup-report.md`.

## Guest Cart Session Notes

Date: 2026-08-09

| Flow | Result |
|---|---|
| Tour cart append/edit/remove | Guest cart confirmed working with zero cookies and no auth header. Identity is the client public IP, stored server-side by Laravel. No session cookie is involved. |
| Cart list | Returns guest items with no credentials; `cart/list` is unauthenticated and IP-keyed. Same as live Nuxt. |
| Checkout booking | Guest bookings submit `currency_id` of the selected currency; no session cookie required. |
| Currency conversion | Cart/checkout totals convert client-side via `exchange_rate` (USD/EUR/EGP verified). |

Root cause of the earlier "append succeeds but list empty" concern: a test-flow misread. In one automated run a headless browser appended items, the context closed, and the follow-up screenshot was taken before items had been added in that same flow. No session/cookie bug exists. Guest cart is shared per public IP and lost on IP change — business parity with the live site. Full analysis in `guest-cart-session-investigation.md`.
