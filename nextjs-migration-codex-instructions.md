# Sun Pyramids Tours — Nuxt to Next.js Migration Instructions for Codex

## Purpose

Use this file as the main working instruction file for **Codex** while migrating the Sun Pyramids Tours frontend from **Nuxt 3 SSR** to **Next.js App Router**.

This file is intentionally **not Claude-specific**.

Codex should treat this as a repository-first engineering spec:

- Inspect the current code before editing.
- Produce missing discovery documents before broad implementation.
- Make small, targeted changes.
- Preserve the current Nuxt UI/UX.
- Preserve dashboard/API-driven behavior.
- Preserve SEO, routes, multilingual behavior, forms, checkout, payment, and customer flows.
- Do not cut over to production until all validation gates pass.

---

# 1. Project Context

Current frontend:

```text
Nuxt 3.15 SSR
Vue components
Dashboard/API-driven content
Dashboard/API-driven SEO
Multilingual public routes
```

Target frontend:

```text
Next.js App Router
React
TypeScript preferred
Server Components where appropriate
Client Components only where interaction is required
Dashboard/API-driven content
Server-rendered SEO-critical content
```

Backend/API/dashboard:

```text
Existing Laravel backend/dashboard
```

Public frontend domain:

```text
https://sunpyramidstours.com
```

Backend/API/dashboard domain:

```text
https://sunpyramidtours.com
```

Important:

```text
sunpyramidtours.com is not a typo when used for backend/API/dashboard requests.
```

This migration is:

```text
Nuxt frontend concept rebuilt in Next.js.
```

This migration is not:

```text
A redesign
A static rebuild
A dashboard rebuild
A backend rebuild
A hardcoded content rebuild
A new business logic implementation
```

---

# 2. Global Engineering Rules

All Codex tasks must follow these rules:

1. Verify current code before changing it.
2. Keep changes minimal and targeted.
3. Do not hardcode SEO values.
4. Do not break dashboard-driven SEO.
5. Do not remove crawlable links.
6. Do not hide SEO-critical content behind `ClientOnly`.
7. Do not break multilingual routes.
8. Do not break booking or contact forms.
9. Do not blindly replace backend domain references.
10. Public SEO URLs must use `https://sunpyramidstours.com`.
11. Backend/API calls may use `https://sunpyramidtours.com`.
12. Do not add trailing-slash locale redirects unless requested.
13. Test after every sprint.
14. Document changed files and results.
15. Preserve the current Nuxt UI/UX unless a change is explicitly approved.
16. Preserve API-driven behavior from the Laravel backend/dashboard.
17. Do not replace dynamic dashboard/API content with static local content.
18. Do not create `/en` routes unless explicitly approved.
19. Do not add Arabic routes unless fully supported and approved.
20. Do not start broad implementation before route, component, API, SEO, i18n, form, and customer-flow parity maps are documented.
21. Do not trigger payment mutation APIs from SSR, metadata generation, static generation, layouts, or route prefetch.
22. Payment callback pages must remain UI-safe / SSR-safe clones.

---

# 3. Codex Operating Mode

Codex must work in this order:

```text
1. Inspect relevant files.
2. Report what exists.
3. Identify confirmed gaps only.
4. Make the smallest safe change.
5. Run available tests/checks.
6. Document changed files and results.
```

Do not:

```text
Make large unrelated rewrites.
Redesign UI.
Invent API response fields.
Invent backend behavior.
Replace API data with local static data.
Change routes without documenting parity impact.
Move payment mutation logic server-side.
```

When uncertain, Codex should:

```text
Document the uncertainty.
Add a TODO or backend requirement.
Avoid guessing.
Avoid unsafe production behavior.
```

---

# 4. Preserve Current UI/UX

The Next.js version must match the current Nuxt UI as closely as possible.

Preserve:

```text
Same layout
Same header
Same footer
Same homepage sections
Same tour cards
Same blog cards
Same destination/category sections
Same buttons
Same colors
Same typography as much as possible
Same responsive behavior
Same forms
Same booking/contact flow
Same auth/profile/cart/checkout flow
Same language switcher behavior
Same navigation structure
Same visual hierarchy
Same content placement
Same CTA placement
Same review/trust sections where present
```

