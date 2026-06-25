# Risk Register

| Risk | Area | Severity | Evidence | Mitigation / owner |
|---|---|---:|---|---|
| Customer flows are API-wired but not fully validated | Auth/profile/cart/checkout | Critical | Sprint 9 aligns confirmed backend contract gaps, but no staging credentials/cart/payment data were available. | Validate with staging backend before cutover; block production until passed. |
| Payment callbacks could mutate state if moved server-side in future | Payment | Critical | Current implementation is client-only, but callbacks call mutation-like endpoints. | Keep `PaymentCallbackStatus` client-only; add safety validation report; review future changes. |
| Checkout/payment parity incomplete | Revenue | Critical | Sprint 9 removed the unconfirmed `bookings/update/{id}` call and sends `payment_method` in `POST /api/bookings`, but payment sandbox flow remains unvalidated. | Validate exact flow with staging cart, payment method, payment redirect response, and sandbox invoice IDs. |
| Dynamic settings/menu/footer/currency may be static in Next | UI/API parity | High | Nuxt shared store fetches `settings`, `countries`, `currencies`; Next shell uses local config/static links. | Validate dashboard-driven requirements; wire API if required. |
| Sitemap is not fully API/database complete | SEO | High | Current sitemap pulls static paths, tours, blogs, categories, destinations, and blog categories. Custom marketing pages remain undiscoverable. | Backend list endpoint or explicit exclusion/manual list approval required. |
| UI parity gaps from consolidated React components | UX | High | Next uses fewer generic components than Nuxt. | Screenshot compare priority routes and fix confirmed mismatches. |
| Tour detail booking/options/seasons may be incomplete | Revenue/UX | High | Nuxt fetches options/days/seasons and has complex right panel; Next includes differ. | Compare representative tour detail and validate booking panel. |
| Recaptcha/tracking parity incomplete | Forms/marketing | Medium | Contact form now generates/submits `recaptcha_token` when Enterprise script is available; backend acceptance and conversion tracking are not validated. | Confirm backend requirement and tracking scripts before cutover. |
| Locale SEO fallback behavior needs backend confirmation | SEO/i18n | Medium | Next sends `X-Localize`, but locale response content must be tested. | Raw HTML checks per locale on staging. |
| Image optimization/stable dimensions need audit | Performance | Medium | Sprint 4 fixed tour fallback hero loading a raw 2 MB CSS background; other pages still need image audits. | Continue Lighthouse and screenshot audits for priority pages. |
| Third-party scripts affect CWV | Performance/tracking | High | Sprint 4 normal Lighthouse remained low while `?no-third-party=1` scored home 100 and tour 94; GTM loads TikTok/Clarity and TrustIndex adds work. | Optimize/approve tag behavior with marketing before cutover. |
| Homepage hydration error regression risk | Rendering | Medium | Sprint 3 fixed the confirmed BlogCard HTML mismatch and browser validation showed no React #418. | Keep console check in pre-cutover validation. |
| Custom marketing pages missing from sitemap discovery | SEO | High | `custom-pages?page_limit=2` returned 404; Nuxt confirms only `custom-pages/{slug}` detail usage. | Backend list endpoint or explicit business approval required. |

## Sprint 5 Risk Notes

- Cart remove/coupon/edit, rent-car append, make-your-trip, and checkout payment update are code-wired but must be treated as unvalidated until staging data is available.
- Third-party normal-mode performance requires marketing/tag owner approval; engineering should not remove GTM/GA/TikTok/Clarity/TrustIndex unilaterally.
- reCAPTCHA acceptance is blocked until staging backend verification confirms the current submit-time token is accepted.

## Sprint 6 Risk Notes

- Staging validation remains the top cutover blocker because no staging frontend URL, staging backend/API URL, test customer, coupon data, cart item data, checkout billing data, payment configuration, or sandbox invoice IDs were provided.
- Auth/profile/cart/checkout/payment cannot be marked passed without real staging/backend evidence.
- Custom marketing sitemap remains a high SEO risk until the backend provides a list endpoint, another confirmed API exposes slugs, business/SEO approves manual slugs, or business/SEO explicitly excludes those pages for cutover.
- Conversion tracking remains a business risk because no GTM Preview, GA4 DebugView, Google Ads test method, or TikTok/Clarity owner approval was available.
- Third-party normal-mode performance remains an approval risk; accepted performance cost must be marked yes/no by marketing/tag owners.

