# Forms and flows — current Sprint 12 state

Date: 2026-08-24. This is the current concise artifact; `forms-and-flows-map.md` retains the longer chronological evidence.

| Flow | Current backend contract | Next status | Runtime policy |
|---|---|---|---|
| Sign in/register | `auth/login`, `auth/register` | Implemented; token/user session cookies | No production auth mutation in Sprint 12 |
| Forget/verify/reset | `auth/password/forget`, `auth/password/otp/verify`, `auth/password/reset` | Implemented; no `client/reset-password` call | Source/build only |
| Social login | provider redirect/callback → `/social-login?token&user` | Root and localized callback implemented | Invalid/missing callback renders explicit error |
| Profile hydration | `GET profile/me` | Implemented; refreshes cookie snapshot | 401 clears stale session |
| Profile update | `PATCH profile` | Exact accepted fields; email is read-only because backend request does not accept email | No production mutation |
| Profile image | `POST profile/change/image` multipart `image`, max 2 MB | Implemented + post-upload refresh | No production mutation |
| Logout | `POST profile/logout` | Server revoke, then local clear | No production mutation |
| Bookings | `GET bookings` | List implemented | Detail omitted: no current Nuxt detail UI |
| Wishlist | list/toggle | Implemented | Protected mutation not run |
| Contact | `POST contact-requests` | Implemented with reCAPTCHA token path | Not submitted |
| Custom trip | `POST custom/trips` | Implemented | Not submitted |
| Rental | locations, available destinations, route lookup, cart append | Active Nuxt surface implemented with selected currency | Lookup code verified; append not sent |
| Cart/checkout | cart CRUD, coupon validation, booking create | Implemented from earlier sprints | Existing mutation/payment owner gates remain |
| Review submission | `POST tour-reviews` | Intentionally not implemented | Current Nuxt has no submission UI/call |
| Blog search | `GET blogs/search/{search}` | Intentionally not implemented | Current Nuxt has no visible/direct search call |

Shared auth/profile/planner labels use confirmed Nuxt dictionaries for all seven supported locales, with per-key English fallback only where the Nuxt locale file omits that key.

Current protected/mutating flow result: **source/build parity PASS; staging end-to-end proof BLOCKED where credentials, reversible data, or owner approval are missing**.

## Sprint 13 frontend-only flow result — 2026-08-24

| Flow | Sprint 13 result | Constraint/evidence |
|---|---|---|
| Auth/profile | Source/type/build PASS | Login/register/reset, Passport bearer token, `profile/me`, logout, update/image, wishlist, 401 cleanup. Full profile PII cookie removed. `BLOCKED_BY_STAGING_ACCESS` for E2E. |
| Guest cart | Accepted parity | `GUEST_CART_IP_IDENTITY = ACCEPTED_EXISTING_PARITY`; no unauthorized guest-token invention. |
| Cart/coupon/rental/checkout | Source contract PASS | Correct append/list/remove, rental route, selected `currency_id`, `payment_method`, coupon and booking payloads. Safe production mutation not run. |
| PayPal/Fawaterk callbacks | Frontend safety PASS; sandbox BLOCKED | Client effect only; `invoice_id` required; no SSR/metadata/layout/static/prefetch mutation; same-load request deduplication. |
| Contact/tour inquiry/custom trip | Payload PASS | Confirmed fields; WhatsApp destination centralized. `FRONTEND_TOKEN_PRESENT`; `BACKEND_VERIFICATION_NOT_CONFIRMED`. |

No production form, cart, account, booking, or payment mutation was performed.

## Sprint 15 cart/checkout hardening — 2026-08-25

| Flow | Result | Evidence |
|---|---|---|
| Tour option editing | PASS by API/Nuxt/source contract | Customer sees option name and adult/child price checkboxes. Submitted IDs originate only from selected API objects. |
| Coupon | PASS by source and empty-cart runtime | Code-only customer input; validated response ID is internal; invalid or changed code clears stale state. |
| Payment | PASS by source/runtime | Debit/Credit Card and PayPal only; no numeric field; Nuxt-confirmed Card gateway value remains internal. |
| Cart localization | PASS | Root plus `fr/de/it/pt/es/zh` headings, empty/loading copy, controls, totals, and actions use the existing dictionary system. |
| Checkout localization | PASS | Seven locale forms expose localized billing fields, payment label/choices, note, and submit/loading copy. |
| Visible internal-ID audit | PASS | Zero option-ID, coupon-ID, payment-method-ID, database-ID, or backend-ID controls in source selectors and rendered empty-cart/checkout forms. |

Protected cart/coupon/booking/payment mutations were not sent to production. Populated-cart UI and payment outcomes require approved staging data.
