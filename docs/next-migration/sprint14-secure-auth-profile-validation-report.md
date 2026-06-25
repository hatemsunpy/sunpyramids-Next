# Sprint 14 Secure Auth/Profile Validation and Safe Cart Readiness Report

Date: 2026-06-25

## Summary

Sprint 14 verified that the redeployed staging frontend now returns 200 for the previous Sprint 10-12 target routes. Secure valid-login/profile validation remains blocked because no password was available through the checked secure runtime environment variables.

No credentials were saved. No cart, checkout, booking, payment, coupon, rent-car, profile-update, or invoice mutation was run.

Production cutover remains blocked.

## Staging Route Smoke

| Route | Status | Matched path | Result | Notes |
|---|---:|---|---|---|
| `/` | 200 | `/` | Pass | Homepage responds. |
| `/tour/Test_tour` | 200 | `/tour/[slug]` | Pass | Previous 500 fixed on staging. |
| `/contact-us` | 200 | `/contact-us` | Pass | Previous 500 fixed on staging. |
| `/make-your-trip` | 200 | `/make-your-trip` | Pass | Previous 500 fixed on staging. |
| `/rent-car` | 200 | `/rent-car` | Pass | Previous 500 fixed on staging. |
| `/cart` | 200 | `/cart` | Pass | Page load only; no cart mutation. |
| `/cart/checkout` | 200 | `/cart/checkout` | Pass | Page load only; no checkout submit. |
| `/auth/sign-in` | 200 | `/auth/sign-in` | Pass | Sign-in page loads. |
| `/profile` | 200 | `/profile` | Pass shell | Authenticated behavior blocked without valid login. |
| `/sitemap.xml` | 200 | `/sitemap.xml` | Pass | XML responds. |
| `/robots.txt` | 200 | `/robots.txt` | Pass | Robots responds. |

## Auth Validation

| Check | Result |
|---|---|
| `/auth/sign-in` loads | Passed, HTTP 200. |
| Invalid login fails safely | Passed, `POST /api/auth/login` with wrong password returned controlled `400`. |
| Valid login succeeds | Blocked; no secure runtime password value was available. |
| Bearer token behavior | Code-level ready; runtime validation blocked without valid login. |
| Token not exposed in public HTML | Passed for checked raw HTML: no `sunpyramids-token` or bearer token found. |
| Reload behavior | Blocked without valid login. |
| Logout | Blocked without valid login. |
| Logged-out protected route behavior | Profile shell loads; browser/manual validation still needed for client guard state. |

Checked secure runtime env names were missing:

- `SUNPYRAMIDS_TEST_PASSWORD`
- `SUNPYRAMIDS_TEST_ACCOUNT_PASSWORD`
- `SUNPYRAMIDS_CUSTOMER_PASSWORD`
- `SPT_TEST_PASSWORD`
- `TEST_CUSTOMER_PASSWORD`

## Profile Validation

| Route | Status | Result |
|---|---:|---|
| `/profile` | 200 | Route shell loads; authenticated profile API behavior blocked without valid login. |
| `/profile/settings` | 200 local | Route shell loads locally; no profile update run. |
| `/profile/bookings` | 200 local | Route shell loads locally; authenticated bookings API behavior blocked without valid login. |
| `/profile/favourites` | 200 local | Route shell loads locally; authenticated favourites API behavior blocked without valid login. |

No private user data was found in checked raw public/auth/profile HTML. Full profile validation remains blocked until secure valid login is available.

## Tour Page Validation

`/tour/Test_tour` returns 200 on staging. Confirmed test tour data remains:

- slug: `Test_tour`
- numeric `tour_id`: `664`
- code: `Test`
- title: `Test Tour`

Use `664` wherever backend APIs require numeric `tour_id`; do not use `Test` as `tour_id`. Current code avoids the backend-crashing `gallery` include and requests the safer tour detail shape.

## Cart Readiness

Cart mutation validation was not run. Readiness status:

| Item | Status |
|---|---|
| Add-to-cart endpoint | `POST /api/cart/tours/append`. |
| Expected add payload | `tour_id: 664`, `start_date`, `adults`, `children`, `infants`, optional `options`. |
| Remove endpoint | `DELETE /api/cart/remove/{item}`. |
| Remove behavior | Tour rows removed by tour product ID; rental rows removed by rental row ID. |
| Reversibility | Expected reversible if the item is added only for the test account and then removed, but explicit owner approval is still required because API is production-risk. |
| Dashboard verifier | Should be ready to confirm no unwanted production-side residue if cart mutation testing is approved. |

Cart add/remove remains blocked until explicit approval is provided.

## Checkout Safety

`/cart/checkout` returns 200. No checkout submit was run. Code inspection confirms `payment_method` is present in booking payload construction and no active `bookings/update/{id}` call exists. No booking, payment redirect, or invoice mutation ran on page load.

Checkout end-to-end remains blocked until explicit approval or a true sandbox/staging backend is provided.

## Payment Callback No-Invoice Safety

Checked without `invoice_id` only:

| Route | Status | Result |
|---|---:|---|
| PayPal verify | 200 | Safe route smoke. |
| PayPal canceled | 200 | Safe route smoke. |
| Fawaterk success | 200 | Safe route smoke. |
| Fawaterk pending | 200 | Safe route smoke. |
| Fawaterk canceled | 200 | Safe route smoke. |

No valid invoice ID was tested. Browser network validation remains manual-required because no browser tooling dependency is installed.

## Forms Safety

| Route | Status | Result |
|---|---:|---|
| `/contact-us` | 200 | Form markup present in raw HTML. No submit run. |
| `/make-your-trip` | 200 | Form markup present in raw HTML. No submit run. |
| `/rent-car` | 200 | Form markup present in raw HTML. No submit run. |

Raw HTML checks found no global reCAPTCHA script, no bearer token, and no `sunpyramids-token` exposure on checked pages.

## Validation Commands

| Check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Local production route smoke | Passed for `/`, `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, `/rent-car`, cart/checkout, auth/profile routes, no-invoice callbacks, sitemap, and robots. |
| Staging route smoke | Passed for required Sprint 14 routes. |
| `git diff --check` | Passed; only LF-to-CRLF working-copy warnings were emitted. |

## Remaining Blockers

- Secure runtime/manual password required for valid-login/profile validation.
- Cart add/remove requires explicit owner approval even with `tour_id` 664 because API is production-risk.
- Checkout/payment/coupon/rent-car mutations remain blocked without explicit approval and safe data.
- Backend `gallery` include bug for `Test_tour` remains an API issue if rich tour media is required.
- Backend reCAPTCHA confirmation remains blocked.
- GTM/GA/Ads/TikTok/Clarity debug access and approval remain blocked.
- UI approval owner and custom marketing sitemap decision remain blocked.

## Verdict

Production cutover remains blocked until cart/checkout/payment/coupon/rent-car/tracking/sitemap/UI approvals are completed with approved safe data.
