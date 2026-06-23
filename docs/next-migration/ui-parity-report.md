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
| `/tour/[slug]` | Exists | Pending | Need representative published slug and booking panel comparison. |
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
