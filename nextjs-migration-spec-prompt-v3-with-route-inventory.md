# Sun Pyramids Tours — Nuxt to Next.js Migration Spec Prompt

## Purpose

Use this file as the main prompt / instruction file for Claude or any AI coding agent.

The goal is to plan the migration of the current **Sun Pyramids Tours frontend** from **Nuxt 3 SSR** to **Next.js App Router**, while preserving the same dashboard-driven dynamic behavior, same backend API dependency, same UI/UX, same route structure, and same SEO logic.

This is **not** a redesign, not a static website rebuild, and not a dashboard rebuild.

---

# Full Prompt for Claude

```text
You are a senior Next.js migration architect and technical SEO engineer.

We are planning to migrate the Sun Pyramids Tours frontend from Nuxt 3 SSR to Next.js App Router.

This is not a small refactor.
Treat it as a frontend rebuild/migration project from Vue/Nuxt to React/Next.

The goal is to rebuild the existing Nuxt frontend in Next.js while preserving the same dashboard-driven dynamic behavior, same API dependency, same UI, same content structure, same SEO logic, same multilingual routing, same booking/contact flows, and same public URL strategy.

This is NOT:
- a UI redesign
- a static website rebuild
- a dashboard rebuild
- a backend rebuild
- a hardcoded content rebuild
- a new business logic implementation

Do not start coding before producing a full migration plan and codebase audit.

==================================================
1. Project Context
==================================================

Current frontend:
- Nuxt 3.15 SSR
- Vue components
- Dashboard-driven SEO
- Dynamic API content
- Multilingual routes
- Current UI must be preserved

Target frontend:
- Next.js App Router
- React
- TypeScript preferred
- Server Components where appropriate
- Client Components only where interactivity is required
- Dashboard/API-driven data
- Server-rendered SEO-critical content

Backend/API/dashboard:
- Existing Laravel backend/dashboard
- Must remain the source of truth
- Do not rebuild backend/dashboard unless explicitly requested

Public frontend domain:
https://sunpyramidstours.com

Backend/API/dashboard domain:
https://sunpyramidtours.com

Important domain rule:
Do not treat `sunpyramidtours.com` as a typo when it is used for backend/API/dashboard requests.
The frontend and backend are intentionally on different domains.

Public SEO URLs must use:
https://sunpyramidstours.com

Backend/API/dashboard requests may use:
https://sunpyramidtours.com

Supported frontend languages:
- English root `/`
- French `/fr`
- German `/de`
- Italian `/it`
- Portuguese `/pt`
- Spanish `/es`
- Chinese `/zh`

Arabic is not supported unless explicitly approved later and fully supported by backend/dashboard/frontend.

==================================================
2. Critical Migration Rules
==================================================

The new Next.js frontend must preserve the same concept and behavior of the current Nuxt frontend.

Everything currently dynamic in the Nuxt frontend must remain dynamic in the Next.js frontend.

The frontend must consume all dynamic data from the existing Laravel backend/dashboard through API calls.

Do not hardcode:
- SEO data
- Page titles
- Page descriptions
- Tour content
- Tour prices
- Tour images
- Tour categories
- Destinations
- Blogs
- Marketing pages
- Homepage sections
- Menus
- Footer content if currently dashboard/API-driven
- Schema
- Canonical overrides
- Open Graph data
- Twitter data
- FAQs
- Forms content
- Banners
- Reviews/testimonials if currently API-driven
- Static slugs for dashboard-managed pages
- Sitemap URLs that should come from API/database

Dashboard/API data must remain the source of truth.

Mock data is allowed only temporarily during development and must be removed before production.

Do not create production pages from local JSON files unless explicitly approved.


==================================================
2.1 Global Engineering Rules
==================================================

All agents and implementation tasks must follow these rules:

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
20. Do not start implementation before route, component, API, SEO, i18n, form, and customer-flow parity maps are documented.

==================================================
3. Preserve Current UI/UX
==================================================

The Next.js version must keep the same UI/UX as the current Nuxt website.

This is a framework migration, not a redesign.

The new frontend must preserve:
- Same layout
- Same header
- Same footer
- Same homepage sections
- Same tour cards
- Same blog cards
- Same destination/category sections
- Same buttons
- Same colors
- Same typography as much as possible
- Same responsive behavior
- Same forms
- Same booking/contact flow
- Same language switcher behavior
- Same currency switcher behavior if present
- Same navigation structure
- Same visual hierarchy
- Same content placement
- Same CTA placement
- Same trust/review sections where currently present
- Same footer links and social links

Do not redesign components unless required to fix a bug or performance issue.

Any UI change must be documented and justified.

Before coding, inspect the Nuxt UI and create a component parity map:
- Nuxt component path
- visual purpose
- dynamic data source
- Next.js target component path
- Server or Client Component
- differences, if any
- risk level

==================================================
4. Frontend and Backend Domain Separation
==================================================

The new Next.js frontend will be deployed on the public frontend domain:

https://sunpyramidstours.com

The existing backend/API/dashboard stays on:

https://sunpyramidtours.com

Rules:
- All public frontend pages must be served from:
  https://sunpyramidstours.com

- All backend/API/dashboard calls may continue to use:
  https://sunpyramidtours.com

- Do not blindly replace all `sunpyramidtours.com` references.

- Do not replace backend/API domain references if they are intentionally used for:
  - API calls
  - dashboard requests
  - admin requests
  - backend media calls
  - Laravel endpoints

Public SEO URLs must always use the frontend domain:
- canonical
- hreflang
- og:url
- sitemap URLs
- robots sitemap reference
- public-facing structured data URL fields

Backend/API URLs may use backend domain where technically required:
- fetch()
- API clients
- backend image/media endpoints, if that is how the current system works
- dashboard/admin URLs

Acceptance:
- No backend domain appears in canonical, hreflang, og:url, sitemap URLs, or robots sitemap reference.
- Backend domain still works for API requests.
- No API calls break because of incorrect domain replacement.

==================================================
5. Dashboard-Driven SEO Must Be Preserved
==================================================

The current dashboard SEO system must remain the source of truth.

Do not hardcode SEO values in Next.js pages.

Do not rebuild the Laravel SEO dashboard.

Do not remove existing dashboard SEO fields.

Do not inject fixed static SEO values.

Do not invent schema, prices, reviews, ratings, availability, business data, or route metadata.

Current dashboard SEO fields may include:
- Meta Title
- Meta Description
- Meta Keywords
- OpenGraph Title
- OpenGraph Description
- Canonical
- Structure Schema
- Viewport
- Robots
- Open Graph Type
- Twitter Card
- Twitter Creator
- Open Graph Image
- Twitter Image
- Language-specific SEO tabs

Next.js SEO architecture:
- Replace Nuxt `useSeo()` / `useHead()` with:
  - `generateMetadata()`
  - shared SEO utility functions
  - server-side dashboard/API fetch
  - JSON-LD renderer for valid Structure Schema

Dashboard values must take priority.

Fallback priority:
1. Dashboard SEO field for the current page and current language
2. Actual page/tour/blog content field for the current language
3. Global SEO defaults from dashboard/config/API
4. Safe frontend fallback only as a last resort

Meta Keywords rule:
- Meta Keywords may remain in the dashboard.
- Do not render `<meta name="keywords">` publicly.

Structure Schema rule:
- Keep dashboard Structure Schema as source of truth.
- Validate before rendering.
- Render only if valid JSON-LD.
- Empty, whitespace-only, invalid, or unsupported schema returns null and should not render.
- Invalid schema must not crash the page.
- Do not override valid dashboard schema.
- Dynamic schema generators may be added only as fallback when dashboard Structure Schema is empty, and must use real API/dashboard data only.

Create utility:
- `validateAndParseSchema(raw)`
- returns parsed object/array when valid
- returns null/falsy when empty, invalid, unsupported, or whitespace-only

SEO output must include where applicable:
- title
- meta description
- robots
- viewport
- canonical
- Open Graph tags
- Twitter tags
- hreflang/alternates
- valid JSON-LD schema

==================================================
6. Metadata Strategy in Next.js
==================================================

Use Next.js App Router Metadata API.

Use `generateMetadata()` for:
- title
- description
- canonical
- robots
- Open Graph
- Twitter
- alternates/hreflang where supported

Rules:
- SEO data must be fetched server-side from the API/dashboard.
- SEO tags must be visible in the raw HTML.
- Client-side-only SEO is not acceptable.
- Do not rely on client-side effects to render metadata.
- Canonical URLs must use frontend domain.
- `og:url` must use frontend domain.
- Hreflang URLs must use frontend domain.
- `x-default` must point to English/root.

Do not create `/en` public routes unless explicitly approved.
English should remain root if that is the current Nuxt behavior.

==================================================
7. Multilingual Routing Strategy
==================================================

Preserve current multilingual URL behavior.

Supported locales:
- English root `/`
- French `/fr`
- German `/de`
- Italian `/it`
- Portuguese `/pt`
- Spanish `/es`
- Chinese `/zh`

Rules:
- Do not create `/en` public routes unless explicitly approved.
- English/root should remain the default.
- x-default must point to the English/global version.
- Hreflang must include only supported locales with available translations.
- No Arabic routes unless fully supported and explicitly approved.
- Locale-specific SEO data must come from the matching dashboard language tab.
- If a locale SEO field is populated, do not silently use English/default values.
- English fallback is allowed only when the locale field is empty and fallback behavior is documented.

Language switcher:
- Preserve current behavior and route equivalents.
- If lazy loading translations is used, keep displaying the current language until the new locale file is fully loaded, then swap atomically.
- Do not show raw translation keys.
- Do not cause layout shift with spinners/skeletons unless explicitly designed.

==================================================
8. Route Migration Map
==================================================

Before coding, create a full route migration map.

Examples:

Nuxt:
`pages/index.vue`

Next:
`app/page.tsx`

Nuxt:
`pages/about-us.vue`

Next:
`app/about-us/page.tsx`

Nuxt:
`pages/contact-us.vue`

Next:
`app/contact-us/page.tsx`

Nuxt:
`pages/tour/[slug].vue`

Next:
`app/tour/[slug]/page.tsx`

Nuxt:
`pages/blog/[slug].vue`

Next:
`app/blog/[slug]/page.tsx`

Localized routes:
Choose a Next App Router structure that supports locale prefixes without generating `/en` unless explicitly required.

Possible structure:
- `app/page.tsx` for English homepage
- `app/[locale]/page.tsx` for locale homepages
- `app/tour/[slug]/page.tsx` for English tour pages
- `app/[locale]/tour/[slug]/page.tsx` for localized tour pages

But do not finalize until current Nuxt routing is audited.

Route parity requirements:
- Existing indexed public URLs must remain valid.
- Avoid changing URL structure unless explicitly approved.
- Existing slugs must remain valid.
- Multilingual URL structure must remain valid.
- No route should become client-only if it needs SEO.
- Dynamic marketing pages must be discovered from API, not hardcoded.


==================================================
8.1 Nuxt-Only Route and Flow Gap Analysis
==================================================

Do not assume that the current Next.js route tree already represents the full Nuxt application.

Before implementation and before production cutover, inspect the original Nuxt app and identify any routes, flows, or pages that exist in Nuxt but do not yet exist in Next.js.

Potential Nuxt-only flows may include:
- auth
- login
- register
- profile
- user account
- cart
- checkout
- payment
- payment callbacks
- booking confirmation
- thank-you pages
- wishlist/favourites
- order history
- reset password
- email verification
- private or semi-private customer flows

Required action:
- Create a Nuxt route inventory.
- Create a current Next.js route inventory.
- Compare Nuxt routes against Next.js app routes.
- Mark each route as:
  - already exists in Next
  - requires backend/API validation
  - requires business decision
  - intentionally excluded
  - missing and must be created
- Do not silently exclude Nuxt-only routes.
- If auth/profile/cart/checkout/payment flows are required for the new frontend, create separate Next.js route specs for them before production cutover.

Acceptance:
- Every Nuxt public route is accounted for.
- Every Nuxt customer flow is accounted for.
- Missing Next routes are documented.
- Excluded routes are explicitly approved.
- Production cutover is blocked if required flows like checkout, payment, booking confirmation, or auth are missing or unvalidated.

==================================================
9. API and Data Fetching Strategy
==================================================

The Next.js frontend must listen to and consume the backend API like the Nuxt frontend conceptually does.

Required behavior:
- Fetch page data from the API.
- Fetch SEO data from the API.
- Fetch tour data from the API.
- Fetch category data from the API.
- Fetch destination data from the API.
- Fetch blog data from the API.
- Fetch custom marketing page data from the API.
- Fetch language-specific content from the API.
- Fetch dashboard-managed metadata from the API.
- Render server-side whenever SEO or crawlability depends on the data.

Do not guess API shapes.
Do not invent backend fields.
Do not replace API-driven data with local static data.

Before coding, document:
- Current API endpoints used by Nuxt
- Request parameters/includes
- Response shapes
- SEO object shape
- Locale handling
- Pagination handling
- Error handling
- Cache behavior
- Required headers
- Required auth/public access behavior

Data fetching rules:
- Use server-side fetch for SEO-critical data.
- Do not serialize unnecessary large data into the client bundle.
- Fetch only required fields for cards/listing pages.
- Split critical above-the-fold data from below-the-fold data.
- Avoid overfetching full tour objects when only card fields are needed.
- Use lightweight endpoints when available.
- If new backend endpoints are needed, document them as backend requirements instead of hardcoding around missing data.

Caching/revalidation:
- Document Next.js caching and revalidation strategy.
- Dashboard SEO updates must not remain stale for too long.
- Do not cache dynamic HTML forever.
- Static/media assets may use long-term caching when safe.
- API failure must not crash the entire site where safe fallback exists.

==================================================
10. Component Migration Strategy
==================================================

Create a component inventory before coding.

Required component categories:
- Header
- Footer
- Main navigation
- Language switcher
- Currency switcher if present
- Homepage hero/banner
- Homepage sections
- TourCard
- FeaturedTourCard
- RelatedTourCard
- BlogCard
- DestinationCard
- CategoryCard
- Marketing page components
- Search/filter forms
- Booking form
- Contact form
- Make Your Trip form
- Review widgets
- TrustIndex widgets
- Gallery/carousel components
- FAQ components
- Breadcrumbs
- Pagination
- Mobile menu

For each component, document:
- Nuxt/Vue source file
- Next/React target file
- Server Component or Client Component
- Data source
- SEO relevance
- Interactivity requirements
- Performance risks
- Visual parity requirements
- Testing requirements

Component rules:
- Use Server Components by default.
- Use Client Components only when interactivity is required.
- Do not make the entire app client-side.
- Do not wrap SEO-critical content in Client Components unnecessarily.
- Do not hide crawlable links behind JavaScript-only behavior.
- Preserve visible UI from Nuxt.

==================================================
11. Image Optimization Strategy
==================================================

Use Next Image where appropriate.

Rules:
- Configure remote image patterns for Laravel storage and Cloudflare/R2/media domains.
- Use dashboard/media alt text when available.
- Use safe fallback alt text only when missing.
- All images must have stable dimensions or layout sizing.
- The LCP/hero image must not be lazy-loaded.
- LCP image should use priority/fetch priority where appropriate.
- Below-the-fold images should lazy-load.
- Do not load huge original images for small cards.
- Preserve current image appearance and cropping.

Local assets:
- Photos/banners/rich raster PNGs may be converted to WebP quality 80.
- Icons/logos/simple graphics should prefer SVG.
- Delete original PNGs only after references are updated and verified.
- Keep PNG fallback only for critical images if explicitly required.
- Do not modify dashboard/media-library images unless they are local source assets.

Acceptance:
- No broken images.
- No layout shift from images.
- Image payload improves.
- Alt text remains correct and dynamic.
- LCP image loads early.

==================================================
12. Sitemap and Robots Strategy
==================================================

Implement dynamic sitemap and robots using Next.js conventions.

Sitemap should:
- Use frontend public domain:
  https://sunpyramidstours.com
- Pull live indexable pages from API/database.
- Include:
  - static pages
  - tour pages
  - blog pages
  - category pages
  - destination pages
  - custom marketing pages
- Exclude:
  - drafts
  - disabled pages
  - noindex pages
  - unsupported locales
  - backend/dashboard URLs
  - broken routes
- Use real `lastmod` when available.
- Apply timeout for sitemap API fetching.
- Return valid XML even if one content group fails.
- Use xhtml hreflang alternates if technically maintainable.

Custom marketing pages:
- Must be discovered dynamically from API/dashboard.
- Do not hardcode marketing page slugs.

Sitemap API timeout:
- Use 15 seconds per sitemap API call.
- If timeout occurs, fail safely with valid XML.
- Do not cache empty timeout fallback for a long time.

Robots:
- Use frontend domain in sitemap reference.
- Do not block important image assets.
- Exclude backend/admin/API paths where appropriate.

==================================================
13. Core Web Vitals and Performance Strategy
==================================================

Use mobile Lighthouse as the primary validation target.

Targets:
- LCP ≤ 2.5s
- CLS ≤ 0.1
- TBT ≤ 200ms as lab proxy
- INP ≤ 200ms when field data is available

Initial audit scope:
- Homepage
- One representative published tour detail page

Desktop audits:
- Optional/supporting only.

Official verdict:
- Mobile Lighthouse with third-party scripts enabled.

Diagnostic mode:
- If `?no-third-party=1` exists, keep it as diagnostic.
- Do not use it as official pass/fail verdict.
- It must not change SEO tags, canonical, hreflang, schema, visible content, or internal links.

Performance goals:
- Preserve SSR SEO content.
- Reduce image payload.
- Prevent CLS via stable image/card/container dimensions.
- Avoid route prefetch floods.
- Avoid heavy client-side hydration.
- Use Server Components where possible.
- Defer third-party widgets.
- Avoid unnecessary global CSS.
- Keep crawlable links as real anchors.

Production monitoring:
- Use Vercel Analytics for lightweight production Core Web Vitals monitoring if hosted on Vercel.
- Lighthouse is lab data.
- Vercel Analytics/RUM is field data.

==================================================
14. Third-Party Scripts Strategy
==================================================

Third-party scripts must not block critical rendering unnecessarily.

Scripts may include:
- GTM
- GA4
- Clarity
- Facebook Pixel
- TrustIndex
- reCAPTCHA
- Chat widgets
- Other tracking widgets

Rules:
- GTM/GA4 should load only in production/normal mode.
- TrustIndex should load after idle and only when a matching DOM container exists.
- Use DOM-based TrustIndex detection, not hardcoded route registry.
- reCAPTCHA should load only where needed.
- Third-party widgets must not mutate DOM before hydration.
- If diagnostic mode exists, it should suppress third-party scripts without changing SEO/page content.

TrustIndex strategy:
- On idle, check for containers like `#home-reviews`, `#footer-cert`, or approved TrustIndex containers.
- Load corresponding script only when container exists.
- Load each script only once.
- Re-check after client-side route changes.
- Reserve container height to avoid CLS.