Do not redesign components unless required to fix a confirmed bug or performance issue.

Any UI change must be documented and justified.

---

# 5. Backend/Dashboard Remains the Source of Truth

Everything currently dynamic in Nuxt must remain dynamic in Next.js.

Do not hardcode production values for:

```text
SEO data
Page titles
Page descriptions
Tour content
Tour prices
Tour images
Tour categories
Destinations
Blogs
Marketing pages
Homepage sections
Menus
Footer content if dashboard/API-driven
Schema
Canonical overrides
Open Graph data
Twitter data
FAQs
Forms content
Banners
Reviews/testimonials if API-driven
Static slugs for dashboard-managed pages
Sitemap URLs that should come from API/database
```

Mock data is allowed only temporarily during development and must be removed before production.

Do not create production pages from local JSON files unless explicitly approved.

---

# 6. Domain Separation Rules

Frontend public pages:

```text
https://sunpyramidstours.com
```

Backend/API/dashboard requests:

```text
https://sunpyramidtours.com
```

Public SEO URLs must use frontend domain:

```text
canonical
hreflang
og:url
sitemap URLs
robots sitemap reference
public-facing structured data URL fields
```

Backend domain may remain for:

```text
fetch()
API clients
dashboard requests
admin requests
backend media calls
Laravel endpoints
```

Acceptance:

```text
No backend domain appears in canonical, hreflang, og:url, sitemap URLs, or robots sitemap reference.
Backend domain still works for API requests.
No API calls break because of incorrect domain replacement.
```

---

# 7. Dashboard-Driven SEO Requirements

The current dashboard SEO system must remain the source of truth.

Do not:

```text
Hardcode SEO values in Next.js pages
Rebuild the Laravel SEO dashboard
Remove existing dashboard SEO fields
Inject fixed static SEO values
Invent schema, prices, reviews, ratings, availability, business data, or route metadata
```

Dashboard SEO fields may include:

```text
Meta Title
Meta Description
Meta Keywords
OpenGraph Title
OpenGraph Description
Canonical
Structure Schema
Viewport
Robots
Open Graph Type
Twitter Card
Twitter Creator
Open Graph Image
Twitter Image
Language-specific SEO tabs
```

Next.js SEO architecture should use:

```text
generateMetadata()
Shared SEO utility functions
Server-side dashboard/API fetch
JSON-LD renderer for valid Structure Schema
```

Fallback priority:

```text
1. Dashboard SEO field for the current page and current language
2. Actual page/tour/blog content field for the current language
3. Global SEO defaults from dashboard/config/API
4. Safe frontend fallback only as a last resort
```

Meta Keywords rule:

```text
Meta Keywords may remain in the dashboard.
Do not render <meta name="keywords"> publicly.
```

Structure Schema rule:

```text
Validate before rendering.
Render only valid JSON-LD.
Empty/invalid schema must not crash the page.
Do not override valid dashboard schema.
Do not invent schema data.
```

Required utility:

```text
validateAndParseSchema(raw)
```

Expected behavior:

```text
Returns parsed object/array when valid.
Returns null/falsy when empty, invalid, unsupported, or whitespace-only.
```

---

# 8. Next.js Metadata Strategy

Use Next.js App Router Metadata API.

Use `generateMetadata()` for:

```text
title
description
canonical
robots
Open Graph
Twitter
alternates/hreflang where supported
```

Rules:

```text
SEO data must be fetched server-side from API/dashboard.
SEO tags must be visible in raw HTML.
Client-side-only SEO is not acceptable.
Do not rely on client-side effects to render metadata.
Canonical URLs must use frontend domain.
og:url must use frontend domain.
Hreflang URLs must use frontend domain.
x-default must point to English/root.
Do not create /en public routes unless approved.
```

---

# 9. Multilingual Routing Strategy

Supported public locales:

```text
English root: /
French: /fr
German: /de
Italian: /it
Portuguese: /pt
Spanish: /es
Chinese: /zh
```

Rules:

