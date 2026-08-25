# Dashboard control proof

This document proves control from dashboard request validation/model translation through API resource and Next rendering. “Backend control exists” does not count as parity when Next substitutes static values or fails to consume the endpoint.

## Control-chain matrix

| Domain / fields | Dashboard/backend proof | API exposure | Next consumption | Live/runtime proof | Status |
|---|---|---|---|---|---|
| Pages: key, localized title/content/short description, banners/galleries/features | `PageRequest` validates per-locale fields and page assets | `PageResource` includes `SeoResource`; `GET pages/{key}` | Home/generic pages use page loader | Current `pages` API returned 38 records; localized home title rendered | PASS |
| Page SEO: localized title/description/keywords/OG/canonical | `PageRequest` validates `seo.{locale}.*` | `SeoResource` through `includes=seo` | Metadata consumes title, description, robots, canonical, OG/Twitter/schema | `/fr` produced localized title/description/canonical and JSON-LD | PARTIAL |
| Tours: localized content, prices, offer, availability, categories, destinations, media/options/seasons | `TourRequest` validates all named fields and relationships | `TourResource` exposes category/destination/option relations; controller supports includes | Tour cards/detail/category/home consume data | Valid tour/category pages rendered | PASS |
| Tour SEO | Dashboard SEO fields per locale | Tour model/resource includes SEO when requested | Tour metadata consumes SEO | Valid localized tour head rendered | PARTIAL |
| Categories: localized title/description, slug/order/status/media, hierarchy, SEO | `CategoryRequest` validates fields/SEO | category list/detail/count | Category routes, sitemap, and Trips taxonomy/count filters consume | Live counts/labels and invalid 404 | PASS |
| Destinations: localized content, hierarchy, media, geo, SEO | `DestinationRequest` validates fields/SEO | destination list/detail | Home/category/sitemap and Trips filter consume live slugs/titles | Live Trips list + detail runtime | PASS |
| Blogs: localized title/description/tags, state/order, relationships, media, SEO | `BlogRequest` validates fields and localized SEO | `BlogResource` includes SEO/category | Blog and guide pages consume | Valid pages render; invalid blog soft-200 | PARTIAL |
| Blog categories / travel guide | Dashboard models/requests and `BlogCategoryResource` | list/detail with SEO | Guide routes and sitemap categories consume | Invalid category/article 404 | PASS |
| Events | Represented through current page/category content | pages/categories APIs | Events list/detail consume | Valid events render; English invalid event soft-200 | PARTIAL |
| FAQs | FAQ dashboard model/request | FAQ list/detail | Home and FAQ page consume | Localized FAQ data rendered | PASS |
| Currencies: active/name/symbol/rate/icon | `CurrencyRequest` validates exchange rate and display fields | currency list/detail | selector and tour/cart/checkout use selected currency | Current API exposed USD/EUR/EGP | PARTIAL |
| Settings: title/logo/emails/location/social/team | `SettingsRequest` validates enum-backed arrays and clears `settings_` cache keys after update | `GET settings` with exact `option_key` filtering | Shell/contact/about consume only public presentation keys | Current production values rendered in local SSR | PASS |
| Marketing pages | Current Page records include four discovered campaign keys | `GET pages/{key}` works; stale `custom-pages` absent | Explicit Page-key mapping | Sprint 11 runtime showed live titles | PASS |
| Reviews/ratings | Tour review model/API | GET/POST `tour-reviews`; tour includes may expose review data | Display can use entity data; direct submission not present | No fake rating records found in Next | PARTIAL |
| Auth/client/profile | Client/profile controllers and requests | auth/password/profile/wishlist/bookings endpoints | Core login/update/lists plus me/logout/image/social callback | Source contract audit only; no production mutation | PASS |
| Cart/booking/payment | Cart and booking models/validators, payment controllers | full cart CRUD, booking create, callbacks | Core flow wired | No state-changing call made | PARTIAL |
| Rental | location/car rental models and validators | discovery/search/checkout/cart append | active Nuxt discovery/search/append surface; selected live currency | Source contract audit | PASS |

## SEO field fidelity

| Dashboard/API field | Next output | Status |
|---|---|---|
| `meta_title` | `<title>` | PASS |
| `meta_description` | meta description | PASS |
| `meta_keywords` | Intentionally not rendered publicly, as required | PASS |
| `canonical` | Emitted, with backend origin rewritten to the public frontend origin | PASS |
| `robots` | Emitted with `index, follow` fallback | PASS |
| `og_title`, `og_description`, `og_image`, `og_type` | Open Graph output | PASS |
| Twitter fields | Twitter card/title/description/image/creator | PASS |
| `structure_schema` | Safely parsed and server-rendered as JSON-LD when valid | PASS |
| `viewport` | Dashboard accepts it, but Next metadata helper does not emit it | MISSING |

The canonical rewrite is intentional and correct for the split architecture: API/media may remain on `sunpyramidtours.com`, while public page URLs and canonical/alternate URLs must use `sunpyramidstours.com`.

## Dashboard-control acceptance test required before cutover

In a staging copy only, change one noncritical record for each of Page, Tour, Category, Destination, Blog, FAQ, Currency, and Settings; verify English and one secondary locale in the API, server-rendered body, metadata, and sitemap where applicable; revert through the dashboard. This audit did not mutate production.

Dashboard control chain: **PASS by source + read-only runtime** for Sprint 12 surfaces. End-to-end edit propagation: **BLOCKED** because no approved staging dashboard target/credentials were available; production was not mutated.

## Sprint 13 read-only control result — 2026-08-24

No dashboard or Laravel mutation occurred. Confirmed controlled homepage fields remain dynamic: hero gallery/page SEO, tour/offer records and prices, destination highlights, blogs, FAQs, currencies, notification emails, social links, location link, site title, and team data. Static counters, How It Works, sustainability/CTA copy, navigation, partner imagery, contact deployment values, and the approved local logo were not falsely assigned to dashboard ownership.

Dashboard control remains **PARTIAL** only because the approved staging edit/observe/revert test is unavailable. Backend/security ownership of the public settings allowlist remains `BACKEND_CHANGE_REQUIRED`.