==================================================
15. Forms and Booking Flow
==================================================

Preserve all existing forms and flows.

Required:
- Contact form works.
- Booking form works.
- Make Your Trip / tailor-made form works.
- Newsletter or lead forms work if present.
- reCAPTCHA behavior preserved where required.
- Form submission endpoints remain API-driven.
- Validation behavior preserved.
- Thank-you/confirmation routes preserved.
- Tracking/conversion behavior preserved where currently implemented.

Do not change form endpoints without documenting and approving.

Do not break Google Ads conversion tracking, lead tracking, or thank-you page logic.



==================================================
15.1 Payment Callback Pages — SSR-Safe Clone Rule
==================================================

Payment callback pages must be treated with extra care during the Nuxt to Next.js migration.

Important:
Payment callback pages are UI-safe / SSR-safe clones of the current Nuxt callback pages.

They must not trigger payment mutation APIs server-side.

This means:
- Do not call payment confirmation, capture, verify, refund, cancel, or invoice-update mutation APIs automatically from Next.js Server Components.
- Do not trigger payment state changes during SSR.
- Do not trigger payment mutation APIs from `generateMetadata()`.
- Do not trigger payment mutation APIs from layout rendering.
- Do not trigger payment mutation APIs from route-level server rendering.
- Do not trigger payment mutation APIs from static generation.
- Do not allow route prefetch to trigger payment mutation APIs.
- Do not convert callback page rendering into a server-side payment processor.