```text
Do not create /en public routes unless explicitly approved.
English/root remains default.
x-default points to English/root.
Hreflang includes only supported locales with available translations.
No Arabic routes unless fully supported and approved.
Locale SEO data must come from the matching dashboard language tab.
English fallback is allowed only when locale field is empty and fallback behavior is documented.
```

Language switcher:

```text
Preserve current behavior and route equivalents.
Do not show raw translation keys.
Do not cause layout shift with spinners/skeletons unless explicitly designed.
```

---

# 10. Route Inventory and Gap Analysis

Do not assume that the current Next.js route tree already represents the full Nuxt application.

Before production cutover:

```text
Create Nuxt route inventory.
Create Next route inventory.
Compare both.
Mark each route as:
- already exists in Next
- requires backend/API validation
- requires business decision
- intentionally excluded
- missing and must be created
```

Do not silently exclude Nuxt-only routes.

Potential customer flows to verify:

```text
auth
login
register
profile
user account
cart
checkout
payment
payment callbacks
booking confirmation
thank-you pages
wishlist/favourites
order history
reset password
email verification
private/semi-private customer flows
```

Cutover is blocked if required auth, cart, checkout, payment, booking confirmation, or customer account flows are missing or unvalidated.

---

# 11. API and Data Fetching Strategy

The Next.js frontend must consume the Laravel backend API like the Nuxt frontend conceptually does.

Required behavior:

```text
Fetch page data from API.
Fetch SEO data from API.
Fetch tour data from API.
Fetch category data from API.
Fetch destination data from API.
Fetch blog data from API.
Fetch custom marketing page data from API.
Fetch language-specific content from API.
Fetch dashboard-managed metadata from API.
Render server-side whenever SEO or crawlability depends on the data.
```

Before coding, document:

```text
Current API endpoints used by Nuxt
Request parameters/includes
Response shapes
SEO object shape
Locale handling
Pagination handling
Error handling
Cache behavior
Required headers
Auth/public access behavior
```

Rules:

```text
Do not guess API shapes.
Do not invent backend fields.
Do not replace API-driven data with local static data.
Use server-side fetch for SEO-critical data.
Do not serialize unnecessary large data into the client bundle.
Fetch only required fields for cards/listing pages.
Document missing backend requirements instead of hardcoding around missing data.
```

---

# 12. Component Migration Strategy

Before implementation, create:

```text
docs/next-migration/component-parity-map.md
```

Required component categories:

```text
Header
Footer
Main navigation
Mobile menu
Language switcher
Currency switcher if present
Homepage hero/banner
Homepage sections
TourCard
FeaturedTourCard
RelatedTourCard
BlogCard
DestinationCard
CategoryCard
Marketing page components
Search/filter forms
Booking form
Contact form
Make Your Trip form
Rent car form
Auth forms
Profile pages
Cart components
Checkout components
Payment callback pages
Gallery/carousel components
FAQ components
Breadcrumbs
Pagination
TrustIndex/review widgets
```

For each component, document:

```text
Nuxt/Vue source file
Next/React target file
Server Component or Client Component
Data source
SEO relevance
Interactivity requirements
Performance risks
Visual parity requirements
Testing requirements
```

Rules:

```text
Use Server Components by default.
Use Client Components only when interactivity is required.
Do not make the entire app client-side.
Do not hide crawlable links behind JavaScript-only behavior.
Preserve visible UI from Nuxt.
```

---

# 13. Image Optimization Strategy

Use Next Image where appropriate.

Rules:

```text
Configure remote image patterns for Laravel storage and Cloudflare/R2/media domains.
Use dashboard/media alt text when available.
Use safe fallback alt text only when missing.
All images must have stable dimensions or layout sizing.
The LCP/hero image must not be lazy-loaded.
LCP image should use priority/fetch priority where appropriate.
Below-the-fold images should lazy-load.
Do not load huge original images for small cards.
Preserve current image appearance and cropping.
```

Local assets:

```text
Photos/banners/rich raster PNGs may be converted to WebP quality 80.
Icons/logos/simple graphics should prefer SVG.
Delete original PNGs only after references are updated and verified.
Keep PNG fallback only for critical images if explicitly required.
Do not modify dashboard/media-library images unless they are local source assets.
```

