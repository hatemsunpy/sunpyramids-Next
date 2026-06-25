# Sprint 8 Nuxt Access Discovery

Date: 2026-06-23

Sprint 8 could not continue with staging validation because staging/test access was still missing. This report inspects the original Nuxt project for safe, derivable access/config/test data before asking owners manually.

No Nuxt `.env*` files were found in `nuxt_sunpyramids/`. No private credentials, passwords, admin credentials, payment secrets, sandbox secrets, or private tokens were found in safe docs/config/test/sample sources. Public frontend identifiers are documented below.

## Discovery Table

| Item | Found in Nuxt | Value or redacted summary | Source file/path | Confidence | Safe to use in Next docs | Requires external owner | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| Staging frontend URL | Partial | `https://new-sunpyramids-demo.vercel.app` | `nuxt_sunpyramids/nuxt.config.ts` (`APP_URL` fallback) | Medium | Yes | Yes | Partial | Looks like a demo/deployed frontend fallback, not confirmed as current staging. Public production URLs also appear in `public/sitemap.xml`, `public/robots.txt`, and `public/Llms.txt` as `https://sunpyramidstours.com`. |
| Public production frontend URL | Yes | `https://sunpyramidstours.com` | `nuxt_sunpyramids/public/sitemap.xml`, `nuxt_sunpyramids/public/robots.txt`, `nuxt_sunpyramids/public/Llms.txt` | High | Yes | No | Available | Public SEO URLs must keep this frontend domain. |
| Staging backend/API base URL | Partial | No staging API URL found. Public fallback API is `https://sunpyramidtours.com/api/`. | `nuxt_sunpyramids/nuxt.config.ts`, `nuxt_sunpyramids/composables/useApi.js` | High for fallback, low for staging | Yes | Yes | Partial | Nuxt uses `runtimeConfig.public.baseURL` for API calls. This matches the backend-domain rule for `https://sunpyramidtours.com`. |
| Test customer account email/password | No | None found in safe docs/fixtures/tests/examples. | Searched Nuxt docs/config/source excluding secret dumps | High | N/A | Yes | Blocked | Owner must provide a staging test customer through secure handoff. |
| Test admin/dashboard access | No | No dashboard URL or safe admin credentials found. | Searched Nuxt docs/config/source | Medium | N/A | Yes | Blocked | Owner must provide dashboard URL/access if dashboard SEO/content parity must be checked. |
| Test tour slug | Yes | Representative public slugs include `from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis`, `tour-to-pyramids-and-the-egyptian-museum`, and `classic-8-days-egypt-tour-package-to-pyramids-luxor-aswan-by-train`. | `nuxt_sunpyramids/public/sitemap.xml`, `nuxt_sunpyramids/public/Llms.txt` | High | Yes | Yes | Partial | Public slugs are safe; staging availability still needs backend confirmation. |
| Test tour numeric ID | Partial | Nuxt payload uses `tour_id: tour.value.id`, but no fixed numeric tour ID fixture was found. | `nuxt_sunpyramids/components/Tours/RightPanal/index.vue`, `nuxt_sunpyramids/components/Cart/steps/Cart/Edit.vue` | High for field, low for value | Yes for field only | Yes | Blocked | Numeric ID must come from staging API response for the selected slug. |
| Test rent-car location/destination data | Partial | Endpoints and payload shape found, no fixed location/destination IDs found. | `nuxt_sunpyramids/components/RentACar/Form/index.vue`, `QuickInfo.vue` | High | Yes | Yes | Partial | Uses `locations?page_limit=200&order_by=id,asc`, `car/rental/available/destinations?page_limit=200&pickup_location_id={id}`, `car/rental/search/for/route`, and `cart/rentals/append`. |
| Valid coupon code | No | No public test coupon found. | `nuxt_sunpyramids/components/Cart/steps/Cart/index.vue`, i18n labels/docs search | High | N/A | Yes | Blocked | Nuxt confirms endpoint only: `coupons/{code}/validate`. |
| Invalid coupon code | No, synthetic proposed | `INVALID-TEST-CODE` | Synthetic negative test value | High | Yes | No | Available for negative testing only | This is not a real backend coupon and should only be used to verify invalid-coupon behavior once staging is available. |
| Test checkout billing details | Partial, synthetic proposed | Safe synthetic payload: `fullName: Test Traveler`, `email: qa+sunpyramids@example.com`, `phone: +201000000000`, `country: Egypt`, `state: Cairo`, `pickupLocation: Cairo hotel`, `note: Sprint 8 staging validation`. | Nuxt field names from `nuxt_sunpyramids/components/Checkout/steps/Billing.vue` and `Checkout/index.vue` | High for fields, synthetic for values | Yes | Yes | Partial | Do not use real customer data. Staging backend may require country IDs/names from API. |
| Enabled staging payment methods | Partial | Static Nuxt options: `card`, `paypal`; `card` maps to `payment_method_id: 9`; commented `payments/fawaterk/methods` fetch exists. | `nuxt_sunpyramids/components/Checkout/steps/Paymet.vue`, `Checkout/index.vue` | High for UI options | Yes | Yes | Partial | Staging enablement and gateway config still need backend/payment owner confirmation. |
| PayPal sandbox invoice ID | No | None found. | Payment callback docs/source search | High | N/A | Yes | Blocked | Required for sandbox callback validation. |
| Fawaterk sandbox invoice ID | No | None found. | Payment callback docs/source search | High | N/A | Yes | Blocked | Required for success/pending/canceled callback validation. |
| reCAPTCHA site key / Enterprise settings | Yes | Public site key `6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn`; Enterprise script; action `submit`. | `nuxt_sunpyramids/nuxt.config.ts`, `nuxt_sunpyramids/composables/recapcha.js`, form components | High | Yes | Yes | Partial | Nuxt globally loads Enterprise script. `recapcha.js` currently returns `null` before execution, so backend acceptance still needs real validation. |
| Backend reCAPTCHA acceptance configuration | Partial | Payload field confirmed as `recaptcha_token`; backend settings not present in Nuxt. | Contact, event, landing, make-your-trip, disabled-contact components | High for field, blocked for backend config | Yes for field only | Yes | Blocked | Backend owner must confirm required forms, expected field, and accept/reject behavior. |
| GTM preview access | Partial | Container ID `GTM-KDF33T7`; preview access not found. | `nuxt_sunpyramids/app.vue` | High | Yes | Yes | Partial | Nuxt loads GTM globally via script and noscript iframe. Preview/debug access remains blocked. |
| GA4 debug access | Partial | Measurement ID `G-NKZ6W32C4J`; debug access not found. | `nuxt_sunpyramids/app.vue` | High | Yes | Yes | Partial | Nuxt loads GA4 globally via gtag. GA4 DebugView access remains blocked. |
| Google Ads conversion testing method | No | No `AW-` ID, conversion label, or explicit `gtag_report_conversion` found in safe Nuxt source. | Tracking search across Nuxt source | Medium | N/A | Yes | Blocked | Could be inside GTM; requires marketing/tag-owner access. |
| TikTok/Clarity owner approval or debug access | Partial | TikTok and Clarity source snippets not found directly in Nuxt code; likely loaded through GTM based on prior browser/performance observations. Public asset `tiktok.png` is only a social icon. | Nuxt source search, prior performance docs | Medium | Yes for absence/direct-code note | Yes | Blocked | Owner/debug access still required before approval or tag changes. |
| Custom marketing sitemap decision | Partial | Nuxt confirms detail endpoint `custom-pages/{slug}` only. Public static sitemap includes likely marketing paths such as `hidden-gems`, `global-tours`, `sun-pyramids-reward-program`, and `responsible-travel-policy`, but no list endpoint or approval source was found. | `nuxt_sunpyramids/components/MarktingPages/index.vue`, `nuxt_sunpyramids/public/sitemap.xml` | Medium | Yes for evidence only | Yes | Blocked | Do not hardcode slugs unless business/SEO approves or backend provides source of truth. |
| UI parity approval owner | No | No owner/approver found. | Nuxt docs/source and current migration docs search | Medium | N/A | Yes | Blocked | Product/design/marketing owner must be named for approval. |

