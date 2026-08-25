# Full API endpoint parity matrix

Authority: current Laravel `routes/api.php`, then Nuxt and Next call sites. All routes are under `/api` and `api.localize`; `Auth` means `auth:client` bearer authentication. No mutating endpoint was invoked during this audit.

| Method / endpoint | Auth | Nuxt use | Next use | Payload / response parity | Status |
|---|:--:|---|---|---|---|
| `GET payments/fawaterk/methods` | No | Checkout methods | Checkout/payment selection | Available; exact UI consumption limited | BLOCKED |
| `GET payments/fawaterk/update/invoice` | No | Fawaterk callbacks | All three Fawaterk callbacks | Query/invoice guarded; client-only call | MATCHED |
| `GET payments/paypal/capture` | No | PayPal verify | PayPal verify callback | Query/invoice guarded | MATCHED |
| `GET payments/paypal/cancel` | No | PayPal cancel | PayPal canceled callback | Query/invoice guarded | MATCHED |
| `GET cart/list` | Guest/IP or bearer context | Cart | Cart | Response consumed | MATCHED |
| `POST cart/tours/append` | Guest/IP or bearer context | Tour booking | Tour detail/cart | Season/options/party/date payload constructed | MATCHED |
| `POST cart/rentals/append` | Guest/IP or bearer context | Rental form | Rental form | Exact append shape; `currency_id` comes from the selected live currency | MATCHED |
| `DELETE cart/remove/{item}` | Guest/IP or bearer context | Cart remove | Cart remove | Next derives tour ID vs rental row ID | MATCHED |
| `DELETE cart/clear` | Guest/IP or bearer context | Cart clear | Cart clear | Implemented | MATCHED |
| `POST bookings` | No | Checkout | Checkout | Required customer, payment, coupon, currency fields represented | MATCHED |
| `GET wishlist` | Auth | Favourites | Favourites | Bearer request, pagination | MATCHED |
| `PUT wishlist/{tour}/toggle` | Auth | Tour cards/detail | Next wishlist helper | Bearer request | MATCHED |
| `PATCH profile` | Auth | Profile settings | Profile settings | Bearer update | MATCHED |
| `GET profile/me` | Auth | Session/profile refresh | Account/profile hydration | Bearer refresh replaces stale cookie state; 401 clears local session | MATCHED |
| `POST profile/change/image` | Auth | Profile image | Profile/settings upload | Multipart `image`, client 2 MB guard, then `profile/me` refresh | MATCHED |
| `POST profile/logout` | Auth | Logout | Account logout | Server token revoked before local cookies are cleared | MATCHED |
| `GET coupons/{code}/validate` | Auth | Cart coupon | Cart coupon | Bearer call and coupon ID extraction | MATCHED |
| `GET bookings` | Auth | Booking history | Booking history | Bearer list | MATCHED |
| `GET bookings/{id}` | Auth | No dedicated detail rendering found | Not implemented | Conditional scope not triggered; list is the Nuxt-visible surface | BACKEND_ONLY |
| `POST auth/login` | No | Sign in | Sign in | Access token stored client-side | MATCHED |
| `POST auth/register` | No | Sign up | Sign up | Core fields represented | MATCHED |
| `POST auth/password/forget` | No | Forgot password | Forgot password | Email payload | MATCHED |
| `POST auth/password/reset` | No | Create password | Create password | Email/OTP/password confirmation | MATCHED |
| `POST auth/password/otp/verify` | No | Confirm code | Confirm code | Email/OTP payload | MATCHED |
| `GET auth/{provider}/redirect` | No | Social login | Google/Facebook links | Both provider links use the confirmed redirect route | MATCHED |
| `GET auth/{provider}/callback` | No | Social callback redirects to `/social-login` | `/social-login` and localized callback routes | Token/user callback payload creates the client session and redirects home | MATCHED |
| `POST client/reset-password` | — | Stale historical expectation | No call remains | Removed; current reset modes use `auth/password/reset` | DEPRECATED |
| `POST custom/trips` | No | Custom trip | Planner request | Core fields and reCAPTCHA generated | BLOCKED |
| `GET destinations` | No | Home, trips, category pages | Home/sitemap/category pages and Trips filter | Live localized list and backend slugs drive filters | MATCHED |
| `GET destinations/{slug}` | No | Destination landing | Destination catch-all | Reliable 404 semantics | MATCHED |
| `GET categories` | No | Trips/category pages | Sitemap, category pages, and Trips taxonomy/children | Live IDs/slugs/titles drive filters | MATCHED |
| `GET categories/count` | No | Trips count/filter | Trips server loader | Count map rendered beside API-derived root categories | MATCHED |
| `GET categories/{slug}` | No | Category/event pages | Category/event routes | Reliable 404/error semantics on detail routes | MATCHED |
| `GET tours` | No | Home/lists/related/search | Home/lists/related/sitemap | Query filters broadly represented | MATCHED |
| `GET tours/stats` | No | Available capability | No call found | Not shown to be required by current Next UI | BACKEND_ONLY |
| `GET tours/{slug}` | No | Tour detail | Tour detail | Reliable 404 vs transient/error semantics | MATCHED |
| `GET currencies` | No | Currency selector | Currency selector | Live list is authoritative; only the USD bootstrap remains as resilience UI | MATCHED |
| `GET currencies/{id}` | No | Available capability | No call found | List is sufficient for current selector | BACKEND_ONLY |
| `GET countries` | No | Contact/planner | Planner/contact flows | Consumed | MATCHED |
| `GET countries/{id}` | No | Available capability | No call found | List supplies current UI | BACKEND_ONLY |
| `GET pages` | No | Page discovery | Audit/sitemap does not use list | Not required for rendering, useful for discovery | BACKEND_ONLY |
| `GET pages/{key}` | No | Generic pages/SEO | Generic pages/home/metadata and mapped marketing keys | Live page records and SEO consumed | MATCHED |
| `GET tour-reviews` | No | Reviews | Reviews supplied through tour includes; no direct call found | Direct endpoint has no confirmed current Nuxt call; tour includes supply the visible surface | BACKEND_ONLY |
| `POST tour-reviews` | No | No submission UI found in current Nuxt | Not implemented | Conditional scope not triggered | BACKEND_ONLY |
| `POST contact-requests` | No | Contact/home forms | Contact/home forms | reCAPTCHA token generated; safe source audit only | MATCHED |
| `GET blogs` | No | Blog/home/search | Blog/home/sitemap/lists | Consumed | MATCHED |
| `GET blogs/{id}` | No | Blog detail | Blog/travel-guide detail | Slug contract verified; reliable 404/error semantics | MATCHED |
| `GET blogs/search/{search}` | No | No visible search call found in current Nuxt | Not implemented | Conditional scope not triggered | BACKEND_ONLY |
| `GET locations` | No | Rental | Rental/planner | Consumed | MATCHED |
| `GET locations/{id}` | No | Available capability | No direct call found | List supplies current UI | BACKEND_ONLY |
| `POST car/rental/available/destinations` | No | Rental | Home shortcut/planner | Consumed | MATCHED |
| `POST car/rental/search/for/route` | No | Nuxt rental pricing/search | Rental planner selection and pre-append validation | Exact pickup/destination contract used | MATCHED |
| `POST car/rental/checkout` | No | No active direct checkout call found in current Nuxt rental form | Not implemented | Conditional scope not triggered | BACKEND_ONLY |
| `GET car-rentals` | No | No active inventory UI call found in current Nuxt rental form | Not implemented | Conditional scope not triggered | BACKEND_ONLY |
| `GET car-rentals/{id}` | No | No active rental detail UI found | Not implemented | Conditional scope not triggered | BACKEND_ONLY |
| `GET settings` | No | Global footer/contact/social/team | Filtered public settings keys in shell/contact/about | Site title/logo/emails/social/location/team consumed without exposing unrelated options | MATCHED |
| `GET faqs` | No | Home/FAQ | Home/FAQ | Consumed | MATCHED |
| `GET faqs/{id}` | No | FAQ detail capability | No dedicated detail route | List supplies current UX | BACKEND_ONLY |
| `GET blog-categories` | No | Travel guide | Travel guide/sitemap | Consumed | MATCHED |
| `GET blog-categories/{id}` | No | Guide category | Guide category/article | Reliable semantics | MATCHED |
| `GET customized-trip-categories` | No | Make trip | Planner loaders | Consumed where configured | MATCHED |
| `GET customized-trip-categories/{id}` | No | Capability | No direct use found | List supplies current form | BACKEND_ONLY |
| `GET custom-pages/{slug}` | — | Nuxt marketing component calls it | No supported backend endpoint | Absent from current backend; do not preserve this stale contract | DEPRECATED |