---

# 14. Sitemap and Robots Strategy

Sitemap must:

```text
Use https://sunpyramidstours.com.
Pull live indexable pages from API/database.
Include static pages, tours, blogs, categories, destinations, and custom marketing pages.
Exclude drafts, disabled pages, noindex pages, unsupported locales, backend/dashboard URLs, and broken routes.
Use real lastmod when available.
Apply 15-second timeout for each sitemap API call.
Return valid XML even if one content group fails.
```

Custom marketing pages:

```text
Must be discovered dynamically from API/dashboard.
Do not hardcode marketing page slugs.
```

Robots must:

```text
Use frontend domain in sitemap reference.
Not block important image assets.
Exclude backend/admin/API paths where appropriate.
```

---

# 15. Forms and Customer Flow Validation

Preserve all existing forms and flows.

Required flows:

```text
Contact form
Booking form
Make Your Trip form
Rent car form
Newsletter/lead forms if present
Auth sign in
Auth sign up
Forgot password
Reset password
Create password
Confirm code
Profile settings
Bookings history
Favourites/wishlist
Cart
Checkout
Payment method selection
Booking creation
Thank-you/booking confirmation
Payment callbacks
```

Do not change endpoints without documenting and approving.

Do not break:

```text
Google Ads conversion tracking
Lead tracking
Thank-you page logic
Booking creation
Payment redirect logic
```

---

# 16. Payment Callback Safety

Payment callback pages must be UI-safe / SSR-safe clones.

They must not trigger payment mutation APIs server-side.

Blocked:

```text
Server-side payment capture
Server-side payment verification that changes payment/order state
Server-side invoice update
Server-side booking confirmation mutation
Server-side refund/cancel mutation
Payment mutation from generateMetadata()
Payment mutation from route prefetch
Payment mutation during SSR/static generation
Payment mutation from layouts
```

Allowed only if it matches existing Nuxt behavior:

```text
Client-side callback call after hydration
Only when user lands on callback URL
Only when browser URL includes required invoice_id
Only against approved backend/payment endpoint
Not during SSR
Not during metadata generation
Not during route prefetch
```

Validation document required:

```text
docs/next-migration/payment-callback-safety-validation.md
```

This document must confirm:

```text
Which callback routes exist
Which endpoint each route calls, if any
Whether the call is client-side only
Whether the call requires invoice_id
Whether the call can run during SSR
Whether route prefetch can trigger it
Test result
Cutover status
```

---

# 17. Required Discovery Documents Before Cutover

Create these under:

```text
docs/next-migration/
```

Required files:

```text
component-parity-map.md
api-endpoint-inventory.md
seo-mapping.md
i18n-routing-plan.md
forms-and-flows-map.md
risk-register.md
production-cutover-checklist.md
ui-parity-report.md
api-driven-behavior-validation.md
payment-callback-safety-validation.md
seo-domain-validation-report.md
sitemap-robots-validation-report.md
```

---

# 18. UI/UX Parity Validation

Compare Nuxt pages against Next pages with screenshots.

Priority pages:

```text
/
/egypt-tours/one-day-tours
/tour/[slug]
/contact-us
/cart
/cart/checkout
/auth/sign-in
/auth/sign-up
/profile
/profile/bookings
/profile/favourites
/profile/settings
```

Validate:

```text
Desktop screenshot comparison
Mobile screenshot comparison
Header parity
Footer parity
Content section parity
Card layout parity
Form layout parity
CTA parity
Language switcher parity
Visual hierarchy parity
No unexpected redesign
```

Fix only visible mismatches that affect current migration scope.

---

# 19. API-Driven Behavior Validation

Confirm no production content/SEO is hardcoded where Nuxt used dashboard/API data.

Validate:

```text
Current Next data helpers against Nuxt API usage
Dashboard-driven content still comes from API
SEO fields still come from API/dashboard
Tour/category/blog/marketing page data comes from API
Forms submit to approved backend endpoints
Missing endpoint handling only where validated from Nuxt code
Backend requirements documented instead of invented fields
```

