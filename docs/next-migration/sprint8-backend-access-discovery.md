# Sprint 8 Backend Access Discovery

Date: 2026-06-23

Backend folder inspected: `D:\Sun Pyramids\sun pyramids tours - Web\sunpyramids-backend-main`

## Summary

The Laravel backend confirms many API contracts needed for Sprint 8, including auth, cart, coupon validation, booking creation, rental append/search, payment callback endpoints, dashboard routes, and sitemap generation behavior. It also confirms several blockers remain: no safe test customer, no real numeric tour/rental IDs, no valid coupon, no sandbox invoice IDs, no backend reCAPTCHA validation logic, and no GTM/GA/Ads/TikTok/Clarity debug access.

Important backend findings:

- API routes are prefixed with `/api` by `RouteServiceProvider`.
- Client auth uses Laravel Passport bearer tokens with guard `auth:client`.
- CORS allows all origins and does not support credentials.
- Booking creation expects `payment_method` in `POST /api/bookings`; no backend `bookings/update/{id}` API route was found.
- `cart/remove/{item}` removes tour cart items by `tour_id` and rental cart rows by rental row `id`.
- Backend `.env` contains `APP_FRONTEND_URL=https://sunpyramidstours.com`, but `site_url()` reads `APP_FRONT_URL` through `config('app.front_url')`. Payment redirects and backend sitemap use `site_url()`, so owner confirmation/config alignment is required.
- PayPal credentials are hardcoded in `config/paypal.php`; values are private and are intentionally redacted here.

## Safe Public Values Found

- Backend local/default app URL in `.env` and `.env.example`: `http://127.0.0.1:8000`
- Frontend URL in backend `.env`: `https://sunpyramidstours.com`
- Fawaterak base URL in `.env`, `.env.example`, and config fallback: `https://staging.fawaterk.com`
- Currency API base URL in `.env` and `.env.example`: `https://api.apilayer.com`
- API prefix: `/api`
- Dashboard route: `/dashboard`
- API payment methods enum: `cash`, `paypal`, `card`
- Static location seed names including `Cairo`, `Giza`, `Luxor`, `Hurghada`, `Sharm El Sheikh`, `El Fayoum`, and airport/port locations.
- Page/sitemap static routes from backend sitemap generator: `hidden-gems`, `global-tours`, `sun-pyramids-reward-program`, `responsible-travel-policy`, and related public routes.

## Private Values Found but Redacted

| Source File | Variable / Config Key | Value Type | Available | Requires Secure Handoff | Value |
|---|---|---|---|---|---|
| `.env` | `APP_KEY` | Laravel app key | Yes | Yes | REDACTED |
| `.env` | `DB_PASSWORD` | Database password | Yes | Yes | REDACTED |
| `.env` | `REDIS_PASSWORD` | Redis password/placeholder | Yes | Yes | REDACTED |
| `.env` | `MAIL_PASSWORD` | SMTP password | Yes | Yes | REDACTED |
| `.env` | `GOOGLE_CLIENT_SECRET` | OAuth client secret | Yes | Yes | REDACTED |
| `.env` | `TWITTER_CLIENT_SECRET` | OAuth client secret | Yes | Yes | REDACTED |
| `.env` | `FACEBOOK_CLIENT_SECRET` | OAuth client secret | Yes | Yes | REDACTED |
| `config/paypal.php` | `sandbox.client_id` | PayPal client id | Yes | Yes | REDACTED |
| `config/paypal.php` | `sandbox.client_secret` | PayPal client secret | Yes | Yes | REDACTED |
| `config/paypal.php` | `sandbox.app_id` | PayPal app id | Yes | Yes | REDACTED |
| `config/paypal.php` | `live.client_id` | PayPal client id | Yes | Yes | REDACTED |
| `config/paypal.php` | `live.client_secret` | PayPal client secret | Yes | Yes | REDACTED |
| `config/paypal.php` | `live.app_id` | PayPal app id | Yes | Yes | REDACTED |
| `config/fawaterak.php`, `.env` | `FAWATERAK_API_KEY` | Fawaterak API key | No value in inspected env | Yes | REDACTED |
| `.env` | `CURRENCY_API_KEY` | Currency API key | No value in inspected env | Yes | REDACTED |
| `.env` | `WHATSAPP_GRAPH_TOKEN` | WhatsApp token | No value in inspected env | Yes | REDACTED |
| `.env` | `GOOGLE_TRANSLATE_API_KEY` | Google Translate API key | No value in inspected env | Yes | REDACTED |
| `database/seeders/AdminSeeder.php` | admin password literal | Seeded admin password | Yes | Yes | REDACTED |

