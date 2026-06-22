# Component Parity Map

Source of truth: `nuxt_sunpyramids/components`, `nuxt_sunpyramids/pages`, current `app`, `components`, and `lib`.

## Summary

The current Next app has a compact React component set that clones major public UI surfaces, but it does not yet have one-to-one React ports for every Nuxt component. Public content routes are mostly represented. Customer flows have route shells/cloned UI and still require backend/API validation before cutover.

## Global Layout

| Category | Nuxt source | Next target | Type | Data source | SEO relevance | Status / gap |
|---|---|---|---|---|---|---|
| Header, main nav, mobile menu | `components/Header/index.vue`, `components/Header/LoginComponent.vue` | `components/Header.tsx`, `components/SiteShell.tsx` | Client-like navigation rendered in shared shell | API/settings in Nuxt; current Next has static nav labels plus route links | High, contains crawlable links | Exists. Needs UI parity screenshot and dynamic menu/settings validation. |
| Footer | `components/Footer/index.vue` | `components/Footer.tsx`, `components/SiteShell.tsx` | Server-rendered shell | API/settings/socials in Nuxt | Medium, crawlable links | Exists. Needs dynamic footer/settings validation. |
| Bottom bar / WhatsApp | `components/Shared/BottomBar.vue`, `components/Shared/MobileSearch.vue` | `components/BottomBar.tsx`, `components/WhatsAppButton.tsx` | Client interaction | Static WhatsApp link in Nuxt and Next | Low SEO, high UX | Exists. Needs mobile visual parity check. |
| Language / currency switcher | `components/Models/languages&currancies.vue`, `components/Shared/LangAndCurrancies.vue` | `components/Header.tsx`, `lib/locales.ts` | Client navigation expected | Nuxt i18n/current currency store | High for locale routing | Locale links exist. Currency behavior requires validation or implementation decision. |

## Public Content Components

| Category | Nuxt source | Next target | Type | Data source | SEO relevance | Status / gap |
|---|---|---|---|---|---|---|
| Homepage hero/banner | `components/Home/MainBanner/*` | `components/HomePage.tsx` | Server component | `pages/home?includes=seo`, tours/blogs API | High | Exists as clone. Needs screenshot parity and LCP image review. |
| Homepage sections | `components/Home/*` | `components/HomePage.tsx`, cards | Server component | Tours, blogs, destinations, FAQs | High | Exists in simplified form. Need section-by-section Nuxt parity check. |
| Tour cards | `components/Shared/TourCard.vue`, `components/Shared/EgyptToursCard.vue` | `components/TourCard.tsx` | Server component | Tours API | High | Exists. Wishlist toggle interactivity not fully ported. |
| Blog cards | `components/Shared/BlogCard.vue` | `components/BlogCard.tsx` | Server component | Blogs API | High | Exists. Needs visual parity check. |
| Destination/category cards | `components/AboutUs/Distinations.vue`, `components/EgyptTours/*` | `components/DestinationCard.tsx` | Server component | Destinations/categories API | High | Exists. One-day category page now renders destination/category cards. |
| Generic marketing/static pages | `components/AboutUs/*`, `components/Sustainability/*`, `components/Disabled/*`, `components/PrivacyAndCookies/index.vue`, `components/TermsAndConditions/index.vue` | `components/GenericRoute.tsx`, `components/ClonedNuxtPages.tsx`, `components/GenericPage.tsx` | Server components | Pages API plus related tours/blogs/FAQs | High | Exists as consolidated clones. Requires exact component parity review for final cutover. |
| Blog detail sidebar/related | `components/Blogs/Blog/*` | `app/blog/[slug]/page.tsx`, `components/GenericPage.tsx` | Server component | Blog API | High | Exists in simplified detail. Related/sidebar parity needs validation. |
| Event pages | `components/Events/*`, `components/Event/*` | `app/events/page.tsx`, `app/event/[slug]/page.tsx`, `components/GenericRoute.tsx` | Server component | Categories/tours/blogs API | High | Exists. Event detail related content needs backend validation. |
| FAQ components | `components/Home/FrequentlyAsked/*` | `components/GenericPage.tsx`, `components/HomePage.tsx` | Server component | FAQs API | Medium | Exists. Needs visual parity check. |
| Breadcrumbs | `components/Shared/Breadcrumb.vue` | Current route/page components | Server component | Route/page data | Medium | Not a dedicated Next component. Add only if parity screenshots confirm missing UX. |
| Pagination | `components/UI/Pagination.vue` | Current list pages | Client component if needed | API pagination meta | Medium | Not fully ported. Blog/trips pagination require backend/API validation. |
| Gallery/carousel | `components/Shared/MainSwiper.vue`, `components/UI/SwiperModal.vue`, tour/event galleries | Current static/scrolling sections | Client component if needed | Gallery API | Medium | Not one-to-one. Add only for confirmed visual/functional gaps. |
| Trust/review widgets | TrustIndex/global scripts in Nuxt components | `components/TrustIndexLoader.tsx` | Client script loader | Third-party DOM/widget | Low SEO, high trust UX | Exists. Sprint 4 adds `?no-third-party=1` diagnostic suppression; normal production behavior still needs validation. |