## Values Safe to Use

- Public production frontend URL: `https://sunpyramidstours.com`
- Nuxt demo/deployed fallback URL requiring confirmation: `https://new-sunpyramids-demo.vercel.app`
- Public backend/API fallback URL: `https://sunpyramidtours.com/api/`
- Public reCAPTCHA Enterprise site key: `6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn`
- reCAPTCHA action observed: `submit`
- reCAPTCHA payload field: `recaptcha_token`
- GTM container ID: `GTM-KDF33T7`
- GA4 measurement ID: `G-NKZ6W32C4J`
- Representative public tour slugs:
  - `from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis`
  - `tour-to-pyramids-and-the-egyptian-museum`
  - `classic-8-days-egypt-tour-package-to-pyramids-luxor-aswan-by-train`
- Rent-car endpoints:
  - `locations?page_limit=200&order_by=id,asc`
  - `car/rental/available/destinations?page_limit=200&pickup_location_id={id}`
  - `car/rental/search/for/route`
  - `cart/rentals/append`
- Coupon validation endpoint: `coupons/{code}/validate`
- Booking endpoints: `bookings`, `bookings/update/{id}`
- Payment callback endpoints:
  - `payments/paypal/capture?invoice_id={invoice_id}`
  - `payments/paypal/cancel?invoice_id={invoice_id}`
  - `payments/fawaterk/update/invoice?invoice_id={invoice_id}`
