# Sprint 17 Final Four Release Blockers

Date: 2026-08-30
Scope: frontend-only fixes for the four blockers named in the Sprint 17 release brief. Historical audit documents were not rewritten.

## 1. TrustIndex widget lifecycle

### Before

The home and booking TrustIndex review widgets could disappear after a client-side route round trip. The certificate badge could also be left without its expected widget lifecycle. A direct page load was not sufficient evidence because the failure depended on mounting a new container after the vendor loader had already run.

### Root cause

`components/TrustIndexLoader.tsx` treated a previously requested vendor script URL as proof that every later widget container had been initialized. The TrustIndex review loader instead discovers and replaces a concrete script element, then queues off-screen widgets until its activity condition is satisfied. A new React container therefore needed its own initialization lifecycle.

### Fix

- Initialize each live widget container independently instead of caching completion by script URL.
- Load the certificate widget immediately for its mounted container.
- Start the heavier review widget near the viewport with an `IntersectionObserver` margin of 1200 px.
- Preserve the existing `no-third-party=1` test bypass.
- Release the vendor activity queue after its fetched widget content becomes available, and clean up observers, polling, and script elements when the owning React effect ends.

### Runtime evidence

- Fresh home load after scrolling: one review widget and one certificate widget rendered.
- Home -> tour -> home: one review widget and one certificate widget rendered after return.
- Home -> blog -> home: one review widget and one certificate widget rendered after return.
- Book-trip -> tour -> book-trip: one review widget and one certificate widget rendered after return.
- `/?no-third-party=1`: no TrustIndex review content, certificate content, or CDN loader script was injected.
- A TrustIndex certificate cleanup exception was reproducible from the vendor script on local HTTP. It did not create a React error, route failure, or first-party exception and is classified as `NON_BLOCKING_VENDOR_WARNING`.

### Regression result

PASS. The widget is present once per intended container after direct loads and SPA remounts, with no duplicate first-party initialization and no application crash.

## 2. SPA locale navigation and `<html lang>`

### Before

Server-rendered locale routes emitted the correct language, but the shared root layout remained mounted during client navigation. Moving between locale roots could therefore leave `document.documentElement.lang` describing the previous route.

### Root cause

The server-side root layout determines its initial `lang` value from the request. Next.js client navigation preserves shared layouts, so a server-only layout value is not a complete lifecycle for a document-level attribute that changes with the pathname.

### Fix

- Add `components/HtmlLangSynchronizer.tsx` to observe `usePathname()` and update the root element on every client transition.
- Add `localeFromPathname()` to `lib/locales.ts` and reuse it in both the synchronizer and `proxy.ts` so pathname-to-locale resolution has one implementation.
- Keep the server-rendered `lang` attribute in `app/layout.tsx` for first response correctness and no-JavaScript behavior.

### Runtime evidence

The following client-side sequence was exercised in one browser session:

| Transition | URL locale | `<html lang>` | Visible locale selector | Localized heading |
| --- | --- | --- | --- | --- |
| `/` -> `/fr` | `fr` | `fr` | `FR` | French |
| `/fr` -> `/de` | `de` | `de` | `DE` | German |
| `/de` -> `/it` | `it` | `it` | `IT` | Italian |
| `/it` -> `/pt` | `pt` | `pt` | `PT` | Portuguese |
| `/pt` -> `/es` | `es` | `es` | `ES` | Spanish |
| `/es` -> `/zh` | `zh` | `zh` | `ZH` | Chinese |
| `/zh` -> `/` | `en` | `en` | `EN` | English |

Raw server HTML also returned the expected `lang` for `/`, `/fr`, `/de`, `/it`, `/pt`, `/es`, and `/zh`.

### Regression result

PASS. URL, document language, locale selector, and localized page content remain aligned through the full SPA sequence and on direct responses.

## 3. Cart and checkout canonical/hreflang metadata

### Before

Cart and checkout pages did not expose the complete locale-aware canonical and hreflang cluster required by the release brief.

### Root cause

These pages used route-local metadata instead of the shared route conventions for the non-prefixed English route, localized alternates, `x-default`, and Open Graph URL.

### Fix