If the existing Nuxt callback page performs a payment callback/update request client-side after hydration, the Next.js version may preserve that behavior only when all of the following are true:
- The call happens client-side only after hydration.
- The call is triggered only when the user actually lands on the callback URL.
- The required browser URL parameter, such as `invoice_id`, exists.
- The endpoint matches the existing approved backend/payment flow.
- The request is not triggered by SSR, metadata generation, static generation, or route prefetch.
- The behavior is documented route-by-route.
- The route is validated with real backend sandbox/test data before production cutover.

Allowed behavior:
- Render payment success/failure/pending UI.
- Read query parameters for display or safe client-side callback handling.
- Fetch read-only booking/order status if an existing safe endpoint exists.
- Preserve existing client-side callback behavior if it matches the Nuxt implementation and does not run server-side.
- Show user instructions or next steps.
- Preserve tracking/conversion behavior only if it does not mutate payment state unexpectedly.

Blocked behavior:
- Server-side payment capture.
- Server-side payment verification that changes payment/order state.
- Server-side invoice update.
- Server-side booking confirmation mutation.
- Server-side refund/cancel mutation.
- Payment mutation from `generateMetadata()`.
- Payment mutation from route prefetch.
- Payment mutation during SSR/static generation.

Acceptance:
- Payment callback routes render safely in Next.js.
- No payment mutation API is called during server-side rendering.
- No payment mutation API is called during metadata generation.
- No payment mutation API is triggered by route prefetch.
- Existing backend/payment gateway/webhook/payment-flow architecture remains responsible for real payment state changes.
- Existing approved client-side callback behavior is preserved only where the old Nuxt implementation used it.
- UI parity with the current Nuxt callback pages is preserved.
- Payment callbacks are validated end-to-end in staging/sandbox before production cutover.

