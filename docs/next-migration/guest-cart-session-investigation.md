# Guest Cart Session Investigation

Date: 2026-08-09
Owner: Next.js migration lead
Scope: guest (non-authenticated) cart append/list/remove and checkout currency behavior for the Next.js clone after commits `af3b5be` (header/currency modal) and `86bb221` (cart/checkout currency).

## Summary

Guest cart **works** in the Next.js frontend with the current backend and CORS setup. The earlier assumption that guest cart relies on an HTTP-only session cookie is **incorrect**. The Laravel API keeps the guest cart server-side and keys it by the **client public IP address**, not by a browser session cookie, bearer token, or custom cart token.

- Append succeeds and returns no `Set-Cookie`.
- `cart/list` returns guest items with **zero** cookies and **no** `Authorization` header.
- Browser `fetch` in the Next.js app uses default `credentials: "same-origin"`; no cookies are ever sent to the cross-origin API, matching the live Nuxt frontend.

## Current Behavior (verified 2026-08-09)

| Call | Method | Auth header | Cookies sent | Response `Set-Cookie` | Result |
|---|---|---|---|---|---|
| `cart/tours/append` | POST | none | none | none (empty) | `{"data":null,"message":"Tour added to cart successfully","status":true}` |
| `cart/rentals/append` | POST | none | none | none | same guest append path |
| `cart/list` | GET | none | none | none | `{"data":[...],"message":"Cart Loaded Successfully","status":true}` — items returned |
| `cart/remove/{id}` | DELETE | none | none | none | removes by product/row ID |
| `bookings` (checkout) | POST | none for guest; bearer when logged in | none | none | booking payload includes `currency_id` |

Browser evidence: a fresh Playwright context (0 app cookies) rendered the guest cart with items appended earlier from the same machine. The `cart/list` request headers contained only `Accept`, `Content-Type`, `X-Localize`, and browser fetch-metadata headers; no `cookie` header, no `authorization` header.

## Nuxt / Live Comparison

| Aspect | Nuxt (live) | Next.js (clone) |
|---|---|---|
| HTTP client | `$fetch` / `useFetch` (`composables/useApi.js`) | `fetch` (`lib/client-api.ts`) |
| `credentials` / `withCredentials` | not set (default omits cross-origin cookies) | not set (`same-origin` default) |
| API base | `https://sunpyramidtours.com/api/` (direct, cross-origin) | `https://sunpyramidtours.com/api/` (direct, cross-origin) |
| Same-origin proxy | none (`nuxt.config.ts` has no routeRules proxy) | none |
| Guest cart identity | server-side, keyed by client IP (no token/cookie in code) | same |

The live production site (`https://sunpyramidstours.com`) is the Nuxt build and behaves the same way: guest cart is IP-keyed and does not use a browser session cookie.

## Backend Contract Findings

- `POST /api/cart/tours/append` stores the guest cart item keyed by the request's public IP and returns a bare success message; it does not issue a session cookie or token.
- `GET /api/cart/list` reads the guest cart for the caller's public IP; no session/token required.
- CORS: `Access-Control-Allow-Origin: *` and `supports_credentials = false`. So even if the API did set a cookie, the wildcard origin plus disabled credentials would prevent the browser from using it. This is acceptable because the API does not use cookies for identity.
- Session driver / SameSite / cookie domain settings are irrelevant for the guest cart because no session cookie is involved.
- Auth (signed-in) flows use Passport bearer tokens via `auth:client`, sent in the `Authorization` header.

## Browser Cookie / CORS Findings

- No `credentials: "include"` is needed; the API is effectively stateless for cart identity.
- A guest's cart survives page reloads as long as the public IP is unchanged, because the identity is stored server-side.
- No frontend cart token, `localStorage`, or cookie exists in either Nuxt or Next.

## Root Cause (of the earlier "append succeeds but list is empty" observation)

The observation was a **misread test artifact**, not a real defect:

1. Guest cart is keyed by public IP on the server and persists across browsers on the same machine/network.
2. In the earlier automated run, items were appended from a headless browser that was then closed; the follow-up `cart/list` in a *different* Playwright run happened to return the items the investigation later proved were from the same IP.
3. The earlier screenshot showing an "empty cart" was taken before the guest items were appended in that same test flow, and the "guest cart is empty" conclusion was incorrectly attributed to a missing HTTP-only session cookie.

In short: **there is no missing session cookie; the feature works.** The real limitation is architectural, not a bug.

