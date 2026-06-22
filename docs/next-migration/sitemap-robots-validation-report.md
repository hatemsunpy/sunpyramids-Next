# Sitemap and Robots Validation Report

## Current Implementation

| File | Behavior | Status |
|---|---|---|
| `app/robots.ts` | Allows `/`, disallows `/api/`, `/admin/`, `/dashboard/`, `/checkout`, points to frontend-domain sitemap. | Partial pass. Confirm whether `/checkout` is the intended disallow path or whether `/cart/checkout` should be handled differently. |
| `app/sitemap.ts` | Emits static paths plus paginated tours/blogs, categories, destinations, and blog categories from API. Uses 15-second timeout per API call and returns valid list even if a content group fails. | Improved in Sprint 2. |

## Local Validation Result

Date: 2026-06-22

Target: `http://localhost:3000/robots.txt` and `http://localhost:3000/sitemap.xml` from the production build.

| Check | Result |
|---|---|
| Robots references frontend-domain sitemap | Passed |
| Sitemap contains frontend-domain URLs | Passed |
| Sitemap contains backend-domain URLs | Passed; none found |
| Sitemap returns XML content | Passed |

## Sprint 2 Validation Result

Date: 2026-06-22

Target: `http://localhost:3000/sitemap.xml` from the production build after the sitemap fix.

| Check | Result |
|---|---|
| Static pages | Passed |
| Tours | Passed; representative `/tour/sharm-el-sheikh-mega-safari...` URL found. |
| Blogs | Passed |
| Categories | Passed via category API `link` when available or `/egypt-tours/{slug}` fallback. |
| Destinations | Passed via `/egypt-tours/one-day-tours/{slug}` from Nuxt route behavior. |
| Travel guide categories | Passed via `/egypt-travel-guide/{slug}`. |
| Custom marketing pages | Blocked; `custom-pages?page_limit=2` returned 404, while Nuxt only confirms `custom-pages/{slug}` detail usage. Needs backend list endpoint or business decision. |
| Localized alternates | Passed for generated entries through sitemap `alternates`. |
| Backend/admin/API URL leaks | Passed; none found. |
| Unsupported Arabic URLs | Passed; none generated. |

## Spec Requirements vs Current Coverage

| Requirement | Current status | Gap |
|---|---|---|
| Use `https://sunpyramidstours.com` | Implemented through `FRONTEND_ORIGIN`. | Raw XML validation pending. |
| Pull live indexable pages from API/database | Improved. Tours/blogs/categories/destinations/blog categories fetched from API. | Custom marketing list endpoint missing. |
| Include static pages | Implemented via `staticPaths`. | Confirm all indexable static routes included. |
| Include tours | Implemented with paginated API fetch. | Confirm maximum page cap remains enough as catalog grows. |
| Include blogs | Implemented with paginated API fetch. | Confirm maximum page cap remains enough as blog catalog grows. |
| Include categories/destinations | Implemented from confirmed API endpoints. | None currently. |
| Include custom marketing pages | Not implemented. | Needs backend endpoint discovery; list endpoint returned 404. |
| Exclude noindex | Implemented for tours/blogs with `seo.robots`. | Static paths need page-level noindex validation if dashboard controls it. |
| Use real lastmod | Implemented for tours/blogs where `updated_at` exists. | Static paths use current date; should use API/dashboard dates if available. |
| 15-second timeout | Implemented per fetch group. | Passed. |
| No backend/admin/API URLs | Code uses frontend URL helpers. | Raw sitemap validation pending. |

## Cutover Status

Not approved. Sitemap coverage is improved and passes local checks for confirmed API groups, but custom marketing page discovery still needs a backend endpoint or explicit exclusion/approval.