## Discovery Table

| Item | Found in Backend | Value / Redacted Summary | Source File | Confidence | Safe to Use | Requires Owner | Status | Notes |
| ---- | ---------------- | ------------------------ | ----------- | ---------- | ----------- | -------------- | ------ | ----- |
| Confirmed staging frontend URL | Partial | `.env` has `APP_FRONTEND_URL=https://sunpyramidstours.com`; no staging frontend found. | `.env`, `app/Http/Controllers/Api/AuthController.php` | High | Yes for public production URL | Yes | Partial | This confirms production frontend for social redirects, not staging. |
| Possible frontend config mismatch | Yes | `site_url()` reads `APP_FRONT_URL`, but inspected `.env` has `APP_FRONTEND_URL`. | `config/app.php`, `app/Helpers/admin.php`, `.env` | High | Yes | Yes | Blocked | Payment redirects and backend sitemap use `site_url()`; owner must confirm deployment env has `APP_FRONT_URL`. |
| Confirmed staging backend/API URL | Partial | `.env` and `.env.example` default `APP_URL=http://127.0.0.1:8000`; API prefix is `/api`. | `.env`, `.env.example`, `RouteServiceProvider.php` | High | Yes | Yes | Partial | No staging backend URL found; public backend domain remains owner-provided/project rule. |
| Test customer account | No | Factories create random clients only. | `database/factories/ClientFactory.php`, `tests/TestCase.php` | High | No | Yes | Blocked | No safe reusable test account found. |
| Admin/dashboard access | Partial | Dashboard route `/dashboard`; seeded admin email found; password redacted. | `routes/web.php`, `routes/admin.php`, `database/seeders/AdminSeeder.php` | High | Email only if treated as seed/demo | Yes | Partial | Seeded password must be securely rotated/handled; do not publish. |
| Numeric tour ID and representative tour data | Partial | Factories generate tours; real numeric staging ID not found. | `TourController.php`, `TourFactory.php`, `Tour.php` | High | Field rules yes, real ID no | Yes | Blocked | `cart/tours/append` requires `tour_id` existing in `tours.id`. |
| Rental location/destination IDs | Partial | Seeded location names found, no guaranteed IDs; real car route data not seeded. | `LocationSeeder.php`, `CarRentalController.php`, `CarRental` service | Medium | Names/endpoints yes, IDs no | Yes | Partial | IDs depend on DB state and route pricing records. |
| Valid coupon code | No | Coupon factory creates random words; no stable valid test coupon. | `CouponFactory.php`, `Coupon.php`, `CouponController.php` | High | No | Yes | Blocked | Valid coupon must come from staging/dashboard owner. |
| Invalid coupon test case | Yes, synthetic | `INVALID-TEST-CODE` | Synthetic migration test data | High | Yes | No | Available | Negative test only; not a real coupon. |
| Test checkout billing data | Partial | Required fields/rules found; safe synthetic payload can be used. | `BookingRequest.php` | High | Yes | Yes for staging validation | Partial | Requires a cart and valid currency ID. |
| Enabled staging payment methods | Partial | Backend enum supports `cash`, `paypal`, `card`; Fawaterk methods endpoint filters Visa methods. | `PaymentMethod.php`, `PaymentFactory.php`, `FawaterkController.php` | High | Yes | Yes | Partial | Staging gateway enablement/API keys still blocked. |
| PayPal sandbox invoice ID | No | No sample invoice/order ID found; PayPal config present with secrets redacted. | `PaypalController.php`, `Paypal.php`, `config/paypal.php` | High | No | Yes | Blocked | Requires sandbox transaction from payment owner. |
| Fawaterk sandbox invoice ID | No | No sample invoice ID found; base URL points to staging Fawaterk; API key absent/redacted. | `FawaterkController.php`, `Card.php`, `config/fawaterak.php` | High | No | Yes | Blocked | Requires sandbox invoice from payment owner. |
| reCAPTCHA site key / Enterprise settings | No | No backend reCAPTCHA references found. | Source search | High | No | Yes | Blocked | Backend does not validate or require `recaptcha_token` in inspected request classes. |
| Backend reCAPTCHA acceptance configuration | No | No middleware/rules/service calls found. | Source search | High | No | Yes | Blocked | Backend acceptance cannot be validated from code because no validation logic was found. |
| GTM preview access | No | No GTM/backend tracking config found. | Source search | High | No | Yes | Blocked | Marketing/tag owner required. |
| GA4 debug access | No | No GA4/backend tracking config found. | Source search | High | No | Yes | Blocked | Marketing/analytics owner required. |
| Google Ads conversion testing method | No | No Ads conversion ID/label or backend conversion trigger found. | Source search | High | No | Yes | Blocked | Could live inside GTM; owner access required. |
| TikTok/Clarity approval/debug access | No | No TikTok/Clarity backend config found. | Source search | High | No | Yes | Blocked | Likely GTM-managed; owner approval still required. |
| Custom marketing sitemap decision | Partial | Backend sitemap hardcodes static marketing routes and includes API listing endpoint for pages. | `SitemapGenerator.php`, `PageController.php`, `Page.php` | High | Evidence yes | Yes | Partial | Backend has `GET /api/pages`, but manual inclusion/exclusion still needs SEO/business approval. |
| UI parity approval owner | No | No owner/approver found. | Source/docs search | Medium | No | Yes | Blocked | Needs product/design/marketing owner. |