---

# 20. SEO / Domain Validation

Run raw HTML checks for priority pages.

Check:

```text
<title>
meta description
canonical
Open Graph
Twitter
robots
hreflang
JSON-LD
no public meta keywords
```

Validate:

```text
canonical uses https://sunpyramidstours.com
hreflang uses https://sunpyramidstours.com
og:url uses https://sunpyramidstours.com
sitemap uses https://sunpyramidstours.com
robots points to frontend-domain sitemap
backend/API calls still work with https://sunpyramidtours.com
no backend/admin/API URLs leak into public SEO output
```

---

# 21. Core Web Vitals and Performance

Use mobile Lighthouse as primary validation target.

Targets:

```text
LCP <= 2.5s
CLS <= 0.1
TBT <= 200ms as lab proxy
INP <= 200ms when field data is available
```

Initial audit scope:

```text
Homepage
One representative published tour detail page
```

Official verdict:

```text
Mobile Lighthouse
Normal URL
Third-party scripts enabled
```

Diagnostic mode, if available:

```text
?no-third-party=1
```

Diagnostic mode is not the official verdict.

---

# 22. Testing Before PR / Cutover

Required commands:

```bash
npm run lint
npm run build
```

Also run:

```text
Route smoke tests
Browser screenshots desktop/mobile
Form submission tests on staging
Payment callback SSR-safety check
Lighthouse checks for homepage and tour detail
Raw HTML SEO checks
Sitemap validation
Robots validation
Console hydration/error checks
```

---

# 23. Production Cutover Checklist

Cutover is blocked until:

```text
Required docs completed
Route parity passed
UI parity passed
API-driven behavior passed
SEO/domain validation passed
Sitemap/robots validation passed
Customer flows passed
Payment callbacks passed
Forms passed
Build/lint passed
Lighthouse passed for homepage and tour detail or improvements are documented
Staging backend validation passed
Rollback plan ready
Final approval recorded
```

Rollback triggers:

```text
SEO tags missing
canonical/hreflang broken
sitemap invalid
booking/contact forms broken
auth/cart/checkout/payment broken
tour pages fail
API requests fail
major visual regression
dashboard data not loading
multilingual routes broken
tracking/conversions broken
```

Rollback steps:

```text
Restore Nuxt deployment.
Revert DNS/proxy/routing change.
Purge Cloudflare cache.
Verify homepage, tour page, contact page, booking flow.
Restore previous sitemap if needed.
Investigate Next.js issue on staging.
Reattempt cutover only after fix.
```

---

# 24. Recommended Next Sprint for Codex

Sprint objective:

```text
Create missing migration maps in docs/next-migration/, then run parity validation page by page and fix only confirmed gaps.
```

Sprint tasks:

```text
1. Create component-parity-map.md.
2. Create api-endpoint-inventory.md.
3. Create seo-mapping.md.
4. Create i18n-routing-plan.md.
5. Create forms-and-flows-map.md.
6. Create risk-register.md.
7. Create production-cutover-checklist.md.
8. Create ui-parity-report.md.
9. Create api-driven-behavior-validation.md.
10. Create payment-callback-safety-validation.md.
11. Create seo-domain-validation-report.md.
12. Create sitemap-robots-validation-report.md.
13. Run UI parity screenshots for priority pages.
14. Validate API-driven behavior.
15. Validate payment callback SSR safety.
16. Validate SEO/domain output.
17. Validate sitemap/robots.
18. Run npm run lint.
19. Run npm run build.
20. Fix only confirmed gaps.
21. Document changed files and results.
```

---

# 25. Codex Prompt to Start the Next Sprint

Use this directly in Codex:

```text
Act as the Next.js migration lead for the Sun Pyramids Tours project.

This project is migrating the existing Nuxt 3 SSR frontend to Next.js App Router.

This is not a redesign and not a static rebuild.

Preserve:
- same Nuxt UI/UX
- same dashboard/API-driven content
- same Laravel backend/API dependency
- same dashboard-driven SEO
- same multilingual route behavior
- same booking/contact/auth/cart/checkout/payment flows
- same public URL behavior

Frontend public domain:
https://sunpyramidstours.com

Backend/API/dashboard domain:
https://sunpyramidtours.com

Do not start broad implementation yet.

First, create the missing migration documents under docs/next-migration/:

1. component-parity-map.md
2. api-endpoint-inventory.md
3. seo-mapping.md
4. i18n-routing-plan.md
5. forms-and-flows-map.md
6. risk-register.md
7. production-cutover-checklist.md
8. ui-parity-report.md
9. api-driven-behavior-validation.md
10. payment-callback-safety-validation.md
11. seo-domain-validation-report.md
12. sitemap-robots-validation-report.md

Use the current Nuxt source and current Next app as the source of truth.

Rules:
- Verify current code before changing it.
- Keep changes minimal and targeted.
- Do not hardcode SEO or production content.
- Do not break dashboard-driven SEO.
- Do not replace API-driven content with static local content.
- Do not remove crawlable links.
- Do not break multilingual routes.
- Do not create /en routes unless approved.
- Do not add Arabic routes unless fully supported and approved.
- Do not break booking/contact/auth/cart/checkout/payment flows.
- Do not blindly replace backend domain references.
- Public SEO URLs must use https://sunpyramidstours.com.
- Backend/API calls may use https://sunpyramidtours.com.
- Payment callback pages must remain SSR-safe/UI-safe clones.
- No payment mutation APIs may run during SSR, metadata generation, static generation, layout rendering, or route prefetch.
- Client-side payment callback calls may run only after hydration and only with browser invoice_id if this matches the existing approved Nuxt behavior.

After creating the documents:
- Run UI parity validation for priority pages.
- Run API-driven behavior validation.
- Run payment callback SSR-safety validation.
- Run SEO/domain validation.
- Run sitemap/robots validation.
- Run npm run lint.
- Run npm run build.

Priority pages:
- /
- /egypt-tours/one-day-tours
- /tour/[slug]
- /contact-us
- /cart
- /cart/checkout
- /auth/sign-in
- /auth/sign-up
- /profile
- /profile/bookings
- /profile/favourites
- /profile/settings

Fix only confirmed gaps that affect the current migration scope.
Document all changed files and test results.
```

---

# Appendix A — Current Route Inventory

The following route inventory was provided from the current migration state.

It should be treated as a cutover gate input, not as final production approval.

# Nuxt Route Inventory and Cutover Gate

This inventory compares the original Nuxt route tree in `nuxt_sunpyramids/pages` with the current Next.js `app` router.

Status definitions:

- `already exists in Next`: route exists and renders in the current Next app.
- `requires backend/API validation`: route exists, but production cutover needs API/auth/payment behavior verified against backend contracts.
- `requires business decision`: route exists or is mapped, but product/payment/account behavior must be approved before cutover.
- `intentionally excluded`: no route should be excluded without explicit approval. Current inventory has no intentionally excluded Nuxt routes.

## Summary

Every Nuxt page file is currently accounted for in the Next route tree on this branch.

No Nuxt route is silently excluded.

Production cutover remains blocked until customer flows are validated end-to-end:

- Auth and password flows
- Profile/account area
- Wishlist/favourites
- Cart
- Checkout
- Payment callbacks
- Booking confirmation and booking history