==================================================
16. Migration Phases
==================================================

Do not migrate all pages blindly.

Use phased migration:

Phase 0 — Discovery and Audit
- Inspect current Nuxt codebase.
- Map routes.
- Map components.
- Map API endpoints.
- Map SEO fields.
- Map forms.
- Map UI sections.
- Map dynamic dashboard-controlled content.
- Identify high-risk areas.

Phase 1 — Next.js Foundation
- Set up Next.js App Router project.
- Configure TypeScript.
- Configure environment variables.
- Configure API client.
- Configure remote image patterns.
- Configure base layout.
- Set up styling approach matching current UI.

Phase 2 — Shared Utilities
- API client
- Locale utilities
- SEO utilities
- Metadata utilities
- Schema validation utility
- Canonical/hreflang utilities
- Image helpers
- Error/fallback utilities

Phase 3 — Layout and Global UI
- Header
- Footer
- Navigation
- Mobile menu
- Language switcher
- Currency switcher if present
- Global scripts strategy
- Global styles

Phase 4 — Homepage Migration
- Rebuild homepage to match Nuxt UI.
- Fetch all homepage data dynamically from API.
- Preserve dashboard-driven SEO.
- Optimize LCP/CLS/TBT.
- Validate raw HTML SEO.

Phase 5 — Tour Detail Migration
- Rebuild representative tour detail page.
- Fetch tour data dynamically.
- Preserve SEO/schema/booking content.
- Validate performance and form behavior.

