# API Endpoint Inventory

Source of truth: `nuxt_sunpyramids/composables/useApi.js`, Nuxt pages/components, `lib/api.ts`, `lib/client-api.ts`, and `lib/data.ts`.

## API Client Behavior

| Area | Nuxt | Next | Status |
|---|---|---|---|
| Base URL | `runtimeConfig.public.baseURL` | `API_BASE`, default `https://sunpyramidtours.com/api/` | Preserved backend domain separation. |
| Locale header | `X-Localize: locale.value` | `X-Localize: options.locale \|\| "en"` | Preserved concept. Needs locale response validation. |
| Auth header | Bearer from `sunpyramids-token` cookie | Server reads cookie in `apiFetch`; client reads cookie in `apiGet`/`apiPost`/`apiPatch`/`apiPut`/`apiDelete` when requested | Preserved concept. Customer flows need staging validation. |
| Error handling | Throws from `useFetch` / `$fetch` | Server returns `null`; client throws on non-OK | Acceptable but must be considered in UI validation. |
| Cache | Nuxt SSR/useFetch behavior | Server `force-cache` with default `revalidate: 300`; selected tour fetch `180`; sitemap API fetches use `cache: "no-store"` with a 15-second timeout | Needs final dashboard freshness approval. |

## Public Content Endpoints

| Endpoint / pattern | Nuxt usage | Next usage | Auth | Status |
|---|---|---|---|---|
| `pages/home?includes=seo` | Homepage | `getHome()` | Public | Implemented. |
| `pages/{slug}?includes=seo,metas` | Static/marketing pages | `getPage()` | Public | Implemented for many pages. |
| `pages/tours-search-results?includes=seo` | `/trips` | `getPage("tours-search-results")` | Public | Implemented. Search filters pending. |
| `pages/car-rental?includes=seo` | `/rent-car` | Generic metadata config | Public | Route exists; API slug mapping needs parity review. |
| `pages/make-your-trip?includes=seo` | `/make-your-trip` | Generic metadata config | Public | Route exists; form flow pending. |
| `pages/blog?includes=seo` | Travel guide root | `getPage("blog")` | Public | Implemented. |
| `pages/all-blogs?includes=seo` | Blogs list | `getPage("all-blogs")` | Public | Implemented. |
| `pages/contact-us?includes=seo` | Contact page | `getPage("contact-us")` | Public | Implemented. |
| `tours/{slug}?includes=seo,gallery,category,destination,itinerary,includes,excludes,faqs,reviews` | Tour detail used a broader Nuxt include set | `getTour()` | Public | Implemented with slightly different includes; validate tour detail parity. |
| `tours?...` | Listings, related tours, searches | `getTours()` | Public/auth optional in Nuxt for wishlist | Implemented for representative lists. Full filters/wishlist pending. |
| `destinations?parent.slug=egypt&order_by=display_order,asc` | One-day/category/home destination lists | `getDestinations()` | Public | Implemented. |
| `categories/{slug}?includes=seo,children` | Category pages/events | `getCategory()` | Public | Implemented. |
| `categories?parent_id=55...` | Events listing | `getCategories()` | Public | Implemented. |
| `blog-categories...` | Travel guide categories | `getBlogCategories()`, `getBlogCategory()` | Public | Implemented. |
| `blogs`, `blogs/{slug}` | Blog lists/details | `getBlogs()`, `getBlog()` | Public | Implemented. |
| `faqs?page_limit=200` | FAQ sections | `getFaqs()` | Public | Implemented. |
| `settings`, `countries`, `currencies` | Shared store/header/forms | Not fully represented | Public | Gap: dynamic settings/currency/country behavior requires validation/implementation. |

## Forms and Customer Flow Endpoints