## Forms and Customer Flow Components

| Category | Nuxt source | Next target | Type | Data source / endpoint | SEO relevance | Status / gap |
|---|---|---|---|---|---|---|
| Contact form | `components/ContactUs/Form.vue`, landing page contact forms | `components/ContactForm.tsx`, `lib/recaptcha.ts` | Client component | `POST contact-requests` | Low | Exists. reCAPTCHA loads on submit and sends token; backend acceptance/tracking parity pending. |
| Make Your Trip form | `components/MakeYourTrip/Form/*` | `components/ClonedNuxtPages.tsx` route UI | Client component required for full parity | `POST custom/trips` | Medium | Route/UI exists. Full multi-step submission needs validation/implementation. |
| Rent car form | `components/RentACar/Form/*` | `components/ClonedNuxtPages.tsx` route UI | Client component required | Locations, available destinations, `POST car/rental/search/for/route`, `POST cart/rentals/append` | Medium | Route/UI exists. Full API flow pending. |
| Booking form / tour right panel | `components/Tours/RightPanal/index.vue` | `components/TourPage.tsx` | Client component required | Tour options/seasons/cart/wishlist API | Medium | Tour page exists. Booking panel parity is a cutover blocker. |
| Auth forms | `components/Auth/*` | `app/auth/*`, `components/ClonedNuxtPages.tsx` | Client component required | Auth API endpoints | Low SEO, high flow risk | Routes exist. Backend behavior pending. |
| Profile pages | `pages/profile*.vue`, `components/MyBookings/*` | `app/profile/*`, `components/ClonedNuxtPages.tsx` | Client/server hybrid | Authenticated profile/bookings/wishlist APIs | Low SEO, high flow risk | Routes exist. Backend/auth guard validation pending. |
| Cart components | `components/Cart/*` | `app/cart/page.tsx`, `components/ClonedNuxtPages.tsx` | Client component required | Cart APIs | Low SEO, high revenue risk | Route/UI exists. Functional parity pending. |
| Checkout components | `components/Checkout/*` | `app/cart/checkout/page.tsx`, `components/ClonedNuxtPages.tsx` | Client component required | `POST bookings`, payment update APIs | Low SEO, critical revenue risk | Route/UI exists. Functional parity pending. |
| Payment callback pages | `pages/order/payment/callback/**` | `components/PaymentCallbackStatus.tsx`, `app/order/payment/callback/**` | Client component inside server shell | Client-only payment endpoints with `invoice_id` | Low SEO, critical safety risk | Exists. SSR safety documented separately. |

## Testing Requirements

- Desktop and mobile screenshots for priority pages listed in the migration instructions.
- Raw HTML spot checks for SEO-critical pages.
- Staging backend validation for all customer-flow components.
- Avoid expanding Client Components unless interactivity requires it.

## Sprint 2 Component Parity Findings

Date: 2026-06-22

| Component area | Finding | Required next action |
|---|---|---|
| One-day tours category page | `DestinationCard` grid matches the main Nuxt card intent, but Nuxt has additional breadcrumb, oval hero, need-help, and gallery/social components. | Port missing Nuxt page sections or approve exclusion. |
| Auth components | `AuthPage` is a simplified static clone and does not match Nuxt `components/Auth/*` behavior or visual detail. | Build real client auth forms against Nuxt-confirmed endpoints. |
| Profile/account components | `AccountPage` is a sign-in CTA shell and does not port profile/settings/bookings/favourites components. | Build authenticated account components after backend contract validation. |
| Cart/checkout components | `CartClonePage` is a static empty-cart/checkout shell. | Port cart list/edit/coupon/checkout components and booking creation flow. |
| Tour detail | `TourPage` is a simplified server detail page and does not yet port the full Nuxt left/right panels. | Port gallery, options/seasons, itinerary, includes/excludes, reviews, related tours, and booking panel. |
| Contact/lead forms | `ContactForm` posts to `contact-requests`, but does not yet include Nuxt recaptcha token or all route-specific fields. | Add recaptcha token and field parity where backend requires it. |

## Sprint 4 Component Notes

Date: 2026-06-22

- `components/ThirdPartyScripts.tsx` centralizes normal GA4/GTM loading and suppresses it for diagnostic URLs with `?no-third-party=1`.
- `components/TrustIndexLoader.tsx` also honors `?no-third-party=1`.
- `components/TourPage.tsx` now renders the hero image through `next/image` instead of a raw CSS background to avoid loading the 2 MB fallback image unoptimized.
- No broad visual parity changes were made in Sprint 4; UI parity approval remains blocked.