Phase 6 — Static and Marketing Pages
- About
- Contact
- FAQs
- Blog listing
- Blog detail
- Custom marketing pages from API
- Destination/category pages as needed

Phase 7 — Sitemap, Robots, Hreflang
- Dynamic sitemap
- Robots
- Hreflang validation
- Schema validation
- Social preview validation

Phase 8 — Forms, Tracking, and Third-Party Scripts
- Booking forms
- Contact forms
- reCAPTCHA
- GTM/GA4
- TrustIndex
- Conversion tracking
- Diagnostic mode if applicable

Phase 9 — QA and Parity Validation
- Route parity
- UI parity
- SEO parity
- API data parity
- Form parity
- Language parity
- Sitemap parity
- Performance validation

Phase 10 — Production Cutover
- Deploy to staging.
- Run full validation.
- Decide cutover method.
- Switch DNS/proxy only after gates pass.
- Keep Nuxt rollback available.

==================================================
17. Cutover Strategy
==================================================

Evaluate two options:

Option A — Big-bang replacement
- Build full Next.js frontend.
- Validate everything on staging.
- Replace Nuxt frontend at once.

Option B — Route-by-route migration/proxy
- Serve some routes from Next and others from Nuxt.
- More complex but lower risk for large systems.

Recommend the safest option based on codebase constraints.