## Sprint 7 Risk Notes

- Access remains the primary blocker: no staging frontend URL, backend/API URL, test customer, cart data, coupon data, checkout billing data, payment configuration, sandbox invoice IDs, reCAPTCHA settings, or analytics debug access were provided.
- Environment configuration is code-level safe for public/backend domain separation, but staging overrides are untested because no `.env*` file or staging deployment variables were available.
- The public reCAPTCHA key is currently in `lib/recaptcha.ts`; backend acceptance and staging key ownership must be confirmed before cutover.
- GTM/GA IDs are hardcoded client loaders; any defer, route-scope, consent-gate, or removal decision requires marketing/tag-owner approval.
- UI parity fixes remain risky until revenue flows are validated or formally blocked, because authenticated and cart/checkout states cannot be meaningfully approved without test data.

## Sprint 8 Risk Notes

- Nuxt discovery reduced ambiguity but did not remove the access blocker: no Nuxt `.env*` files, private credentials, valid coupons, sandbox invoice IDs, or confirmed staging URLs were found.
- `https://new-sunpyramids-demo.vercel.app` is only a Nuxt `APP_URL` fallback and must not be promoted to the official staging URL without owner confirmation.
- The backend/API fallback remains `https://sunpyramidtours.com/api/`; no independent staging API base URL was discovered.
- Public Nuxt values confirm reCAPTCHA Enterprise site key, GTM ID, GA4 ID, payment callback endpoints, checkout payload shape, rent-car endpoints, and representative tour slugs, but these are not substitutes for backend/staging validation evidence.
- The Sprint 8 applied-values review found these public values already present in Next; no production code change was needed and no missing private data was invented.
- Backend discovery found no `bookings/update/{id}` API route; the Laravel contract creates bookings and payment redirects from `POST /api/bookings` using `payment_method`, and Sprint 9 aligned the active Next checkout flow to that contract.
- Backend discovery found `APP_FRONTEND_URL` in `.env` but `APP_FRONT_URL` in `config/app.php`; payment callback URLs and sitemap generation may fall back to localhost unless deployment config supplies `APP_FRONT_URL`.
- PayPal credentials are hardcoded in `config/paypal.php`; values were redacted in docs, but this is a security/remediation risk before production ownership signoff.
- No backend reCAPTCHA validation logic was found, so frontend token generation cannot be considered accepted until backend/security confirms expected behavior.
- Custom marketing page sitemap risk remains high because Nuxt uses only `custom-pages/{slug}` detail fetches; the public static sitemap is evidence, not an approved source-of-truth.
- Sprint 8 cannot pass end-to-end auth/profile/cart/rent-car/checkout/payment/reCAPTCHA/tracking validation until owners provide secure access and test data.

## Sprint 9 Risk Notes

- Active checkout is now aligned to the inspected Laravel `POST /api/bookings` contract, but it cannot be marked passed until a staging cart creates a booking and returns an approved payment redirect.
- Cart remove semantics were aligned to backend behavior, but removal still needs real tour and rental cart rows to prove there is no row/product ID ambiguity in deployed data.
- Contact and make-your-trip no longer block when reCAPTCHA is disabled or unavailable, matching the absence of discovered backend validation; security owners still need to confirm whether this is intended.
- The `APP_FRONT_URL` vs `APP_FRONTEND_URL` mismatch remains a production ownership risk for backend-generated payment and sitemap URLs.
- Tracking/debug access, valid coupon data, sandbox invoice IDs, real rental IDs, and UI approval owner remain unresolved cutover blockers.

## Sprint 10 Risk Notes

- The confirmed API URL is the production-domain API. Limited validation must avoid booking creation, checkout submission, payment redirects, invoice callback mutation APIs, coupon success tests, and rent-car append tests unless explicitly approved.
- Frontend staging is available, but the deployed staging build returns `500` for `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car`. Current local production build returns `200` for the same routes, so deployment/runtime parity must be checked before broader validation.
- `Test_tour` has confirmed numeric tour ID `664`, code `Test`, and title `Test Tour`; use `664` for backend APIs requiring numeric `tour_id`. The deep include tour detail endpoint returns `500`, and cart add/remove remains blocked until owners approve production-API cart testing and the deployed frontend route is healthy.
- Valid login remains blocked in this run because the password was not available in the thread or checked local secure env variables. Invalid login failed safely with a controlled API error.
- Full production cutover remains blocked.