- Static payment method values shown in Nuxt: `card`, `paypal`; `card` uses `payment_method_id: 9`
- Synthetic invalid coupon value for negative testing only: `INVALID-TEST-CODE`
- Safe synthetic checkout billing data for staging-only testing:
  - full name: `Test Traveler`
  - email: `qa+sunpyramids@example.com`
  - phone: `+201000000000`
  - country: `Egypt`
  - state: `Cairo`
  - pickup location: `Cairo hotel`
  - note: `Sprint 8 staging validation`

## Values Requiring Secure Handoff

No private values were found in safe Nuxt docs/config/sample files during this discovery pass.

Still requiring secure owner handoff:

- Test customer account email and password
- Admin/dashboard URL if not public, plus credentials
- Staging frontend URL confirmation
- Staging backend/API base URL if different from public fallback
- Valid coupon code
- PayPal sandbox invoice ID
- Fawaterk sandbox invoice ID
- Payment gateway staging enablement/configuration
- Backend reCAPTCHA acceptance settings
- GTM Preview access
- GA4 DebugView access
- Google Ads conversion test method
- TikTok/Clarity owner approval or debug access

## Still Blocked

- Confirmed current staging frontend URL
- Confirmed current staging backend/API URL
- Test customer credentials
- Admin/dashboard access
- Numeric test tour ID
- Real staging rental location/destination IDs
- Valid coupon code
- PayPal sandbox invoice ID
- Fawaterk sandbox invoice ID
- Backend reCAPTCHA accept/reject settings
- GTM/GA/Ads debug access
- TikTok/Clarity owner approval
- Custom marketing sitemap source-of-truth or explicit exclusion/approval
- UI parity approval owner

## Recommended Next Action

Sprint 8 cannot proceed to end-to-end staging validation yet. It can proceed only as a limited preparation sprint using the public Nuxt-derived values above. The team still needs to provide or confirm the blocked access/test data through secure owner handoff before auth/profile/cart/rent-car/checkout/payment/reCAPTCHA/tracking validation can pass.