Do not change production DNS or routing until:
- route parity passes
- UI parity passes
- SEO parity passes
- forms parity passes
- booking flow passes
- sitemap validation passes
- hreflang validation passes
- Lighthouse validation passes
- no critical regressions remain

==================================================
18. Acceptance Criteria
==================================================

Migration is accepted only when:

1. All important Nuxt public routes exist in Next.
2. Existing URLs remain valid unless approved.
3. UI matches current Nuxt version.
4. Dashboard/API remains the source of truth.
5. No production content is hardcoded.
6. SEO renders in raw HTML.
7. Dashboard SEO fields control metadata.
8. Canonical/hreflang/og:url/sitemap use frontend domain.
9. Backend/API calls use backend domain where intended.
10. No public meta keywords tag exists.
11. Valid dashboard Structure Schema renders as JSON-LD.
12. Invalid schema does not crash the page.
13. Multilingual routes work.
14. No `/en` route is created unless approved.
15. No Arabic route is created unless fully supported.
16. x-default points to English/root.
17. Sitemap is dynamic and API-driven.
18. Robots is valid.
19. Booking flow works.
20. Contact forms work.
21. Make Your Trip/tailor-made forms work if present.
22. Images are optimized and stable.
23. No hydration mismatch.
24. Lighthouse mobile CWV improves.
25. No major visual regression.
26. No broken internal links.
27. No broken images.
28. No backend/admin/API URLs appear in public sitemap.
29. Analytics/tracking behavior is preserved where required.
30. Rollback plan is ready before cutover.
31. Nuxt-only flows such as auth, profile, cart, checkout, payment, and booking confirmation are either implemented in Next.js or explicitly documented as intentionally excluded before cutover.
32. Payment callback pages are SSR-safe clones and do not trigger payment mutation APIs server-side.
33. Payment callback pages are UI-safe clones and do not trigger payment mutation APIs server-side.

