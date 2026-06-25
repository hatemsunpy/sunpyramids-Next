# Sprint 12 Staging Redeploy Verification Report

Date: 2026-06-25

## Summary

Sprint 12 attempted to verify the staging redeploy of the Sprint 11 fixes and perform secure auth validation. The deployed staging URL is still serving `/500` for the four target routes, so the Sprint 11 fixes are not verified on staging yet.

No credentials were saved. No booking, cart, payment, coupon, rent-car, or invoice mutation was run.

Production cutover remains blocked.

## Deployment Verification

| Item | Result |
|---|---|
| Staging URL | `https://sunpyramids-next.vercel.app/` |
| Vercel latest deployment date/time | Not available from this workspace. |
| Branch/commit deployed | Not available from this workspace. No `.vercel/project.json` exists and no Vercel CLI/project metadata is configured locally. |
| Sprint 11 code present on staging | Not verified. Target routes still map to `/500`. |
| `lib/data.ts` safer tour include deployed | Not verified from staging response. |
| `lib/sanitize-html.ts` SSR-safe sanitizer deployed | Not verified from staging response. |
| `NEXT_PUBLIC_APP_URL` on Vercel | Unknown; expected `https://sunpyramidstours.com`. |
| `NEXT_PUBLIC_API_URL` on Vercel | Unknown; expected `https://sunpyramidtours.com/api/`. |

## Staging Route Smoke

| Route | Status | Matched path | Result | Notes |
|---|---:|---|---|---|
| `/` | 200 | `/` | Pass | Homepage responds. |
| `/tour/Test_tour` | 500 | `/500` | Fail | Sprint 11 fix not verified on staging. |
| `/contact-us` | 500 | `/500` | Fail | Sprint 11 fix not verified on staging. |
| `/make-your-trip` | 500 | `/500` | Fail | Sprint 11 fix not verified on staging. |
| `/rent-car` | 500 | `/500` | Fail | Sprint 11 fix not verified on staging. |
| `/cart` | 200 | `/cart` | Pass | UI/page load only. |
| `/cart/checkout` | 200 | `/cart/checkout` | Pass | No checkout submit run. |
| `/auth/sign-in` | 200 | `/auth/sign-in` | Pass | Sign-in page loads. |
| `/profile` | 200 | `/profile` | Pass shell | Authenticated behavior still blocked without valid login. |
| `/order/payment/callback/paypal/verify` | 200 | callback route | Pass no-invoice route smoke | No `invoice_id` used. |
| `/order/payment/callback/paypal/canceled` | 200 | callback route | Pass no-invoice route smoke | No `invoice_id` used. |
| `/order/payment/callback/fawaterk/success` | 200 | callback route | Pass no-invoice route smoke | No `invoice_id` used. |
| `/order/payment/callback/fawaterk/pending` | 200 | callback route | Pass no-invoice route smoke | No `invoice_id` used. |
| `/order/payment/callback/fawaterk/canceled` | 200 | callback route | Pass no-invoice route smoke | No `invoice_id` used. |
| `/sitemap.xml` | 200 | `/sitemap.xml` | Pass | XML route responds. |
| `/robots.txt` | 200 | `/robots.txt` | Pass | Robots route responds. |

## Tour Route Status

`/tour/Test_tour` still returns 500 on deployed staging and matches `/500`, so the Sprint 11 route fix is not verified on staging.

Confirmed test data remains:

- slug: `Test_tour`
- numeric `tour_id`: `664`
- code: `Test`
- title: `Test Tour`

Use `664` wherever the backend API requires numeric `tour_id`; do not use `Test` as `tour_id`.

## Generic Content Route Status

`/contact-us`, `/make-your-trip`, and `/rent-car` still return 500 on deployed staging and match `/500`. The current local production build returns 200 for all three routes, so staging still appears to need redeploy or Vercel runtime/log inspection.

No form submitted automatically. No production mutation was run.

## Auth Validation

| Check | Result |
|---|---|
| `/auth/sign-in` loads | Passed, HTTP 200. |
| Invalid login fails safely | Passed, `POST /api/auth/login` with a wrong password returned controlled `400`. |
| Valid login succeeds | Blocked; no secure runtime password value was available. |
| Bearer token behavior | Code-level only; runtime protected API validation blocked without valid login. |
| Profile after login | Blocked without valid login. |
| Profile/bookings/favourites | Local/staging shell routes load, but authenticated API behavior is blocked without valid login. |
| Logged-out protected behavior | Manual/browser validation still required. |
| Token exposure in public HTML | Checked sign-in raw HTML; no `sunpyramids-token` or bearer token found. |
| Reload behavior | Blocked without valid login. |

Checked secure runtime env names were missing:

- `SUNPYRAMIDS_TEST_PASSWORD`
- `SUNPYRAMIDS_TEST_ACCOUNT_PASSWORD`
- `SUNPYRAMIDS_CUSTOMER_PASSWORD`
- `SPT_TEST_PASSWORD`
- `TEST_CUSTOMER_PASSWORD`

## Payment No-Invoice Safety

No callback route was called with `invoice_id`. HTTP route smoke returned 200 for PayPal verify/canceled and Fawaterk success/pending/canceled. Browser network validation remains manual-required because no browser tooling is available without installing dependencies.

## Mutation Validation

Still blocked. No checkout booking creation, payment redirect creation, payment callback with `invoice_id`, coupon validation, rent-car cart mutation, cart mutation, or dashboard mutation was run.

## Local Validation

| Check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Local production route smoke | Passed for `/`, `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, `/rent-car`, `/cart`, `/cart/checkout`, `/auth/sign-in`, `/profile`, `/profile/bookings`, `/profile/favourites`, no-invoice callbacks, `/sitemap.xml`, and `/robots.txt`. |
| `git diff --check` | Passed; only LF-to-CRLF working-copy warnings were emitted. |

## Remaining Blockers

- Redeploy staging with the current Sprint 11 fixes and re-run route smoke.
- Get Vercel deployment metadata or logs to confirm branch/commit/env values.
- Secure runtime password required for valid-login/profile validation.
- Backend/API owner should fix or confirm the `gallery` include 500 for `Test_tour`.
- Checkout/payment/coupon/rent-car/cart mutations require explicit owner approval and safe data.
- Backend reCAPTCHA confirmation, tracking debug access, UI approval owner, and custom marketing sitemap decision remain blocked.

## Verdict

Production cutover remains blocked. Sprint 12 did not verify the redeploy because the deployed staging target routes still return `/500`.
