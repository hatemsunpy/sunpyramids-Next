# Sprint 11 Staging 500 Triage Report

Date: 2026-06-25

## Summary

Sprint 11 investigated staging 500s on `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car` under production-API safe rules. No booking, cart, payment, coupon, rent-car, or invoice mutation was run.

Two safe frontend changes were applied:

- `lib/data.ts` no longer requests backend-crashing tour deep includes.
- `lib/sanitize-html.ts` no longer imports `isomorphic-dompurify` on the server-rendered route path and instead uses an SSR-safe sanitizer helper.

The current local production build passes all affected routes. The deployed staging URL still serves `/500` for the affected routes until redeployed and verified.

## Required Route Findings

| Route | Local current build | Deployed staging before redeploy | Root cause / evidence | Fix status |
|---|---:|---:|---|---|
| `/tour/Test_tour` | 200 | 500 | Backend `tours/Test_tour?includes=seo` returns 200, but adding `gallery` returns 500; tour page also shared server-side sanitized HTML path. | Frontend mitigation applied; backend include bug remains. |
| `/contact-us` | 200 | 500 | API `pages/contact-us?includes=seo,metas` returns 200. Route shares server-side sanitized HTML path. | Frontend sanitizer fix applied; redeploy required. |
| `/make-your-trip` | 200 | 500 | API `pages/make-your-trip?includes=seo,metas` returns 200. Route shares server-side sanitized HTML path. | Frontend sanitizer fix applied; redeploy required. |
| `/rent-car` | 200 | 500 | API slug must be `car-rental`; `pages/car-rental?includes=seo,metas` returns 200, while `pages/rent-car` returns 404. Current code already uses `car-rental`. Route shares server-side sanitized HTML path. | Frontend sanitizer fix applied; redeploy required. |

## Tour API Include Triage

| API endpoint | Result |
|---|---:|
| `GET /api/tours/Test_tour` | 200 |
| `GET /api/tours/Test_tour?includes=seo` | 200 |
| `GET /api/tours/Test_tour?includes=seo,gallery` | 500 |
| Broader include combinations through `reviews` | 500 |
| `GET /api/tours?slug=Test_tour&includes=seo,gallery,category,destination` | 500 |

Conclusion: the backend currently cannot safely serve the `gallery` include for `Test_tour`. The frontend should not use that include set for SSR until the backend is fixed.

## Environment Audit

Created `docs/next-migration/staging-env-audit.md`. No local `.env*` files exist. No confirmed missing Vercel variable was proven as the root cause. `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_API_URL` still require owner confirmation in Vercel, but the route failures are better explained by SSR route-family behavior and backend include failures.

## Auth Runtime Validation

Valid login/profile validation was not performed. Checked secure local env names were missing:

- `SUNPYRAMIDS_TEST_PASSWORD`
- `SUNPYRAMIDS_TEST_ACCOUNT_PASSWORD`
- `SUNPYRAMIDS_CUSTOMER_PASSWORD`
- `SPT_TEST_PASSWORD`
- `TEST_CUSTOMER_PASSWORD`

Required secure methods remain: runtime-only ignored environment variable, manual browser input, or password manager/manual entry. Never commit the password.

## Production API Safety

No production mutation was run:

- No booking creation.
- No checkout submit.
- No payment redirect.
- No callback with `invoice_id`.
- No cart add/remove.
- No coupon validation.
- No rent-car append/search mutation.

## Validation

| Check | Result |
|---|---|
| `npm run lint` | Passed. |
| `npm run build` | Passed. |
| Local production route smoke | Passed for `/`, `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, `/rent-car`, `/about-us`, `/faqs`, `/cart`, `/cart/checkout`, `/auth/sign-in`, `/profile`, no-invoice payment callbacks, `/sitemap.xml`, and `/robots.txt`. |
| Staging route smoke | Still failing on deployed staging for `/tour/Test_tour`, `/contact-us`, `/make-your-trip`, and `/rent-car`; checked safe routes otherwise returned 200. Requires redeploy/verification. |
| Browser validation | Blocked/manual-required; no browser dependency was installed. |
| `git diff --check` | Passed; only LF-to-CRLF working-copy warnings were emitted. |

## Remaining Blockers

- Redeploy staging with the Sprint 11 fixes and re-run route smoke. Sprint 12 checked staging and the target routes still map to `/500`, so redeploy is not verified.
- Backend/API owner should fix or confirm the `gallery` include 500 for `Test_tour`.
- Secure runtime password required for valid-login/profile validation.
- Checkout/payment/coupon/rent-car/cart mutations require explicit owner approval and safe test data.
- Backend reCAPTCHA confirmation remains blocked.
- GTM/GA/Ads/TikTok/Clarity debug access remains blocked.
- UI approval owner and custom marketing sitemap decision remain blocked.

## Cutover Verdict

Production cutover remains blocked until staging 500 routes pass after redeploy, auth/profile are validated with a secure runtime password, and checkout/payment/coupon/rent-car validations receive approved safe data.
