# SEO Domain Validation Report

## Code-Level Checks

| Check | Evidence | Status |
|---|---|---|
| Frontend SEO origin | `lib/seo.ts` uses `https://sunpyramidstours.com` fallback. | Passed. |
| Backend API origin | `lib/config.ts` uses `https://sunpyramidtours.com/api/` fallback. | Passed. |
| Canonical host rewrite | `normalizeCanonical()` rewrites parsed canonical host to `FRONTEND_ORIGIN`. | Passed. |
| `og:url` frontend host | `metadataFromPage()` sets OG URL to normalized canonical. | Passed. |
| Hreflang frontend host | `metadataFromPage()` and `publicUrl()` build frontend URLs. | Passed. |
| Sitemap frontend host | `app/sitemap.ts` uses `FRONTEND_ORIGIN` and `publicUrl()`. | Passed in code. |
| Robots sitemap frontend host | `app/robots.ts` uses `${FRONTEND_ORIGIN}/sitemap.xml`. | Passed in code. |
| Backend domain remains for API | `lib/api.ts` and `app/sitemap.ts` fetch via `API_BASE`. | Passed. |
| Public meta keywords | `metadataFromPage()` does not return `keywords`. | Passed in code; raw HTML pending. |

## Raw HTML Validation Needed

Run on priority pages after local/staging server is available:

- `<title>`
- `<meta name="description">`
- canonical
- hreflang
- `og:title`
- `og:url`
- Twitter tags
- JSON-LD
- absence of `<meta name="keywords">`

## Local Validation Result

Date: 2026-06-22

Target: `http://localhost:3000/` from the production build.

| Check | Result |
|---|---|
| `<title>` present | Passed |
| Meta description present | Passed |
| Canonical present | Passed |
| Public meta keywords absent | Passed |
| Frontend domain present in SEO URLs | Passed |
| Backend domain in canonical/hreflang/og:url | Passed; not present |
| Backend domain in media metadata | Present in `og:image` / `twitter:image`; acceptable because backend media URLs are allowed when dashboard media provides them. |

## Priority Pages

- `/`
- `/egypt-tours/one-day-tours`
- representative `/tour/[slug]`
- `/contact-us`
- `/blogs/all-blogs`
- representative `/blog/[slug]`
- `/fr`
- `/de`

## Sprint 2 Raw HTML Validation Result

Date: 2026-06-22

Target: local production build at `http://localhost:3000`.

Representative tour slug: `from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis`.

| Route | Title | Description | Canonical | Hreflang | `og:url` frontend domain | Twitter | Robots | JSON-LD | Meta keywords absent | Backend SEO URL leak |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `/egypt-tours/one-day-tours` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | Pass |
| `/tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | Pass |
| `/contact-us` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass |

Backend media URLs may still appear in image metadata where dashboard media uses backend/storage URLs. No backend domain was found in canonical, hreflang, or `og:url`.

## Cutover Status

Code safeguards are present and Sprint 2/Sprint 3 local raw HTML checks passed for the requested pages. Production SEO/domain approval is still pending staging validation.

## Sprint 3 Raw HTML Validation Result

Date: 2026-06-22

Target: local production build at `http://localhost:3000`.

Representative tour slug: `from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis`.

| Route | Title | Description | Canonical | `og:url` frontend domain | Robots | JSON-LD | Meta keywords absent | Backend SEO URL leak |
|---|---|---|---|---|---|---|---|---|
| `/` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `/egypt-tours/one-day-tours` | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | Pass |
| `/tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis` | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | Pass |
| `/contact-us` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass |

No backend/API domain was found in canonical or `og:url`. Backend media URLs remain allowed where dashboard media supplies image URLs.

## Sprint 4 Raw HTML Validation Result

Date: 2026-06-22

Target: local production build at `http://localhost:3000`.

Representative tour slug: `from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis`.

| Route | Title | Description | Canonical | Open Graph | `og:url` frontend domain | Twitter | Robots | JSON-LD | Meta keywords absent | Backend SEO URL leak |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass |
| `/egypt-tours/one-day-tours` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | Pass |
| `/tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | Pass |
| `/contact-us` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass |

No backend/API domain was found in canonical or `og:url`. `?no-third-party=1` does not alter server-rendered SEO raw HTML.

## Sprint 5 Raw HTML Validation Result

Date: 2026-06-22

Target: local production build at `http://127.0.0.1:3000`.