## Public Marketing and Content Routes

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/` | `/` and `/[locale]` | already exists in Next | Home page renders cloned original-style shell and sections. |
| `/about-us` | `/about-us`, `/[locale]/about-us` | already exists in Next | Uses dashboard page data, metas, gallery/team-style sections. |
| `/accessible-travel` | `/accessible-travel`, `/[locale]/accessible-travel` | already exists in Next | Uses cloned impact-page layout. |
| `/blogs/all-blogs` | `/blogs/all-blogs`, `/[locale]/blogs/all-blogs` | already exists in Next | Blog list uses API data and cards. |
| `/blog/[slug]` | `/blog/[slug]`, `/[locale]/blog/[slug]` | already exists in Next | Blog detail exists; validate exact Nuxt sidebar/related behavior before final cutover. |
| `/contact-us` | `/contact-us`, `/[locale]/contact-us` | already exists in Next | Contact form posts to API. |
| `/events` | `/events`, `/[locale]/events` | already exists in Next | Event index uses category cards from API. |
| `/event/[slug]` | `/event/[slug]` | already exists in Next | Requires backend/API validation for category event details and related tours. |
| `/faqs` | `/faqs`, `/[locale]/faqs` | already exists in Next | FAQ list uses API data. |
| `/privacy-and-cookies` | `/privacy-and-cookies`, `/[locale]/privacy-and-cookies` | already exists in Next | Static dashboard content. |
| `/sustainability` | `/sustainability`, `/[locale]/sustainability` | already exists in Next | Uses cloned impact-page layout. |
| `/terms-and-conditions` | `/terms-and-conditions`, `/[locale]/terms-and-conditions` | already exists in Next | Static dashboard content. |
| `/book-egypt-trip` | `/book-egypt-trip` | already exists in Next | Marketing landing route exists; requires business decision for exact campaign parity. |

## Egypt Tours and Travel Guide Routes

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/tour/[id]` | `/tour/[slug]`, `/[locale]/tour/[slug]` | already exists in Next | Nuxt param is named `id`, but data uses slug-like identifiers. Validate booking panel parity. |
| `/trips` | `/trips` | already exists in Next | Search/results page exists; requires backend/API validation for filters, pagination, query params. |
| `/egypt-tours/[slug]` | `/egypt-tours/[...slug]`, `/[locale]/egypt-tours/[...slug]` | already exists in Next | Catch-all covers this route family. |
| `/egypt-tours/one-day-tours` | `/egypt-tours/one-day-tours`, localized catch-all | already exists in Next | Renders destination/category cards like Nuxt. |
| `/egypt-tours/one-day-tours/[slug]` | `/egypt-tours/one-day-tours/[slug]` via catch-all | already exists in Next | Requires backend/API validation for destination-specific tour filtering. |
| `/egypt-tours/multi-days-tours` | `/egypt-tours/multi-days-tours`, localized catch-all | already exists in Next | Covered by catch-all. |
| `/egypt-tours/multi-days-tours/[slug]` | `/egypt-tours/multi-days-tours/[slug]` via catch-all | already exists in Next | Requires backend/API validation for category-specific tour filtering. |
| `/egypt-tours/nile-cruises` | `/egypt-tours/nile-cruises`, localized catch-all | already exists in Next | Covered by catch-all. |
| `/egypt-tours/nile-cruises/[slug]` | `/egypt-tours/nile-cruises/[slug]` via catch-all | already exists in Next | Requires backend/API validation for child category behavior. |
| `/egypt-tours/shore-excursions` | `/egypt-tours/shore-excursions`, localized catch-all | already exists in Next | Covered by catch-all. |
| `/egypt-tours/plan-your-egypt-journy` | `/egypt-tours/plan-your-egypt-journy` | already exists in Next | Alias route exists. Spelling matches Nuxt route. |
| `/egypt-tours/tailor-your-egypt-trip` | `/egypt-tours/tailor-your-egypt-trip` | already exists in Next | Alias route exists. |
| `/egypt-travel-guide` | `/egypt-travel-guide` | already exists in Next | Uses blog category API. |
| `/egypt-travel-guide/[cate]` | `/egypt-travel-guide/[cate]` | already exists in Next | Requires backend/API validation for category children/blogs. |
| `/egypt-travel-guide/[cate]/[id]` | `/egypt-travel-guide/[cate]/[id]` | already exists in Next | Requires backend/API validation for nested category/blog lists. |

