# API Endpoint Inventory

Source of truth: `nuxt_sunpyramids/composables/useApi.js`, Nuxt pages/components, `lib/api.ts`, `lib/client-api.ts`, and `lib/data.ts`.

## API Client Behavior

| Area | Nuxt | Next | Status |
|---|---|---|---|
| Base URL | `runtimeConfig.public.baseURL` | `API_BASE`, default `https://sunpyramidtours.com/api/` | Preserved backend domain separation. |
| Locale header | `X-Localize: locale.value` | `X-Localize: options.locale || "en"` | Preserved concept. Needs locale response validation. |
| Auth header | Bearer from `sunpyramids-token` cookie | Server reads cookie in `apiFetch`; client reads cookie in `apiGet`/`apiPost` | Preserved concept. Customer flows need validation. |
| Error handling | Throws from `useFetch` / `$fetch` | Server returns `null`; client throws on non-OK | Acceptable but must be considered in UI validation. |
| Cache | Nuxt SSR/useFetch behavior | Server `force-cache` with default `revalidate: 300`; selected tour fetch `180`; sitemap `1800` | Needs final dashboard freshness approval. |

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
| `contact-requests` | Contact, landing, need-help, event booking style leads | `ContactForm` posts here | Public | Needs recaptcha/tracking parity validation. |
| `custom/trips` | Make Your Trip submission | Route/UI clone only | Optional token | Pending implementation/validation. |
| `locations?page_limit=200&order_by=id,asc` | Rent car and shortcuts | Not fully wired | Public | Pending. |
| `car/rental/available/destinations?...` | Rent car dependent destination options | Not fully wired | Public | Pending. |
| `car/rental/search/for/route` | Rent car search | Not fully wired | Public | Pending. |
| `cart/rentals/append` | Add rental to cart | Not fully wired | Optional token | Pending. |
| `cart/tours/append` | Add tour to cart | Not fully wired | Optional/auth | Pending. |
| `cart/list` | Cart page | Route/UI clone only | Optional/auth | Pending. |
| `cart/remove/{id}` | Remove cart item | Not wired | Auth/context-dependent | Pending. |
| `cart/clear` | Clear cart | Not wired | Auth/context-dependent | Pending. |
| `coupons/{code}/validate` | Cart coupon | Not wired | Auth/context-dependent | Pending. |
| `bookings` | Checkout booking creation | Route/UI clone only | Auth/context-dependent | Critical blocker. |
| `bookings/update/{id}` | Checkout/payment status update | Route/UI clone only | Auth/context-dependent | Critical blocker. |
| `wishlist/{id}/toggle` | Tour cards/profile favourites | Not wired in Next cards | Auth | Pending. |
| `wishlist?page=1&page_limit=200` | Profile favourites | Route/UI clone only | Auth | Pending. |
| `bookings?page_limit=200&includes=currency,tours` | Profile bookings | Route/UI clone only | Auth | Pending. |
| `profile` PATCH | Profile settings | Route/UI clone only | Auth | Pending. |
| `auth/login` | Sign in | Route/UI clone only | Public | Pending. |
| `auth/register` | Sign up | Route/UI clone only | Public | Pending. |
| `auth/password/forget` | Forgot/confirm resend | Route/UI clone only | Public | Pending. |
| `auth/password/otp/verify` | Confirm code | Route/UI clone only | Public | Pending. |
| `auth/password/reset` | Create password | Route/UI clone only | Public | Pending. |
| `client/reset-password` | Reset password | Route/UI clone only | Public | Pending. |
| `payments/paypal/capture?invoice_id=...` | PayPal verify callback | Client-only `PaymentCallbackStatus` | Browser invoice id | Implemented client-side only; backend validation pending. |
| `payments/paypal/cancel?invoice_id=...` | PayPal canceled callback | Client-only `PaymentCallbackStatus` | Browser invoice id | Implemented client-side only; backend validation pending. |
| `payments/fawaterk/update/invoice?invoice_id=...` | Fawaterk callbacks | Client-only `PaymentCallbackStatus` | Browser invoice id | Implemented client-side only; backend validation pending. |

## Backend Requirements / Unknowns

- Confirm current API response envelopes for authenticated cart/profile/checkout endpoints.
- Confirm whether wishlist/listing endpoints require auth or support optional token state.
- Confirm recaptcha enterprise action names and required backend validation fields.
- Confirm payment callback endpoints are still approved for client-side Nuxt-equivalent calls.
- Confirm whether settings/footer/menu/currency are dashboard-managed and must be wired dynamically before cutover.