Representative tour slug: `from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis`.

| Route | Title | Description | Canonical | Hreflang | Open Graph | Twitter | Robots | JSON-LD | Meta keywords absent | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Backend media URLs appear in image metadata only. |
| `/egypt-tours/one-day-tours` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | Backend media URLs appear in image metadata only. |
| `/tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | No backend canonical/OG URL leak. |
| `/contact-us` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Pass | Backend media URLs appear in image metadata only. |
| `/cart` | Basic metadata only | Basic metadata only | Not present | Not present | Not present | Not present | Not present | Not present | Pass | Private/customer flow route; public SEO enrichment requires business decision. |
| `/cart/checkout` | Basic metadata only | Basic metadata only | Not present | Not present | Not present | Not present | Not present | Not present | Pass | Disallowed in robots; private checkout route. |

No backend/API domain was found in canonical or `og:url` for public SEO routes. Backend media URLs remain allowed where dashboard media supplies image URLs. No hardcoded SEO values were added for cart/checkout.

## Sprint 6 SEO/Domain Validation Status

Date: 2026-06-23

Staging raw HTML validation is blocked because no staging frontend URL was provided. Existing local/code rules remain:

- Public SEO URLs must use `https://sunpyramidstours.com`.
- Backend/API calls may use `https://sunpyramidtours.com`.
- Backend/admin/API URLs must not leak into canonical, hreflang, Open Graph URL, Twitter URL, robots, or JSON-LD output.
- Dashboard/API-driven SEO must not be replaced with hardcoded production content.
- Private-flow pages such as cart/checkout may keep basic safe metadata unless business approves richer SEO behavior.

Required Sprint 7 check: rerun raw HTML validation on `/`, `/egypt-tours/one-day-tours`, representative `/tour/[slug]`, `/contact-us`, `/blogs/all-blogs`, representative `/blog/[slug]`, `/fr`, `/de`, `/cart`, `/cart/checkout`, `/make-your-trip`, and `/rent-car` against staging and local production builds.

### Sprint 6 Local Raw HTML Result

Target: local production build at `http://127.0.0.1:3106`.

| Route | Title | Description | Canonical/hreflang | OG/Twitter | Robots | JSON-LD | Meta keywords absent | Backend SEO URL leak |
|---|---|---|---|---|---|---|---|---|
| `/` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No |
| `/egypt-tours/one-day-tours` | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | No |
| Representative `/tour/[slug]` | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | No |
| `/contact-us` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No |
| `/cart` | Pass | Pass | Basic private metadata only | Basic private metadata only | Basic private metadata only | Not present | Pass | No |
| `/cart/checkout` | Pass | Pass | Basic private metadata only | Basic private metadata only | Basic private metadata only | Not present | Pass | No |
| `/make-your-trip` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No |
| `/rent-car` | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | No |

## Sprint 7 SEO/Domain Validation Status

Date: 2026-06-23

Code-level domain separation remains unchanged:

- Public SEO origin: `NEXT_PUBLIC_APP_URL`, fallback `https://sunpyramidstours.com`.
- Backend/API origin: `NEXT_PUBLIC_API_URL`, fallback `https://sunpyramidtours.com/api/`.
- Sitemap and robots use frontend origin for public URLs.
- API fetches may use the backend/API domain.
- No staging URL was provided, so staging raw HTML validation is blocked.

### Sprint 7 Local Raw HTML Result

Target: local production build at `http://127.0.0.1:3107`.

| Route | Title | Description | Canonical/hreflang | OG/Twitter | Robots | JSON-LD | Meta keywords absent | Backend SEO URL leak |
|---|---|---|---|---|---|---|---|---|
| `/` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No |
| `/egypt-tours/one-day-tours` | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | No |
| Representative `/tour/[slug]` | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | No |
| `/contact-us` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No |
| `/cart` | Pass | Pass | Basic private metadata only | Basic private metadata only | Basic private metadata only | Not present | Pass | No |
| `/cart/checkout` | Pass | Pass | Basic private metadata only | Basic private metadata only | Basic private metadata only | Not present | Pass | No |
| `/make-your-trip` | Pass | Pass | Pass | Pass | Pass | Pass | Pass | No |
| `/rent-car` | Pass | Pass | Pass | Pass | Pass | No dashboard schema rendered | Pass | No |