| Endpoint / pattern | Nuxt usage | Current Next status | Auth | Cutover status |
|---|---|---|---|---|
| `contact-requests` | Contact, landing, need-help, event booking style leads | `ContactForm` posts Nuxt-compatible fields here | Public | Needs backend recaptcha/tracking parity validation. |
| `custom/trips` | Make Your Trip submission | `PlannerRequestFlow` posts Nuxt-aligned request payload with `recaptcha_token` | Optional token | Implemented; staging validation pending. |
| `locations?page_limit=200&order_by=id,asc` | Rent car and shortcuts | `PlannerRequestFlow` fetches pickup locations | Public | Implemented; staging validation pending. |
| `car/rental/available/destinations?...` | Rent car dependent destination options | `PlannerRequestFlow` fetches drop-off destinations after pickup selection | Public | Implemented; staging validation pending. |
| `car/rental/search/for/route` | Rent car search | Confirmed in Nuxt but not required for current minimal append flow | Public | Documented; optional price preview pending. |
| `cart/rentals/append` | Add rental to cart | `PlannerRequestFlow` posts Nuxt-aligned rental payload | Optional token | Implemented; staging validation pending. |
| `cart/tours/append` | Add tour to cart | Not fully wired | Optional/auth | Pending. |
| `cart/list` | Cart page | `/cart` fetches with optional token from client | Optional/auth | Implemented; staging validation pending. |
| `cart/remove/{id}` | Remove cart item | `/cart` remove action calls endpoint from client | Auth/context-dependent | Implemented; staging validation pending. |
| `cart/clear` | Clear cart | `/cart` clear action calls endpoint from client | Auth/context-dependent | Implemented; staging validation pending. |
| `coupons/{code}/validate` | Cart coupon | `/cart` coupon form calls endpoint with token | Auth/context-dependent | Implemented; staging validation pending. |
| `bookings` | Checkout booking creation | `/cart/checkout` posts from client and redirects to returned payment URL | Auth/context-dependent | Implemented first pass; staging validation remains critical blocker. |
| `bookings/update/{id}` | Checkout/payment status update | `/cart/checkout` calls after booking creation when payment method is selected | Auth/context-dependent | Implemented first pass; sandbox validation remains critical. |
| `wishlist/{id}/toggle` | Tour cards/profile favourites | Helper added in `CustomerFlows`; card wiring pending | Auth | Partial; staging validation pending. |
| `wishlist?page=1&page_limit=200` | Profile favourites | `/profile/favourites` fetches from client after token check | Auth | Implemented; staging validation pending. |
| `bookings?page_limit=200&includes=currency,tours` | Profile bookings | `/profile/bookings` fetches from client after token check | Auth | Implemented; staging validation pending. |
| `profile` PATCH | Profile settings | `/profile/settings` patches from client after token check | Auth | Implemented; staging validation pending. |
| `auth/login` | Sign in | `/auth/sign-in` posts login and stores Nuxt cookies | Public | Implemented; staging credentials pending. |
| `auth/register` | Sign up | `/auth/sign-up` posts registration | Public | Implemented; staging validation pending. |
| `auth/password/forget` | Forgot/confirm resend | `/auth/forget-password` posts email; confirm resend still pending | Public | Partial; staging validation pending. |
| `auth/password/otp/verify` | Confirm code | `/auth/confirm-code` posts email/OTP | Public | Implemented; staging validation pending. |
| `auth/password/reset` | Create password | `/auth/create-password` posts email/OTP/password | Public | Implemented; staging validation pending. |
| `client/reset-password` | Reset password | `/auth/reset-password` posts email/token/password | Public | Implemented; staging validation pending. |
| `payments/paypal/capture?invoice_id=...` | PayPal verify callback | Client-only `PaymentCallbackStatus` | Browser invoice id | Implemented client-side only; backend validation pending. |
| `payments/paypal/cancel?invoice_id=...` | PayPal canceled callback | Client-only `PaymentCallbackStatus` | Browser invoice id | Implemented client-side only; backend validation pending. |
| `payments/fawaterk/update/invoice?invoice_id=...` | Fawaterk callbacks | Client-only `PaymentCallbackStatus` | Browser invoice id | Implemented client-side only; backend validation pending. |

## Backend Requirements / Unknowns

- Confirm current API response envelopes for authenticated cart/profile/checkout endpoints.
- Confirm whether wishlist/listing endpoints require auth or support optional token state.
- Confirm recaptcha enterprise action names and required backend validation fields.
- Confirm payment callback endpoints are still approved for client-side Nuxt-equivalent calls.
- Confirm whether settings/footer/menu/currency are dashboard-managed and must be wired dynamically before cutover.
- Confirm checkout `bookings/update/{id}` timing/payment method contract with staging data before production cutover.

## Sprint 4 Notes

- No new backend endpoints were invented or added.
- reCAPTCHA script loading moved from global layout loading to submit-time client loading in `lib/recaptcha.ts`; the submitted `recaptcha_token` field for `contact-requests` is unchanged.
- Diagnostic `?no-third-party=1` mode suppresses third-party script loading only; it does not change API endpoints or public SEO output.

## Sprint 5 Notes

- Confirmed customer-flow endpoints were wired without inventing backend routes or response fields.
- `bookings/update/{id}`, cart remove/coupon/edit, rent-car append, and make-your-trip submission now have Next client-side entry points.
- Runtime staging validation is still pending because credentials, cart data, coupon data, and sandbox invoice IDs were not available.