## Backend Auth / Session Findings

- API client login uses `POST /api/auth/login` and returns Passport `accessToken`.
- Authenticated API routes use middleware `auth:client` with the `client` guard.
- `config/auth.php` defines `client` as Passport provider `clients`.
- `config/sanctum.php` exists, but the inspected API routes use Passport for client auth.
- CORS config allows `allowed_origins => ['*']`, all headers/methods, and `supports_credentials => false`.
- CSRF cookie path is present in CORS config, but client API auth is bearer-token based for these routes.
- Next should continue sending bearer token from the `sunpyramids-token` cookie for protected client endpoints.

## Backend API Endpoint Findings

Key endpoints from `routes/api.php`:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/password/forget`
- `POST /api/auth/password/otp/verify`
- `POST /api/auth/password/reset`
- `GET /api/profile/me`, `PATCH /api/profile`, `POST /api/profile/logout`
- `GET /api/cart/list`
- `POST /api/cart/tours/append`
- `POST /api/cart/rentals/append`
- `DELETE /api/cart/remove/{item}`
- `DELETE /api/cart/clear`
- `GET /api/coupons/{coupon:code}/validate` under `auth:client`
- `POST /api/bookings`
- `GET /api/bookings`, `GET /api/bookings/{id}` under `auth:client`
- `GET /api/payments/fawaterk/methods`
- `GET /api/payments/fawaterk/update/invoice?invoice_id=...`
- `GET /api/payments/paypal/capture?invoice_id=...`
- `GET /api/payments/paypal/cancel?invoice_id=...`
- `GET /api/tours`, `GET /api/tours/{slug}`
- `GET /api/pages`, `GET /api/pages/{key}`
- `POST /api/custom/trips`
- `POST /api/contact-requests`
- `GET /api/locations`
- `POST /api/car/rental/available/destinations`
- `POST /api/car/rental/search/for/route`
- `POST /api/car/rental/checkout`

Payload/validation highlights:

- Tour cart append requires `tour_id`, `start_date`, `adults`, `children`, `infants`; `options` optional.
- Rental cart append requires pickup/destination IDs, adults/children, `oneway`, pickup date/time; return date/time are required when `oneway` is false.
- Booking creation requires `first_name`, `last_name`, `phone`, `email`, `country`, `state`, `payment_method`, `currency_id`; optional `pickup_location`, `street_address`, `coupon_id`, `notes`, `start_date`.
- Custom trip exact time requires `start_date` and `end_date`; approximate time requires `month` and `days`; not-sure may include `days`.
- Contact request requires `name`, `subject`, `email`, `phone`, `country`, `message`; no backend `recaptcha_token` rule found.

## Payment Findings

- Supported backend payment methods: `cash`, `paypal`, `card`.
- `POST /api/bookings` resolves `PaymentGateway` from `request('payment_method', 'cash')`; no separate API route for `bookings/update/{id}` was found.
- Card/Fawaterk gateway uses `payment_method_id` from request, defaulting to `2`, and creates Fawaterk invoices against `config('fawaterak.base_url')`.
- Fawaterk config defaults to `https://staging.fawaterk.com`; API key is env-driven and not available in inspected `.env`.
- PayPal config contains hardcoded sandbox and live credentials in `config/paypal.php`; values must be treated as secrets and remediated/handled securely.
- Payment callback controllers query `payments.invoice_id`; no invoice ID means no payment record is found and the API returns 404.
- `site_url()` is used for PayPal/Fawaterk return URLs; the `APP_FRONT_URL` vs `APP_FRONTEND_URL` mismatch must be resolved before payment callback validation.