## Planner, Rental, and Lead Flows

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/make-your-trip` | `/make-your-trip`, `/[locale]/make-your-trip` | already exists in Next | UI exists. Requires backend/API validation for full multi-step submission parity. |
| `/make_your_trip` | `/make_your_trip` | already exists in Next | Legacy alias exists and maps to make-your-trip page. |
| `/rent-car` | `/rent-car`, `/[locale]/rent-car` | already exists in Next | UI exists. Requires backend/API validation for pricing/route submission. |

## Customer Account, Auth, Cart, and Checkout

These routes are required customer flows. They are currently represented in Next, but production cutover is blocked until they are validated end-to-end with backend APIs, auth cookies, protected-route behavior, and form submissions.

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/auth/sign-in` | `/auth/sign-in` | requires backend/API validation | Route exists with cloned UI. Must validate login API, token cookie, redirects, errors. |
| `/auth/sign-up` | `/auth/sign-up` | requires backend/API validation | Route exists with cloned UI. Must validate registration API and validation messages. |
| `/auth/forget-password` | `/auth/forget-password` | requires backend/API validation | Route exists with cloned UI. Must validate password reset request API. |
| `/auth/reset-password` | `/auth/reset-password` | requires backend/API validation | Route exists with cloned UI. Must validate reset token flow. |
| `/auth/create-password` | `/auth/create-password` | requires backend/API validation | Route exists with cloned UI. Must validate backend flow and route params/query requirements. |
| `/auth/confirm-code` | `/auth/confirm-code` | requires backend/API validation | Route exists with cloned UI. Must validate email/code verification API. |
| `/profile` | `/profile` | requires backend/API validation | Route exists. Must validate auth guard and user profile API. |
| `/profile/bookings` | `/profile/bookings` | requires backend/API validation | Route exists. Must validate bookings API and order history display. |
| `/profile/favourites` | `/profile/favourites` | requires backend/API validation | Route exists. Must validate wishlist API and remove/add behavior. |
| `/profile/settings` | `/profile/settings` | requires backend/API validation | Route exists. Must validate account update API. |
| `/cart` | `/cart` | requires backend/API validation | Route exists. Must validate cart storage, edit/remove, tour/rent item support. |
| `/cart/checkout` | `/cart/checkout` | requires backend/API validation | Route exists. Production cutover blocked until checkout, billing, payment selection, and booking creation are validated. |

## Payment and Booking Confirmation

Payment routes must not trigger payment mutation APIs server-side. In the current Next implementation, payment update calls are client-side only after hydration and only when `invoice_id` exists in the browser URL.

| Nuxt route | Next route | Status | Notes |
|---|---|---|---|
| `/order/payment/callback/paypal/verify` | `/order/payment/callback/paypal/verify` | requires backend/API validation | Calls `payments/paypal/capture?invoice_id=...` client-side only. |
| `/order/payment/callback/paypal/canceled` | `/order/payment/callback/paypal/canceled` | requires backend/API validation | Calls `payments/paypal/cancel?invoice_id=...` client-side only. |
| `/order/payment/callback/fawaterk/success` | `/order/payment/callback/fawaterk/success` | requires backend/API validation | Calls `payments/fawaterk/update/invoice?invoice_id=...` client-side only. |
| `/order/payment/callback/fawaterk/pending` | `/order/payment/callback/fawaterk/pending` | requires backend/API validation | Calls `payments/fawaterk/update/invoice?invoice_id=...` client-side only. |
| `/order/payment/callback/fawaterk/canceled` | `/order/payment/callback/fawaterk/canceled` | requires backend/API validation | Calls `payments/fawaterk/update/invoice?invoice_id=...` client-side only. |
| `/thankful` | `/thankful` | already exists in Next | Booking confirmation/thank-you page exists. Validate final booking copy and redirect targets. |

## Intentionally Excluded Routes

None.

No Nuxt route should be excluded from production cutover unless product/engineering explicitly approves it here.

## Production Cutover Blockers

Before cutover, verify these flows in a staging environment connected to the real backend:

1. Auth: sign in, sign up, forgot/reset/create password, confirm code.
2. Protected account pages: profile, bookings, favourites, settings.
3. Wishlist: add/remove and persisted state.
4. Cart: add tour, add rent car, edit item, remove item, persist after reload/login.
5. Checkout: billing, payment method, booking creation, validation errors.
6. Payment callbacks: PayPal capture/cancel and Fawaterk update invoice, with valid real/sandbox invoice IDs.
7. Booking confirmation: final success route, email/invoice display, booking history update.

Cutover should remain blocked if any required checkout, payment, booking confirmation, or auth flow is missing or unvalidated.