## Sprint 11 Risk Notes

- Staging 500 root causes are narrowed to SSR/runtime rendering and backend API include behavior. A frontend fix removed the server-side `isomorphic-dompurify` sanitizer path and stopped using backend-crashing tour deep includes.
- The deployed staging URL still returns `/500` for the previously failing routes until a redeploy is available and verified.
- The backend still returns 500 for `GET /api/tours/Test_tour` when `gallery` is included; this is a backend/API issue to raise with the API owner if rich tour media is required.
- Valid login/profile validation remains blocked until the test password is provided through a secure runtime-only mechanism.
- No production API mutations were run; checkout/payment/coupon/rent-car validation remains blocked without explicit owner approval and safe data.

## Sprint 12 Risk Notes

- Staging redeploy is not verified: `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car` still map to `/500` on `https://sunpyramids-next.vercel.app/`.
- Vercel deployment branch/commit/date and env values could not be confirmed from this workspace because no Vercel project metadata or CLI linkage is available.
- Current local production build still passes the target route set, so next action is redeploy/log inspection rather than additional production-API mutation testing.
- Valid-login/profile validation remains blocked until the password is supplied through a secure runtime/manual method.

## Sprint 14 Risk Notes

- The previous staging 500 routes now return 200 after redeploy, reducing route-readiness risk for tour/contact/make-your-trip/rent-car.
- Secure valid-login/profile validation remains blocked because the password was not available through a runtime-only secure method.
- Cart readiness is documented for `tour_id` 664, but cart mutation remains blocked until owner approval confirms the production-risk API test is safe and reversible.
- Checkout/payment/coupon/rent-car mutations remain blocked without explicit approval and safe data.

## Sprint 15 Risk Notes

- Staging route health remains green for the Sprint 15 route set.
- Secure valid-login/profile validation remains blocked because no runtime-only password method was available.
- Cart add/remove is technically ready for `tour_id` 664 but remains blocked because the required explicit approval sentence was not provided.
- Production-risk checkout/payment/coupon/rent-car mutations remain blocked.

## Sprint 16 Risk Notes

- Cart add/remove approval is now present, but execution remains blocked because runtime credentials were not visible to this shell.
- Valid auth/profile validation remains blocked until credentials are available through a secure runtime/manual method.
- No production mutation was run in Sprint 16.

## Sprint 16 Owner-Approved Booking Attempt Notes

- Owner approval for one controlled booking was present, but execution remained blocked because credentials were not visible to this shell runtime.
- No cart, checkout, booking, payment, coupon, rent-car, or invoice mutation was run.
- The next run must provide credentials via a runtime visible to the executing shell or use manual browser login.

## Sprint 16 Retry Notes

- Sprint 16 retry succeeded with local untracked credentials from `.local-test-creds.json`: login, profile, and cart passed; one controlled booking was created for `tour_id` 664; the run stopped before payment.
- Payment was not completed; no callback was called with `invoice_id`; no coupon/rent-car/invoice mutation was run.
- Booking ID/reference was not captured in the workspace evidence; the dashboard verifier must locate it by test customer / `Test_tour` / `tour_id` 664 / 2026-06-25 creation time. Do not create another booking to recover it.

## Sprint 17 Booking Evidence Cleanup Notes

- Credentials cleanup confirmed: `.local-test-creds.json` is in `.gitignore` (line 12), not staged, not tracked, not committed; no credential value was printed or saved. Owner must delete the file and rotate the test account password after validation.
- Booking evidence: booking created yes; payment completed no; stopped before payment yes; no `invoice_id` callback. Booking ID/reference, payment redirect, cart post-booking state, and duplicate-booking check remain unknown pending the dashboard verifier.
- Dashboard verifier cleanup decision (cancel/delete/mark as test/leave as evidence) is pending; verifier must not expose unrelated customer data.
- Payment, coupon, rent-car, tracking, sitemap, and UI parity approvals remain blocked; production cutover remains blocked.

## Production Cutover Rule

Cutover remains blocked while any Critical risk is open.
