# Full dynamic API control matrix

This matrix traces Nuxt behavior through the current Laravel API and dashboard models into Next. A route rendering API data is not automatically `PASS`: the row also checks locale propagation, error semantics, mutation payloads, and whether dashboard edits remain authoritative.

| Area / field | Nuxt source | API endpoint / backend model | Next source | Cache / SSR | Locale | Hardcoded fallback | Dashboard-controlled | Verified | Status |
|---|---|---|---|---|---|---|---|---|---|
| Home page metadata/body | shared page loader | `GET pages/home?includes=seo`; `Page` + `Seo` | `app/page.tsx`, locale page | server, `no-store` | API locale header | metadata defaults | Yes | Source + runtime | PASS |
| Easter feature | home components | `GET tours?category_id=59` | home page loader | server, `no-store` | Yes | category ID 59 | Tours yes; selection ID is code | Source | PARTIAL |
| Featured trips | home components | `GET tours?home=1` | home page loader | server, `no-store` | Yes | empty-list fallback | Yes | Source + runtime | PASS |
| Special offers | home components | `GET tours?category_id=53` | home page loader | server, `no-store` | Yes | category ID 53 | Tours yes; selection ID is code | Source | PARTIAL |
| Destinations | home components | `GET destinations?home=1` | home page loader | server, `no-store` | Yes | empty-list fallback | Yes | Source + runtime | PASS |
| Home blogs | home components | `GET blogs?home=1` | home page loader | server, `no-store` | Yes | empty-list fallback | Yes | Source + runtime | PASS |
| Home FAQs | home components | `GET faqs?home=1` | home page loader | server, `no-store` | Yes | empty-list fallback | Yes | Source + runtime | PASS |
| Home headings/steps/stats/gallery/partners | i18n strings + static assets | None for UI; settings used for social/gallery destinations | `HomePage.tsx` constants | static SSR | No—English on all locales | Extensive | Only settings links should be | Runtime `/fr` | PARTIAL |
| Header/nav/footer labels | Nuxt i18n | navigation UI; footer email/social/location/title/logo from filtered `GET settings` calls | Nuxt-derived UI dictionary + public settings loader | server SSR | Seven locales with per-key English fallback only where Nuxt lacks a key | Phones/address/WhatsApp remain because no equivalent setting exists | Yes for exposed settings fields | Source + runtime | PASS |
| Currency list/rates | shared store | `GET currencies`; `Currency` | `CurrencyProvider`/server loader | server seed + client cookie | Locale-independent | static USD/EUR/EGP fallback rates | Yes | API + source | PARTIAL |
| Tour card currency display | shared store conversion | currencies + tour price | `TourCard`, `CurrencyProvider` | client context | Applies chosen currency | selected fallback | Rates yes | Source | PASS |
| Tour detail | tour page loader | `GET tours/{slug}?includes=...`; `Tour`, `Seo` | `getTour` | server `no-store` | Header passed | generic/null fallback | Yes | Invalid runtime 200 | PARTIAL |
| Tour category/destination pages | category pages | categories, destinations, tours | reliable category/destination helpers | server `no-store` | Header passed | no fake records | Yes | Invalid runtime 404 | PASS |
| Trips taxonomy/count | Trips component | `categories/count`, `categories`, `destinations` | `getTripTaxonomy` reliable loader and API-driven links | server SSR | `X-Localize` on every call | no invented taxonomy; explicit unavailable state | Yes | Live `/trips`, `/de/trips` | PASS |
| Trips result list | Trips component | `GET tours` with category/destination/title filters | server query builder using live IDs/slugs | server SSR | Header passed | intentional empty state only | Tours yes | Live filtered route | PASS |
| Blog list/detail | blog pages | `GET blogs`, `GET blogs/{slug}?includes=seo` | list loader / `getBlog` | server `no-store` | Header passed | null detail fallback | Yes | Invalid runtime 200 | PARTIAL |
| Travel-guide categories/articles | travel-guide pages | `blog-categories`, blogs | reliable helpers | server `no-store` | Header passed | no fake records | Yes | Runtime 200/invalid 404 | PASS |
| Events list | events page | pages/categories | page/category loaders | server `no-store` | Header passed | empty fallback | Yes | Runtime | PASS |
| Event detail | event page | category/detail endpoint | English unreliable; localized reliable | server `no-store` | Header passed | generic null fallback in English | Yes | EN invalid 200, FR invalid 404 | PARTIAL |
| Four marketing pages | `MarktingPages` / current Page keys | Current `Page` records at `pages/{key}` | explicit live Page-key mapping | server | Header passed | no generic record substitution | Page records yes | Sprint 11 runtime | PASS |
| About team | `settings?option_key=company_team` | `GET settings`; `Setting` | reliable filtered setting loader | server | Header passed | explicit unavailable state | Yes | Live members rendered | PASS |
| Contact/footer company info/social | `GET settings` | filtered setting keys | email/social/location/title/logo consumed; phone/address retained only where no setting exists | server | UI labels localized | confirmed contact fallback only on missing/unusable setting | Yes for exposed keys | Live settings rendered | PASS |
| Contact submission | contact form + reCAPTCHA | `POST contact-requests`; `ContactUsRequest` | `ContactForm` | client mutation | Header passed | none | Stored for dashboard | Source only; not submitted | PASS |
| Custom trip submission | make-trip form | `POST custom/trips`; `CustomTripRequest` | `PlannerRequestFlow` | client mutation | Header passed | destination default `egypt` | Stored for dashboard | Payload source | PARTIAL |
| Rental discovery | rental page | `GET locations`, `POST car/rental/available-destinations` | `PlannerRequestFlow` | client | Header passed | none | Yes | Source only | PASS |
| Rental route/cart append | rental page | route search + `POST cart/rentals/append` | `PlannerRequestFlow` | client nonmutating lookup + mutation | Header passed | selected live currency; USD-only fallback on currency outage | Currencies/routes yes | Payload source | PASS |
| Login/register/password OTP | auth pages | `auth/login`, `auth/register`, `auth/password/*` | `AuthFlow` | client mutation | Header passed | per-key English fallback only where Nuxt translation missing | Client model | Source only | PASS |
| Reset-password modes | auth reset/create-password pages | `auth/password/reset` | both modes use the supported endpoint | client mutation | Header passed | none | Client model | Backend/source audit | PASS |
| Profile hydration | profile page | `GET profile/me` | authenticated refresh replaces cookie snapshot; 401 clears it | client | Header passed | no stale authenticated state | Yes | Source; no production auth call | PASS |
| Profile update | settings page | `PATCH profile`; `ProfileUpdateRequest` | `ProfileFlow` | client bearer mutation | Header passed | none | Yes | Source only | PASS |
| Logout/image | profile API | `POST profile/logout`, `POST profile/change/image` | server revoke + local clear; multipart upload + refresh | client mutation | Header passed | none | Yes | Source; no production mutation | PASS |
| Wishlist | profile favourites | authenticated wishlist endpoints | `ProfileFlow` bearer requests | client | Header passed | none | Yes | Source only | PASS |
| Cart CRUD/coupon | cart components | `cart`, `cart/tours/append`, `cart/rentals/append`, remove/clear, `coupons` | `CartFlow` | client; IP guest identity | Header passed | computed totals | Yes | Source/validator | PASS |
| Checkout/booking | checkout | `POST bookings`; `BookingRequest` | `CheckoutFlow` | client mutation | Header passed | redirect host allowlist | Yes | Payload/validator source | PASS |
| Payment callbacks | callback pages | Fawaterk update; PayPal capture/cancel | `PaymentCallbackStatus` | client mutation after mount | Header passed | status text | Payment state yes | Guard/source only | PASS |
| SEO fields | page/content SEO | `Seo` translations/resources | `metadataFromPage`, `JsonLd` | server-rendered | API locale header | title/description defaults; meta keywords intentionally omitted | Yes | `/fr` head | PARTIAL |
| Sitemap content | live APIs | tours/blogs/categories/destinations/blog categories | split dynamic sitemap endpoints | dynamic with 86,400-second cache | alternates constructed | deliberate stable core paths | Partly | Six child endpoints, 4,972 URLs, zero duplicates | PASS |