==================================================
19. Testing Checklist
==================================================

Before production cutover, run:

Build and code:
- npm run build
- npm run lint
- TypeScript check if configured
- route smoke tests
- component smoke tests

Raw HTML SEO:
- Check title
- Check meta description
- Check canonical
- Check hreflang
- Check og:title
- Check og:url
- Check twitter tags
- Check JSON-LD
- Confirm no meta keywords publicly

Domain checks:
- canonical uses `https://sunpyramidstours.com`
- hreflang uses `https://sunpyramidstours.com`
- og:url uses `https://sunpyramidstours.com`
- sitemap uses `https://sunpyramidstours.com`
- API calls may use `https://sunpyramidtours.com`

Routes:
- `/`
- `/fr`
- `/de`
- `/it`
- `/pt`
- `/es`
- `/zh`
- `/about-us`
- `/contact-us`
- representative tour page
- representative blog page
- representative category page
- custom marketing page

SEO tools:
- Google Rich Results Test
- Schema.org Validator
- Facebook Sharing Debugger
- Lighthouse mobile
- Sitemap XML validator
- Screaming Frog/Sitebulb if available

Forms:
- Contact form
- Booking form
- Make Your Trip form
- reCAPTCHA if present
- thank-you route
- conversion tracking

Performance:
- Homepage mobile Lighthouse
- Tour detail mobile Lighthouse
- DevTools Network
- Image payload
- JS payload
- CLS regions
- LCP element
- Hydration console