- Add `commercePageMetadata()` in `lib/seo.ts`.
- Use it from the root and localized cart and checkout pages.
- Generate one canonical URL for the active locale, alternates for `en`, `fr`, `de`, `it`, `pt`, `es`, and `zh`, an `x-default` URL matching English, and an Open Graph URL matching the canonical.
- Keep English URLs non-prefixed and retain the existing `index, follow` robots behavior.

### Runtime evidence

Raw HTML was checked for `/cart`, `/fr/cart`, `/de/cart`, `/es/cart`, `/cart/checkout`, `/fr/cart/checkout`, `/de/cart/checkout`, and `/es/cart/checkout`. Every route returned:

- one locale-correct canonical;
- eight alternate entries: `x-default`, `en`, `fr`, `de`, `it`, `pt`, `es`, and `zh`;
- a non-prefixed English and `x-default` URL;
- an Open Graph URL equal to the canonical;
- no `/en` URL and no backend-domain URL;
- `index, follow` robots metadata.

### Regression result

PASS. Cart and checkout metadata now follows the same locale URL contract as the rest of the frontend.

## 4. Special-character inquiry-tour routing and sitemap output

### Before

The inquiry tour slug `Cairo-Private-Nile-Jet-Car-Ride-with-Sunset&Night-Options` returned 404. The upstream detail endpoint does not resolve the encoded ampersand slug, even though the tour exists in the tours collection as ID 721.

### Root cause

Two boundaries needed separate handling:

1. A route segment must be decoded once before lookup and encoded once when creating a URL.
2. The upstream detail endpoint cannot resolve this existing special-character slug, so a narrowly scoped exact-match fallback is required.

Treating URL-segment encoding and XML escaping as one operation also risks either a raw ampersand or double encoding in sitemap output.

### Fix

- Add `decodePathSegment()` and `tourPath()` to `lib/locales.ts` for single-decode lookup and single-encode URL construction.
- Use `tourPath()` in tour cards, tour canonicals/alternates, and sitemap builders.
- When the detail endpoint returns 404 for a slug containing `&`, `?`, or `#`, search paginated tour summaries for an exact raw-slug match, then request the matched ID with the detail includes needed by the page.
- Keep ordinary missing slugs on the normal 404 path and do not use fuzzy matching.
- Bump the sitemap cache key so regenerated XML uses the corrected URL segment.

### Runtime evidence

- Root inquiry route with `%26`: HTTP 200, correct tour title, and canonical containing `%26` exactly once.
- French inquiry route with `%26`: HTTP 200 with a localized canonical.
- Invalid ampersand slug: HTTP 404.
- Sitemap XML contains the intended `%26` URL; XML parsing returns that same URL with no `%2526` double encoding.
- Representative special slugs using an ASCII apostrophe, curly apostrophe, `ö`, and colon also returned HTTP 200 with one encode/decode cycle.
- The inquiry page had no horizontal overflow at 375, 430, 768, 1024, or 1440 px and retained a visible inquiry control.

### Regression result

PASS. The real inquiry tour resolves without weakening 404 behavior, and its sitemap URL is standards-safe and singly encoded.

## Release regression summary

- `npm run lint`: PASS.
- `npm run build`: PASS with Next.js 16.3.3; all 40 static-generation tasks completed.
- `git diff --check`: PASS.
- Next.js `/_next/mcp` `get_compilation_issues`: PASS with an empty issues list.
- Next.js `/_next/mcp` `get_errors`: PASS with no configuration or active-session errors on the inquiry route.
- Invalid tour, blog, event, travel-guide category, and travel-guide article routes: HTTP 404.
- Sitemap index and six child sitemaps: HTTP 200 with `public, s-maxage=86400, stale-while-revalidate=86400`.
- Sitemap set: 4,972 URLs, zero duplicates, zero `/en` URLs, zero wrong-origin URLs, and zero `x-default` cluster errors.
- `robots.txt`: HTTP 200 and declares the sitemap index.
- Representative home, tour, inquiry tour, blog, event, taxonomy, book-trip, cart, and checkout pages: HTTP 200 with canonical metadata on the public frontend origin.

## Classification

- Remaining frontend P0 blockers: 0.
- Remaining frontend P1 blockers: 0.
- TrustIndex local-HTTP cleanup exception: `NON_BLOCKING_VENDOR_WARNING`.
- Frontend release candidate: PASS.
- Production cutover from the frontend perspective: PASS.

Recommendation: freeze this candidate for release. No commit or backend change is included in this work.
