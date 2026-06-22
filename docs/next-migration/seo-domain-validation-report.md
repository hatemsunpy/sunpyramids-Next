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