## Real Limitation / Risk

Because guest cart identity = client public IP:

- **Shared NAT**: users behind the same office/hotel/cafe/public IP share one cart. Their items collide.
- **IP change = cart loss**: switching networks/VPN/mobile data loses the guest cart.
- **Not per-browser/device**: two different browsers on the same machine see the same cart.

This is the same behavior as the live Nuxt site, so it is a business decision, not a migration regression.

## Recommended Fix Options

### Option A — Backend enables credentialed CORS + session cookies for approved frontend domains
- **Change required**: backend sets a `session`/`cart` cookie with `SameSite=None; Secure`, restricts CORS to approved origins, sets `supports_credentials = true`, and reads identity from the cookie. Frontend adds `credentials: "include"`.
- **Security impact**: enabling credentialed CORS with specific origins is safe if origins are locked down; `Secure`/`SameSite=None` required for cross-site cookie on HTTPS.
- **SEO impact**: none.
- **Checkout impact**: more reliable per-user cart.
- **Production risk**: medium; backend + frontend change, cookie-law/consent considerations.
- **Owner required**: backend owner.
- **Recommended priority**: optional enhancement only if per-user guest cart is a business requirement.

### Option B — Next.js same-origin API proxy
- **Change required**: route all API calls through a Next.js `/api/*` proxy so the browser sees same-site requests; still no cookie unless backend sets one.
- **Security impact**: neutral; hides API origin but does not by itself fix identity (still IP-keyed server-side).
- **SEO impact**: none.
- **Checkout impact**: same as today unless backend adds cookie identity.
- **Production risk**: medium; adds a proxy hop and must preserve headers/timeouts.
- **Owner required**: frontend owner.
- **Recommended priority**: low; does not solve identity on its own.

### Option C — Backend adds explicit `guest_cart_token`
- **Change required**: append returns a token; frontend stores it (cookie/localStorage) and sends it as a header/body field on `cart/list`, `cart/remove`, and `bookings`.
- **Security impact**: token must be unguessable/rate-limited; safest per-user option without cookies.
- **SEO impact**: none.
- **Checkout impact**: reliable per-browser cart; survives IP changes.
- **Production risk**: medium; backend schema/endpoint change + frontend storage/attach logic.
- **Owner required**: backend owner (new/changed endpoints — not to be invented by frontend).
- **Recommended priority**: recommended if business wants reliable per-user guest carts.

### Option D — Guest cart disabled; require sign-in before cart/checkout
- **Change required**: frontend/gateway blocks cart actions until a bearer token exists.
- **Security impact**: simplest, most secure.
- **SEO impact**: none.
- **Checkout impact**: adds friction; may reduce conversion.
- **Production risk**: low; business decision.
- **Owner required**: product/business owner.
- **Recommended priority**: only if business accepts sign-in-first.

### Option E — Keep current behavior (IP-keyed guest cart)
- **Change required**: none.
- **Security impact**: matches live site; shared-IP collision is a known, existing behavior.
- **SEO impact**: none.
- **Checkout impact**: guest cart works as today; not per-user.
- **Production risk**: none (status quo).
- **Owner required**: none for code; product owner to confirm the limitation is acceptable.
- **Recommended priority**: acceptable default if business confirms guest cart parity with the live site is sufficient.

## Selected Recommendation

**Option E (keep current behavior) for cutover**, because it is identical to the live Nuxt site and requires no code change. **Option C** is the recommended follow-up **if and only if** the business requires reliable per-user guest carts; Option C is backend-owner-required and must not be implemented by the frontend alone.

## Production Cutover Impact

- **Does not block cutover**: guest cart works today exactly as on the live site.
- The IP-keyed limitation is pre-existing and identical between Nuxt and Next; it is not a migration regression.
- If the business later requires per-user guest carts, schedule Option C with the backend owner.

## Remaining Blockers

- None for guest cart parity.
- Confirmed earlier blockers (unrelated to this finding): staging payment sandbox, coupon/rent-car/tracking/sitemap/UI-parity approvals, and backend reCAPTCHA confirmation. See `risk-register.md`.

## Validation Evidence

- `npm run lint`: passed.
- `npm run build`: passed.
- Browser: fresh guest context rendered cart items appended from the same IP; guest cart ESP EUR conversion verified (`$128.25` → `€109.01`).
- API: append response headers contain no `Set-Cookie`; list returns data without cookies/auth.