## Failure-semantics finding

`apiFetch` returns `null` for every non-2xx response and every transport failure. Tour, blog, and English event detail loaders therefore cannot tell “record does not exist” from timeout, rate limit, or backend outage. Their pages render a normal 200 fallback in both cases. `apiFetchReliable` already models `not_found`, `transient`, and success; category, destination, travel-guide, and localized event routes prove the intended pattern.

Required invariant:

1. Confirmed upstream 404 → Next `notFound()` → HTTP 404.
2. Timeout/408/425/429/5xx → throw to the error boundary or return a genuine 5xx; never call `notFound()`.
3. Successful but empty collection → render an intentional empty state.
4. Do not substitute fabricated production records, prices, taxonomies, or SEO.

Overall dynamic API migration: **PARTIAL**. Dashboard-control fidelity: **PARTIAL** because a staging edit/revert propagation run is unavailable. Cutover: **BLOCKED**.

## Sprint 13 ownership correction — 2026-08-24

Homepage proof is now complete in `sprint13-homepage-ownership-matrix.md`: **12 API-driven/mixed, 8 intentional static, 0 unknown**. Dynamic tours, offers, prices, destinations, blogs, FAQs, settings/social/location, and hero media stay behind their existing loaders. Counters, navigation, How It Works, sustainability copy, CTA presentation, and partner art remain correctly static.

The prior “contact/footer ... logo consumed” row is superseded for logo only. Nuxt and Live prove `/images/logo.png` is the approved static header/footer owner; the different backend `logo` setting is neither requested nor used. Notification email/social/location/title/team fields remain filtered and API-controlled. Phone/address/WhatsApp are deployment configuration; the sustainability mailbox is an intentional Nuxt-static addition after dynamic notification emails.
