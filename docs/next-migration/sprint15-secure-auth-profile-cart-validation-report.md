# Sprint 15 Secure Auth/Profile and Cart Readiness Validation Report

Date: 2026-06-25

## Summary

Sprint 15 reconfirmed staging route health, safe auth failure behavior, profile shell readiness, cart add/remove readiness, checkout page-load safety, payment callback no-invoice safety, and forms page-load safety.

Secure valid-login/profile validation remains blocked because no password was available through the checked secure runtime-only environment variables. Cart add/remove mutation remains blocked because the exact owner approval sentence was not provided.

No credentials were saved. No cart, checkout, booking, payment, coupon, rent-car, profile-update, or invoice mutation was run.

Production cutover remains blocked.

## Secure Password Handling

Checked secure runtime variable names:

- `SUNPYRAMIDS_TEST_PASSWORD`
- `SUNPYRAMIDS_TEST_ACCOUNT_PASSWORD`
- `SUNPYRAMIDS_CUSTOMER_PASSWORD`
- `SPT_TEST_PASSWORD`
- `TEST_CUSTOMER_PASSWORD`

All were missing. Valid-login/profile validation remains blocked until the password is provided through manual browser input, password manager/manual entry, or an untracked runtime-only environment variable.

## Staging Route Confirmation

| Route | Status | Matched path | Result |
|---|---:|---|---|
| `/` | 200 | `/` | Pass |
| `/tour/Test_tour` | 200 | `/tour/[slug]` | Pass |
| `/contact-us` | 200 | `/contact-us` | Pass |
| `/make-your-trip` | 200 | `/make-your-trip` | Pass |
| `/rent-car` | 200 | `/rent-car` | Pass |
| `/cart` | 200 | `/cart` | Pass |
| `/cart/checkout` | 200 | `/cart/checkout` | Pass |
| `/auth/sign-in` | 200 | `/auth/sign-in` | Pass |
| `/profile` | 200 | `/profile` | Pass shell |
| `/profile/settings` | 200 | `/profile/settings` | Pass shell |
| `/profile/bookings` | 200 | `/profile/bookings` | Pass shell |
| `/profile/favourites` | 200 | `/profile/favourites` | Pass shell |
| `/sitemap.xml` | 200 | `/sitemap.xml` | Pass |
| `/robots.txt` | 200 | `/robots.txt` | Pass |

No checked route mapped to `/500`.

## Auth Validation

| Check | Result |
|---|---|
| `/auth/sign-in` loads | Passed, HTTP 200. |
| Invalid login fails safely | Passed, `POST /api/auth/login` with wrong password returned controlled `400`. |
| Valid login succeeds | Blocked; no secure runtime password was available. |
| Auth response shape | Blocked for valid response; invalid response is controlled JSON. |
| Passport bearer behavior | Code-level ready: `lib/client-api.ts` sends `Authorization: Bearer ...` when the client token cookie exists. Runtime validation blocked without valid login. |
| Token not exposed in public SSR HTML | Passed on checked raw HTML: no bearer token or `sunpyramids-token` found. |
| Logged-in reload behavior | Blocked without valid login. |
| Logout | Blocked without valid login. |
| Logged-out protected route behavior | Profile shell routes load; browser/client guard behavior still needs valid-login/manual validation. |

## Profile Validation

| Route | Result |
|---|---|
| `/profile` | Shell loads; authenticated profile API behavior blocked without valid login. |
| `/profile/settings` | Shell loads; no profile update run. |
| `/profile/bookings` | Shell loads; authenticated bookings API behavior blocked without valid login. |
| `/profile/favourites` | Shell loads; authenticated favourites API behavior blocked without valid login. |

No private user data was found in checked raw HTML.

## Cart Readiness

| Item | Readiness |
|---|---|
| Test tour slug | `Test_tour` |
| Numeric `tour_id` | `664` |
| Tour code | `Test` |
| Add endpoint | `POST /api/cart/tours/append` |
| Expected add payload | `tour_id: 664`, `start_date`, `adults`, `children`, `infants`, optional `options`. |
| Remove endpoint | `DELETE /api/cart/remove/{item}` |
| Remove behavior | Tour rows removed by tour ID; rental rows removed by rental row ID. |
| Dashboard verifier | Assigned and should confirm no unexpected booking/payment/order residue if mutation is approved later. |

Cart mutation validation was not run. Required approval text was not provided:

`I approve a reversible cart add/remove test on the production-risk API using the test customer account and tour_id 664. No checkout, booking, invoice, or payment should be created.`

## Checkout Safety

`/cart/checkout` returns 200. No checkout submit was run. Code inspection confirms:

- `payment_method` is included in booking payload construction.
- No active `bookings/update/{id}` call exists.
- No booking, payment, or invoice mutation ran on page load.

Checkout end-to-end remains blocked.

## Payment Callback No-Invoice Recheck

Checked without `invoice_id` only:

| Route | Status | Result |
|---|---:|---|
| PayPal verify | 200 | Pass |
| PayPal canceled | 200 | Pass |
| Fawaterk success | 200 | Pass |
| Fawaterk pending | 200 | Pass |
| Fawaterk canceled | 200 | Pass |

No valid invoice ID was tested.

## Forms Safety Recheck

| Route | Status | Result |
|---|---:|---|
| `/contact-us` | 200 | Form markup present; no submit run. |
| `/make-your-trip` | 200 | Form markup present; no submit run. |
| `/rent-car` | 200 | Form markup present; no submit run. |

Raw HTML checks found no global reCAPTCHA script, no bearer token, and no `sunpyramids-token` exposure on checked pages.

## Validation Commands

| Check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Local production route smoke | Passed for `/`, `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, `/rent-car`, cart/checkout, auth/profile routes, no-invoice callbacks, sitemap, and robots. |
| Staging route smoke | Passed for required Sprint 15 routes. |
| `git diff --check` | Passed; only LF-to-CRLF working-copy warnings were emitted. |

## Remaining Blockers

- Secure runtime/manual password required for valid-login/profile validation.
- Exact cart mutation approval sentence required before reversible cart add/remove can run.
- Checkout/payment/coupon/rent-car mutations remain blocked without explicit approval and safe data.
- Backend `gallery` include bug for `Test_tour` remains an API issue if rich tour media is required.
- Backend reCAPTCHA confirmation remains blocked.
- GTM/GA/Ads/TikTok/Clarity debug access and approval remain blocked.
- UI approval owner and custom marketing sitemap decision remain blocked.

## Verdict

Production cutover remains blocked until cart/checkout/payment/coupon/rent-car/tracking/sitemap/UI approvals are completed with safe data and owner approval.