## Contract-level findings

- Localization is conveyed by the shared API client and is present on most Next calls.
- Auth compatibility is bearer-token based and aligns with `auth:client`; profile refresh, server logout, image upload, password reset, and social callback completion are wired.
- Guest cart identity remains backend IP-based. This matches current backend behavior but can merge users behind shared NAT; it is an inherited risk, not a Next-only regression.
- Checkout field names align with `BookingRequest`; payment-method-specific IDs are conditionally supplied.
- Rental discovery, route search, and cart append match the active Nuxt surface. Direct rental checkout/inventory endpoints are not used by that surface and remain `BACKEND_ONLY`.
- `client/reset-password` is a removed dead contract; `auth/password/reset` is the only current reset endpoint.

API endpoint parity: **PARTIAL**. Production cutover: **BLOCKED** by staging mutation/propagation proof and external-owner items, not by the Sprint 12 endpoint implementations.

## Required contract classifications

| Classification | Endpoints |
|---|---|
| MATCHED (45) | Core pages, tours/categories/destinations lists/details, blogs, guide categories, FAQs, currencies/countries lists, contact/custom-trip core, cart tour CRUD, booking create, auth core, wishlist, profile update, coupons, and payment callbacks. |
| BLOCKED (2) | Fawaterk method-selection consumption and custom-trip environment validation still require environment or owner proof. |
| NUXT_ONLY (0) | No confirmed Sprint 12 P1 surface remains; booking detail, review submission, blog search, and direct rental checkout/inventory were not active Nuxt UI contracts. |
| NEXT_ONLY (0) | No unsupported Next-only API call remains; the invalid reset-password call was removed. |
| BACKEND_ONLY (14) | Booking detail, direct review list/submission, blog search, car-rental inventory/detail, and several convenience endpoints that have no confirmed current Nuxt surface. |
| DEPRECATED (2) | The absent historical `client/reset-password` and `custom-pages/{slug}` contracts are not preserved. Current reset and marketing records use confirmed endpoints. |
