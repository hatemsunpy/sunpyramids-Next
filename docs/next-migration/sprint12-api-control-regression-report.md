# Sprint 12 — API control regression report

Date: 2026-08-24 (Africa/Cairo)

## Endpoint classification

The current Laravel `routes/api.php` exposes 61 audited API routes. The matrix also retains two absent historical contracts as `DEPRECATED`, for 63 total contract rows:

| Classification | Count | Meaning |
|---|---:|---|
| MATCHED | 45 | Confirmed active contract is implemented by Next. |
| BLOCKED | 2 | Core contract exists, but a non-P1 UI or environment refinement remains. |
| BACKEND_ONLY | 14 | No active current Nuxt UI contract requires the endpoint. |
| DEPRECATED | 2 | Separate from the 61-route total: stale absent calls intentionally not preserved (`client/reset-password`, `custom-pages`). |
| NUXT_ONLY | 0 | No confirmed active Nuxt-only contract remains. |
| NEXT_ONLY | 0 | No unsupported Next-only API contract remains. |
| MISSING / current FAIL | 0 | No confirmed Sprint 12 P1 endpoint remains missing. |

See `full-api-endpoint-parity-matrix.md` for row-level evidence.

## Safe runtime checks

| Surface | Result |
|---|---|
| Filtered settings keys | Production GET 200; shapes matched setting arrays/objects. |
| `categories/count` | Production GET 200; count map rendered in local SSR. |
| `categories` and Egypt `destinations` | Production GET 200; IDs/slugs/titles consumed. |
| Currencies | Production GET 200; live list remains primary. |
| Valid page/blog/tour detail | Local production server 200; metadata retained. |
| Invalid reliable details | Existing Sprint 11 404/error classification retained; build regression passed. |
| Authenticated GETs | Not invoked: obtaining a production token was outside the safe read-only audit. |
| Mutating endpoints | Not invoked. Contracts were verified from Nuxt call sites, Laravel routes/controllers/requests, and Next source. |

## Conditional endpoint decisions

- `GET bookings/{id}`: Laravel exists, but current Nuxt renders booking history only; classified `BACKEND_ONLY`.
- `POST tour-reviews`: Laravel exists, but current Nuxt has no review-submission call/UI; classified `BACKEND_ONLY`.
- `GET blogs/search/{search}`: Laravel exists, but current Nuxt has no visible/direct search behavior; classified `BACKEND_ONLY`.
- Direct `car/rental/checkout` and `car-rentals` inventory/detail: not active in the current Nuxt rental form; classified `BACKEND_ONLY`.

## Contract regressions prevented

- Rental cart append no longer forces currency ID 1; it submits the currently selected live currency.
- Rental route search runs with exact `pickup_location_id` and `destination_id` before append.
- `profile/me` refreshes cookie snapshots, 401 invalidates the local session, logout revokes the bearer token, and image upload sends multipart form data under the validated `image` key.
- Both reset-password modes use `auth/password/reset`; the nonexistent `client/reset-password` call is absent.
- `/social-login` and localized variants now consume the Nuxt callback token/user contract.
- New taxonomy/settings/team server GETs use bounded retry/error classification.

## Security/ownership blockers

1. The unfiltered public `GET settings` endpoint currently returns operational and secret settings. Backend owner action is required: public allowlist/resource, authorization for internal keys, cache purge, and credential rotation. Next mitigates exposure by requesting only exact public keys, but cannot secure the API itself.
2. `BookingController::show` loads by ID without visibly applying the authenticated client ID constraint. Although the route is not used by the current Nuxt/Next UI, backend ownership scoping must be fixed before enabling booking detail.
3. Guest cart identity remains IP-derived; shared NAT collision risk requires an owner-approved backend identity design.

Regression result: **code/build/read-only runtime PASS; authenticated mutation propagation NOT RUN; production cutover BLOCKED**.