## reCAPTCHA Findings

- No backend reCAPTCHA validation logic, middleware, request rule, score threshold, Enterprise assessment, or secret config was found.
- `ContactUsRequest` and `CustomTripRequest` do not include `recaptcha_token`.
- Backend acceptance remains blocked because there is no inspected backend validation behavior to confirm.

## Tracking Findings

- No GTM, GA4, Google Ads, TikTok, Clarity, `gtag`, `dataLayer`, `ttq`, or Clarity config was found in backend app/config/routes/database/resources searches.
- Tracking/debug access remains an external marketing/tag-owner blocker.

## Custom Marketing Sitemap Findings

- Backend has `GET /api/pages`, so custom/page records are listable through the API.
- `Page::MAIN_PAGES` includes core static pages but does not include every static sitemap marketing route.
- `SitemapGenerator::pages()` hardcodes static frontend paths including `hidden-gems`, `global-tours`, `sun-pyramids-reward-program`, and `responsible-travel-policy`.
- `SitemapGenerator` also includes enabled tours, active blogs, active blog categories, and enabled Egypt child destinations.
- Decision status: partial. Backend provides more evidence than Nuxt did, but custom marketing sitemap inclusion still needs SEO/business approval before hardcoding or excluding pages in Next.

## Values Requiring Secure Handoff

- Test customer account email/password
- Admin/dashboard credentials
- Confirmed staging frontend URL
- Confirmed staging backend/API URL
- Valid coupon code
- Real published tour numeric ID
- Real rental pickup/destination/route IDs
- PayPal sandbox invoice ID
- Fawaterk sandbox invoice ID
- Payment gateway staging API keys/configuration
- Backend deployment confirmation for `APP_FRONT_URL` / `APP_FRONTEND_URL`
- GTM Preview access
- GA4 DebugView access
- Google Ads test method
- TikTok/Clarity owner approval/debug access
- UI parity approval owner

## Still Blocked

- End-to-end staging validation cannot proceed without confirmed staging URLs, customer/admin access, valid test data, payment sandbox invoice IDs, gateway config confirmation, tracking/debug access, and owner approvals.
- Backend reCAPTCHA acceptance is still blocked; inspected backend code does not validate reCAPTCHA tokens.
- Custom marketing sitemap decision remains partial and requires SEO/business approval.

## Recommended Next Action

Sprint 8 remains blocked for full staging validation. Sprint 9 answered the checkout implementation question by aligning active Next checkout to `POST /api/bookings` with `payment_method` and removing the unconfirmed `bookings/update/{id}` call. The immediate owner requests still are: confirm `APP_FRONT_URL` vs `APP_FRONTEND_URL` in backend deployment, provide staging URLs and test accounts, provide valid coupon/tour/rental/payment sandbox data, and confirm backend reCAPTCHA/tracking expectations.
