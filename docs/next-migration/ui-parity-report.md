# UI Parity Report

## Scope

Priority pages from the migration instructions:

- `/`
- `/egypt-tours/one-day-tours`
- `/tour/[slug]`
- `/contact-us`
- `/cart`
- `/cart/checkout`
- `/auth/sign-in`
- `/auth/sign-up`
- `/profile`
- `/profile/bookings`
- `/profile/favourites`
- `/profile/settings`

## Current Findings

| Page | Current Next route status | UI parity status | Notes |
|---|---|---|---|
| `/` | Exists | Local Next screenshot captured | `output/playwright/home.png`. Needs Nuxt baseline and mobile screenshot comparison. |
| `/egypt-tours/one-day-tours` | Exists | Local Next screenshot captured | `output/playwright/one-day-tours.png`. Confirmed route is intended to show categories/destinations, not tours. Needs Nuxt baseline and mobile screenshot comparison. |
| `/tour/[slug]` | Exists | Locally verified on `http://localhost:3003` | Nuxt-style layout restored and verified locally: gallery, info cards, overview, highlights, itinerary, included/excluded, add-ons, booking panel, season prices, social gallery, related tours. Staging and production approval remain pending. |
| `/contact-us` | Exists | Local Next screenshot captured | `output/playwright/contact-us.png`. Contact form exists; recaptcha/tracking visual/functional parity pending. |
| `/cart` | Exists | Local Next screenshot captured | `output/playwright/cart.png`. Route/UI clone exists; functional parity pending. |
| `/cart/checkout` | Exists | Pending | Route/UI clone exists; checkout flow pending. |
| `/auth/sign-in` | Exists | Local Next screenshot captured | `output/playwright/sign-in.png`. Route/UI clone exists; backend validation pending. |
| `/auth/sign-up` | Exists | Pending | Route/UI clone exists; backend validation pending. |
| `/profile` | Exists | Local Next screenshot captured | `output/playwright/profile.png`. Route/UI clone exists; auth guard pending. |
| `/profile/bookings` | Exists | Pending | Route/UI clone exists; bookings API pending. |
| `/profile/favourites` | Exists | Pending | Route/UI clone exists; wishlist API pending. |
| `/profile/settings` | Exists | Pending | Route/UI clone exists; profile update API pending. |

## Validation Method

1. Start the Next app locally or use staging.
2. Capture desktop and mobile screenshots for each priority route.
3. Capture matching screenshots from the Nuxt production/original site where publicly accessible.
4. Compare header, footer, cards, form layout, CTA placement, spacing, typography, and mobile behavior.
5. Fix only confirmed migration-scope mismatches.

## Current Cutover Status

UI parity is not approved for production cutover until Nuxt baseline screenshots, mobile screenshots, and route-by-route visual comparison are complete.

## Sprint 2 Screenshot Artifacts

Date: 2026-06-22

Screenshots were captured for all 12 priority routes across:

- `output/playwright/sprint2/next-desktop`
- `output/playwright/sprint2/next-mobile`
- `output/playwright/sprint2/nuxt-desktop`
- `output/playwright/sprint2/nuxt-mobile`

Representative tour slug:

`from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis`

## Sprint 2 Visual Findings

| Area | Finding | Cutover impact |
|---|---|---|
| `/egypt-tours/one-day-tours` | Core destination/category grid is close and uses the original API images. Next is missing Nuxt breadcrumb, oval hero treatment, need-help strip, social/gallery section, and denser footer social treatment. | Blocks strict UI parity approval. |
| `/auth/sign-in` | Nuxt has language selector, social login buttons, labeled fields with icons, save-login checkbox, password visibility, blue primary CTA, and create-account secondary CTA. Next is a simplified non-submitting clone with different hero image and orange CTA. | Blocks auth UI/flow parity. |
| `/cart`, `/cart/checkout`, `/profile*` | Next pages are short cloned/sign-in CTA shells. Nuxt screenshots are much richer/longer or redirect-like depending auth state. | Blocks customer-flow parity. |
| `/tour/[slug]` | Next page is much shorter than Nuxt, indicating missing rich tour sections such as full booking panel/options/galleries/itinerary/reviews. | Blocks tour-detail parity and booking parity. |
| `/contact-us` | Next route renders contact form, but Nuxt page is longer and includes richer contact/social/map layout. | Needs visual/form parity work. |
| Mobile | Screenshots captured. Nuxt and Next page heights/section structure differ substantially on tour, profile, contact, and category pages. | Blocks mobile UI parity approval. |

Sprint 2 included substantial Next UI/component work, including Header, HomePage, TourCard, BlogCard, ClonedNuxtPages, and global CSS updates, alongside sitemap coverage fixes. Remaining parity gaps are still significant and require planned component/flow work for richer Nuxt page sections, customer areas, booking panels, mobile layouts, and full form behavior rather than small cosmetic tweaks.

## Sprint 4 UI Notes

Date: 2026-06-22

No broad visual polish was performed. The only UI-adjacent change was a targeted tour hero implementation change from CSS background image to optimized `next/image` to fix a confirmed LCP problem while preserving the existing hero appearance. UI parity approval remains pending.

## Sprint 5 Approval Preparation

No broad visual polish was performed. Existing screenshots under `output/playwright/sprint2/` remain the approval baseline.