Visual:
- Desktop
- Mobile
- Tablet
- Header
- Footer
- Cards
- Forms
- Language switcher
- Menus

==================================================
20. Rollback Plan
==================================================

Before cutover:
- Keep the current Nuxt production deployment available.
- Deploy Next.js to staging first.
- Save baseline Nuxt HTML for key pages.
- Save baseline screenshots.
- Save baseline Lighthouse reports.
- Save current sitemap and robots.
- Do not switch DNS until all gates pass.

Rollback triggers:
- SEO tags missing
- canonical/hreflang broken
- sitemap invalid
- booking/contact forms broken
- tour pages fail
- API requests fail
- major visual regression
- page speed worse than Nuxt without explanation
- dashboard data not loading
- multilingual routes broken
- tracking/conversions broken

Rollback steps:
1. Restore Nuxt deployment.
2. Revert DNS/proxy/routing change.
3. Purge Cloudflare cache.
4. Verify homepage, tour page, contact page, booking flow.
5. Restore previous sitemap if needed.
6. Investigate Next.js issue on staging.
7. Reattempt cutover only after fix.

==================================================
21. Required Output Before Coding
==================================================

Before modifying code, produce:

1. Current Nuxt architecture audit
2. Route migration map
3. Component migration map
4. API endpoint map
5. SEO data mapping
6. i18n routing plan
7. Next.js target architecture
8. Migration phases
9. Risk register
10. Testing plan
11. Rollback plan
12. Open questions

Do not proceed to implementation until the migration plan is reviewed and approved.

==================================================
22. First Task for Claude
==================================================

Act as the migration lead.

Inspect the current Nuxt codebase and create a migration discovery report.

Do not modify code yet.

The report must include:
- Current route inventory
- Current API endpoint inventory
- Current SEO implementation summary
- Current dashboard-driven data sources
- Current component inventory
- Current forms and submission flows
- Current multilingual routing behavior
- Current public URL patterns
- Current third-party scripts
- Current performance risks
- Proposed Next.js App Router architecture
- High-risk migration areas
- Recommended first implementation sprint

Remember:
The migration must preserve the current Nuxt frontend concept:
same dynamic backend/dashboard data, same API-driven behavior, same UI, same SEO logic, and same public route behavior.
```

---

# Short Version

If Claude needs a short starting instruction, use this:

```text
Migrate the current Sun Pyramids Tours Nuxt 3 frontend to Next.js App Router.

This is a framework migration only, not a redesign or static rebuild.

Preserve:
- same UI as current Nuxt version
- same dynamic backend/dashboard data
- same Laravel API dependency
- same dashboard-driven SEO
- same multilingual routes
- same public URLs
- same booking/contact flows

Frontend public domain:
https://sunpyramidstours.com

Backend/API/dashboard domain:
https://sunpyramidtours.com

Do not hardcode SEO/content.
Do not rebuild the dashboard.
Do not blindly replace backend domain references.
Do not create /en routes unless approved.
Do not add Arabic unless fully supported.

Before coding, audit the Nuxt codebase and produce route, component, API, SEO, i18n, UI, and form migration maps.
```

---

# Recommended File Name

```text
nextjs-migration-spec-prompt.md
```


---

# Appendix A — Nuxt Route Inventory and Cutover Gate

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
