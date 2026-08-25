# Locale route and API parity

Supported production locales are English at the root plus `fr`, `de`, `it`, `pt`, `es`, and `zh`. `/en` is correctly not a public locale prefix.

## Runtime proof

| Probe | Result | Meaning |
|---|---|---|
| `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh` | 200 | Localized public home handlers exist. |
| `/fr/tour/{valid-slug}` | 200, localized API content | Locale header reaches tour API. |
| `/fr/egypt-travel-guide/{category}/{article}` | 200, localized API content | Nested locale path and API content work. |
| `/fr/event/{invalid-slug}` | 404 | Localized reliable event loader is correct. |
| `/fr/cart` | 404 | Localized customer conversion route missing. |
| `/fr/auth/sign-in` | 404 | Header emits a broken localized account link. |
| `/fr/profile` | 404 | Localized account route missing. |
| `/fr/thankful` | 404 | Localized forms can navigate to a missing completion route. |
| `/en` | 404 | Correct default-locale URL policy. |
| `/fr` document element | `<html lang="en">` | Root layout language declaration is wrong. |

## Content-type matrix

| Content / flow | Route parity | API locale propagation | Translated UI | Metadata/hreflang | Language switch preserves equivalent path | Status |
|---|---|---|---|---|---|---|
| Home | All seven | Yes | No; major UI/header/footer English | API title/description/canonical and alternates present; HTML lang wrong | Yes for `/` | PARTIAL |
| Static/API pages (about, contact, FAQ, sustainability, policies, accessible) | All seven | Yes | Shared shell English | Alternates generated | Yes | PARTIAL |
| Tour detail | All seven | Yes | Shared controls English | Per-content metadata, canonical, alternates | Yes | PARTIAL |
| Tour category/destination | All seven | Yes | Shared controls English | Per-content metadata/alternates | Yes | PARTIAL |
| Marketing pages | Paths accepted by catch-all | Yes, but wrong page key/source | English/generic | Generic page metadata risk | Yes, to wrong content | FAIL |
| Blog list/detail | All seven | Yes | Shared shell English | Per-content metadata/alternates | Yes | PARTIAL |
| Travel guide | All seven | Yes | Shared shell English | Per-content metadata/alternates | Yes | PARTIAL |
| Events | All seven | Yes | Shared shell English | Per-content metadata/alternates | Yes | PARTIAL |
| Trips/search | All seven | Initial API yes | Filters hardcoded English | Generic page SEO | Yes | FAIL |
| Make-your-trip | Hyphen form all seven; underscore only English | Yes | Form English | Alternates can reference hyphen family | Yes for hyphen form | PARTIAL |
| Rent car | All seven | Yes | Form English | Page alternates present | Yes | PARTIAL |
| Authentication | English only | Mutations pass locale | English | No equivalent localized pages | Switch produces 404 | FAIL |
| Cart/checkout | English only | Mutations pass locale | English | Robots exclusion applies to English path; locale routes absent | Switch produces 404 | FAIL |
| Profile/bookings/wishlist/settings | English only | API calls pass locale | English | No localized equivalents | Switch produces 404 | FAIL |
| Payment callbacks | English only | Callback calls pass locale | English | No localized equivalents | Switch produces 404 | FAIL |
| Thank-you page | English only | N/A | English | Localized completion URL absent | Switch/form redirect produces 404 | FAIL |

## Locale-count evidence from the live inventory

| Locale | Discovered live document URLs |
|---|---:|
| en | 670 |
| fr | 651 |
| de | 651 |
| it | 655 |
| pt | 648 |
| es | 638 |
| zh | 638 |

Counts vary because production content is not perfectly symmetric; parity must therefore be validated by stable content identity/translation relationships, not equal raw totals.

## Required fixes

1. Set the actual document language per route. Because App Router root layouts cannot derive arbitrary descendant params, use a locale-aware layout architecture or middleware/header strategy that produces the correct server-rendered `<html lang>`.
2. Add localized handlers for auth, cart/checkout, profile, callbacks, book-trip, and thank-you flows, or intentionally keep them English and stop emitting localized internal links/alternates for them.
3. Move shared shell, forms, filters, status, and home copy to locale dictionaries.
4. Build alternates only from known route capabilities; do not assert nonexistent equivalents.
5. Add a seven-locale route-contract test covering status, canonical, `lang`, hreflang, switch target, and a translated API field.

Locale parity: **FAIL**. This is a production cutover blocker because localized navigation currently sends users into 404s during account and conversion flows.

## Sprint 11 P0 locale update — 2026-08-24

The findings above are the **Before Sprint 11** baseline.

**After Sprint 11 route contracts:** localized handlers now cover six auth modes, cart, checkout, profile plus bookings/favourites/settings, five approved payment callbacks, book-trip, thank-you, and both make-trip spellings. Runtime safe-GET coverage was 21/21 for each of FR, DE, IT, PT, ES, and ZH: **126/126 total**. `/en` remains intentionally invalid; helpers keep English at the root.

**After Sprint 11 raw document language:** `/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, and `/zh` emitted `en`, `fr`, `de`, `it`, `pt`, `es`, and `zh` respectively in raw server HTML. This is supplied before render through the request proxy/header path, not changed after hydration.

**After Sprint 11 links:** audited customer links and redirects use `withLocale`, and payment/thank-you status links now receive the active locale. No tested supported-locale UI target resolved to a known 404.

Locale parity is upgraded from **FAIL** to **PARTIAL**. The P0 contract/language gate passes, but full translation of shared header/footer/forms/status copy remains a separate P1 requirement.

**Remaining blocker:** translated shared UI and dashboard/settings content parity, not customer route availability or `<html lang>`.

## Sprint 12 targeted shared-UI update — 2026-08-24

Header, footer, mobile navigation, auth, profile, and rental/planner surfaces now reuse confirmed Nuxt translations for `en/fr/de/it/pt/es/zh`. Missing Nuxt keys fall back individually to the confirmed English dictionary; API entities continue to use `X-Localize` rather than frontend translation. Live `/de/trips` rendered German navigation/search/tour labels alongside localized API content.

Locale parity remains **PARTIAL** because the sprint intentionally targeted shared conversion/account chrome, not every page-specific marketing sentence, status message, or home section.

## Sprint 13 homepage/contact locale update — 2026-08-24

Confirmed Nuxt dictionaries now cover current header promotion, homepage hero/actions/counters/campaign/filters/How It Works/highlights/blog/gallery/FAQ/lead labels, search/planner labels, and contact-form input/button labels for `en/fr/de/it/pt/es/zh`. Dynamic entity text still comes from API requests with `X-Localize`.

The final acceptance pass also moved confirmed sign-out, cart actions, coupon, checkout/billing/payment-method, profile headings, and payment-status labels to the same dictionaries. English fallback remains only where the corresponding Nuxt locale omits the key or no Nuxt key exists.

Runtime root checks: `/`=`lang=en`; `/fr`, `/de`, `/it`, `/pt`, `/es`, `/zh` each returned HTTP 200 with the matching raw `lang`; `/en` returned 404. Locale parity remains **PARTIAL** only for remaining page-specific marketing/status/error copy without a confirmed Nuxt key, not for route availability, document language, or the audited homepage shared UI.