| Page | Desktop screenshot status | Mobile screenshot status | Sprint 5 status | Required before cutover |
|---|---|---|---|---|
| `/` | Captured in Sprint 2 | Captured in Sprint 2 | Minor/unknown mismatch; no new visual changes | Approval required |
| `/egypt-tours/one-day-tours` | Captured in Sprint 2 | Captured in Sprint 2 | Category grid behavior preserved | Approval required |
| `/tour/[slug]` | Captured in Sprint 2 | Captured in Sprint 2 | Major mismatch remains around rich tour/booking sections | Yes |
| `/contact-us` | Captured in Sprint 2 | Captured in Sprint 2 | Functional form exists; richer Nuxt layout still pending | Approval required |
| `/cart` | Captured in Sprint 2 | Captured in Sprint 2 | Functional actions added; UI parity still not approved | Yes |
| `/cart/checkout` | Captured in Sprint 2 | Captured in Sprint 2 | Functional payment update added; UI parity still not approved | Yes |
| `/auth/sign-in` | Captured in Sprint 2 | Captured in Sprint 2 | Backend form exists; Nuxt visual richness still differs | Approval required |
| `/auth/sign-up` | Captured in Sprint 2 | Captured in Sprint 2 | Backend form exists; visual approval pending | Approval required |
| `/profile` | Captured in Sprint 2 | Captured in Sprint 2 | Authenticated state blocked without staging account | Yes |
| `/profile/bookings` | Captured in Sprint 2 | Captured in Sprint 2 | Authenticated data blocked without staging account | Yes |
| `/profile/favourites` | Captured in Sprint 2 | Captured in Sprint 2 | Authenticated data blocked without staging account | Yes |
| `/profile/settings` | Captured in Sprint 2 | Captured in Sprint 2 | Authenticated update blocked without staging account | Yes |

## Sprint 6 UI Parity Status

Date: 2026-06-23

Focused UI parity remains blocked behind staging revenue validation. No broad UI polish was started because auth/profile/cart/checkout/payment flows are still blocked by missing staging credentials and sandbox/test data.

| Page | Sprint 6 status | Business risk | SEO risk | Required before cutover | Recommended fix |
|---|---|---|---|---|---|
| `/` | Pending approval | Medium | High | Yes | Review existing Sprint 2 screenshots and rerun after staging data is available. |
| `/egypt-tours/one-day-tours` | Pending approval | Medium | High | Yes | Compare category listing density/filter behavior against Nuxt. |
| Representative `/tour/[slug]` | Pending approval | High | High | Yes | Validate booking panel, options/seasons, and crawlable content after staging tour data is confirmed. |
| `/contact-us` | Pending approval | Medium | Medium | Yes | Validate form behavior/reCAPTCHA before visual-only fixes. |
| `/cart` | Blocked | High | Low | Yes | Requires populated cart data before meaningful parity approval. |
| `/cart/checkout` | Blocked | Critical | Low | Yes | Requires staging cart/payment data before meaningful parity approval. |
| Auth routes | Blocked | High | Low | Yes | Requires staging account to approve success/error states. |
| Profile routes | Blocked | High | Low | Yes | Requires authenticated staging account and data. |
| `/make-your-trip` | Pending backend validation | Medium | Medium | Yes | Validate submit behavior/reCAPTCHA before visual-only fixes. |
| `/rent-car` | Pending backend validation | Medium | Medium | Yes | Validate locations/destinations/rental append before visual-only fixes. |

## Sprint 7 UI Parity Status

Date: 2026-06-23

UI parity fixes remain deferred. Sprint 7 did not receive staging access or revenue-flow test data, so authenticated/cart/checkout states cannot be approved and broad UI polish would risk masking functional blockers.

| Page group | Sprint 7 status | Screenshot source | Required before cutover | Notes |
|---|---|---|---|---|
| Public routes (`/`, category, tour, contact, make-your-trip, rent-car) | Pending approval | `output/playwright/sprint2/` where present | Yes | Re-run screenshots after staging data is available; fix only confirmed small mismatches. |
| Cart and checkout | Blocked | `output/playwright/sprint2/` unauthenticated/basic states | Yes | Needs populated cart and checkout data before meaningful parity approval. |
| Auth routes | Blocked | `output/playwright/sprint2/` | Yes | Needs staging success/error states. |
| Profile routes | Blocked | `output/playwright/sprint2/` unauthenticated/basic states | Yes | Needs authenticated profile/bookings/favourites/settings data. |

## Tour Detail Page Restoration

Date: 2026-06-28

The `/tour/[slug]` route was restored to match the Nuxt tour detail layout:

- Image gallery with thumbnail strip
- Tour info cards (duration, cities, type, category)
- Overview with pick-up / availability
- Highlights section with destination/attractions
- Day-by-day itinerary with expand/contract all
- What's Included / What's Excluded lists
- Add-ons panel
- Sticky booking panel with price, date, passenger counters, total, and Book now
- Season pricing table
- Social gallery
- Related tours carousel

**Validation target:** Local production preview on `http://localhost:3003`. The representative slug `from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis` was verified to render all sections correctly.

**Validation note:** the live production domain still serves the legacy Nuxt app. The Next.js tour detail restoration was validated against the local Next.js preview on port 3003 and/or the Next.js staging deployment, not against the production Nuxt HTML. The production Nuxt site was used only as a visual/structural parity baseline. Do not use the production Nuxt URL or `localhost:3000` as evidence that Next.js changes are live. See `docs/next-migration/deployment-boundary.md`.

