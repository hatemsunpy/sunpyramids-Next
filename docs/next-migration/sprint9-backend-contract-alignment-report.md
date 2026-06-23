# Sprint 9 Backend Contract Alignment Report

Date: 2026-06-23

## Summary

Sprint 9 aligned confirmed active frontend/backend contract mismatches found during Sprint 8 backend discovery. No backend code, database data, payment provider state, secrets, or production/staging configuration was changed.

Production cutover remains blocked because staging URLs, test account access, valid coupon data, real tour/rental IDs, sandbox invoice IDs, backend reCAPTCHA settings, tracking debug access, custom marketing sitemap approval, and UI approval owner were not provided.

## Backend Facts Applied

| Contract area | Backend fact | Frontend action |
|---|---|---|
| Auth/session | API auth uses bearer tokens through `auth:client`; CORS credentials are disabled. | Existing client API behavior preserved; no cookie/session credential dependency added. |
| Checkout | `POST /api/bookings` validates `payment_method` and creates the payment redirect; no Laravel API route for `bookings/update/{id}` was found. | Checkout now sends `payment_method` during booking creation and no longer calls `bookings/update/{id}`. |
| Cart remove | `cart/remove/{item}` removes tour rows by `tour_id` and rental rows by rental row `id`. | Remove logic now chooses tour product ID for tour rows and rental row ID for rental rows. |
| Rent-car destinations | `car/rental/available/destinations` expects `pickup_location_id` in the request body. | Destination lookup now posts `pickup_location_id` in the body. |
| Contact fields | `ContactUsRequest` requires `name`, `subject`, `email`, `phone`, `country`, and `message`. | Contact form now requires phone and country and posts the required fields. |
| Custom-trip fields | `CustomTripRequest` requires first/last name and timing fields by selected type. | Make-your-trip now derives first/last name and validates exact/approx timing fields before submit. |
| reCAPTCHA | No backend reCAPTCHA validator, middleware, rule, or Enterprise assessment was found. | Contact and make-your-trip include `recaptcha_token` only when generated and do not hard-fail diagnostic/disabled cases. |

## Backend Facts Documented, Not Applied

| Area | Decision |
|---|---|
| `APP_FRONT_URL` vs `APP_FRONTEND_URL` | Documented as an owner/deployment blocker. No frontend workaround was added because backend-generated payment/sitemap URLs must be fixed or confirmed in deployment config. |
| Custom marketing sitemap pages | Documented backend `GET /api/pages` and sitemap generator evidence, but did not add unapproved marketing slugs to Next sitemap. |
| Tracking/debug | No GTM/GA/Ads/TikTok/Clarity backend config was found. No tags or events were changed without owner/debug approval. |
| Payment callbacks | No callback mutation behavior changed. Client-only, invoice-guarded safety remains the rule. |

## Code Changes

| File | Change |
|---|---|
| `components/CustomerFlows.tsx` | Aligned checkout, cart remove, rent-car destination lookup, and custom-trip payload/timing validation to inspected backend contracts. |
| `components/ContactForm.tsx` | Made backend-required phone/country fields required and kept reCAPTCHA token optional when unavailable. |

## Documentation Updates

| File | Update |
|---|---|
| `docs/next-migration/api-endpoint-inventory.md` | Updated active endpoint contract rows for contact, custom trips, rent-car destinations, cart remove, checkout, and `bookings/update/{id}`. |
| `docs/next-migration/forms-and-flows-map.md` | Updated flow statuses and added Sprint 9 backend contract alignment notes. |
| `docs/next-migration/api-driven-behavior-validation.md` | Added Sprint 9 alignment table and revised current checkout/contact status. |
| `docs/next-migration/production-cutover-checklist.md` | Added Sprint 9 status section. |
| `docs/next-migration/risk-register.md` | Revised checkout risk and added Sprint 9 risk notes. |
| `docs/next-migration/payment-callback-safety-validation.md` | Added Sprint 9 callback safety note. |
| `docs/next-migration/sitemap-robots-validation-report.md` | Added Sprint 9 sitemap source-of-truth decision note. |
| `docs/next-migration/third-party-performance-approval-report.md` | Added Sprint 9 tracking/debug approval note. |
| `docs/next-migration/sprint8-backend-access-discovery.md` | Updated recommended next action to reflect Sprint 9 checkout alignment. |

## Current Contract Status

| Area | Status |
|---|---|
| Auth contract | Code-level aligned to bearer token behavior; staging credentials still required. |
| Booking/checkout contract | Code-level aligned to `POST /api/bookings` with `payment_method`; payment redirect behavior still requires staging validation. |
| Cart remove contract | Code-level aligned; real populated cart validation still required. |
| Rent-car contract | Code-level aligned for destinations and append flow; real pickup/dropoff/rental data still required. |
| reCAPTCHA backend validation | Backend validation not found; owner/security confirmation still required. |
| Backend `site_url()` risk | Still open pending `APP_FRONT_URL` deployment confirmation. |
| Custom marketing sitemap | Still blocked pending SEO/business source-of-truth decision. |
| Payment safety | Code-level no-invoice safety unchanged; sandbox invoice validation still required. |
| Tracking/debug | Still blocked pending GTM/GA/Ads/TikTok/Clarity debug access or owner approval. |

## Validation Commands

| Command/check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Local route smoke | Passed HTTP 200 for `/`, `/egypt-tours/one-day-tours`, representative tour slug, `/contact-us`, `/make-your-trip`, `/rent-car`, `/cart`, `/cart/checkout`, `/thankful`, auth/profile routes, no-invoice PayPal callback, `/sitemap.xml`, and `/robots.txt`. |
| Browser/payment safety | Blocked by unavailable Playwright tooling in this workspace. Temporary `npx` and `npm exec --package=playwright` attempts could not resolve the `playwright` module, and no repo dependency was installed. Existing client-only no-invoice callback guard remains unchanged. |

## Remaining Blockers

- Staging URLs confirmation.
- Test customer account.
- Admin/dashboard access, if owners expect dashboard-managed content validation.
- Valid coupon.
- Real tour and rental IDs plus populated cart data.
- Sandbox PayPal/Fawaterk invoice IDs.
- Backend reCAPTCHA settings/owner decision.
- GTM Preview, GA4 DebugView, Google Ads test method, TikTok/Clarity approval.
- Custom marketing sitemap decision.
- UI approval owner.

## Staging Validation Verdict

Blocked. Sprint 9 improved code/docs alignment to the inspected backend contract, but no staging/customer/payment/marketing evidence was available. No end-to-end auth, cart, checkout, payment, reCAPTCHA, tracking, custom sitemap, or UI approval flow should be marked passed from this run.
