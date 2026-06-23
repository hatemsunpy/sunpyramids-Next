# Sitemap and Robots Validation Report

## Current Implementation

| File | Behavior | Status |
|---|---|---|
| `app/robots.ts` | Allows `/`, disallows `/api/`, `/admin/`, `/dashboard/`, `/cart/checkout`, points to frontend-domain sitemap. | Passed for current route structure. |
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

## Sprint 8 Backend Sitemap Discovery

Laravel backend exposes `GET /api/pages` and `GET /api/pages/{key}`. Backend `SitemapGenerator` hardcodes static routes including `hidden-gems`, `global-tours`, `sun-pyramids-reward-program`, and `responsible-travel-policy`, and dynamically includes enabled tours, active blogs, active blog categories, and enabled Egypt child destinations.

This improves source evidence for custom marketing pages, but it is not final approval to hardcode every static route in Next. SEO/business must approve the manual/static route set or confirm a backend source-of-truth strategy.
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

## Sprint 9 Backend Contract Alignment

No sitemap code changed in Sprint 9. The backend discovery of `GET /api/pages` is documented, but it was not promoted into the production sitemap because SEO/business approval is still needed for the custom marketing source-of-truth strategy.

Current decision remains blocked: either approve backend/API-driven marketing page discovery, approve a manual custom marketing slug set, or explicitly exclude those pages from cutover scope.

## Sprint 3 Status

Date: 2026-06-22

- `/sitemap.xml` returned HTTP 200 in the local production route smoke test.
- `/robots.txt` returned HTTP 200 in the local production route smoke test.
- Custom marketing page discovery remains blocked. The confirmed Nuxt behavior uses `custom-pages/{slug}` detail pages, while the attempted list endpoint `custom-pages?page_limit=2` returned 404 in Sprint 2 discovery. No alternate discoverable list endpoint was confirmed in Sprint 3, so no hardcoded marketing slugs were added.

## Sprint 4 Status

Date: 2026-06-22

- `/sitemap.xml` returned HTTP 200 in the local production route smoke test.
- `/robots.txt` returned HTTP 200 in the local production route smoke test.
- Re-checking Nuxt source again found only `components/MarktingPages/index.vue` using `custom-pages/{slug}` detail reads. No custom marketing list/discovery endpoint was confirmed.
- Custom marketing sitemap coverage remains blocked pending backend list endpoint support or explicit business exclusion approval.

## Sprint 5 Custom Marketing Page Decision Status

Date: 2026-06-22

- Re-checked Nuxt source and current API inventory. Nuxt confirms custom marketing detail reads through `custom-pages/{slug}` only.
- No confirmed list/discovery endpoint was found in the Next or Nuxt source.
- The previously tested `custom-pages?page_limit=2` list endpoint returned 404 and remains unconfirmed.
- No hardcoded custom marketing slugs were added because business/SEO approval was not provided.

Decision remains blocked. Acceptable resolution paths are: backend provides a list endpoint, another confirmed API endpoint exposes the slugs, business/SEO explicitly approves temporary exclusion, or business/SEO explicitly approves a manually configured slug list.

## Sprint 6 Custom Marketing Page Decision Status

Date: 2026-06-23

Decision remains blocked. Sprint 6 did not receive a backend list endpoint, alternate confirmed slug source, approved manual slug list, or explicit business/SEO exclusion.

Rules still in force:

- Do not hardcode custom marketing page slugs without approval.
- Preserve frontend-domain URLs in sitemap output.
- Do not leak backend/admin/API URLs into public SEO output.
- Keep custom marketing sitemap coverage open until backend support or explicit business/SEO decision is available.

## Sprint 7 Custom Marketing Page Decision Status

Date: 2026-06-23

Decision remains blocked. No backend list endpoint, alternate confirmed API slug source, business/SEO-approved manual slug list, or explicit exclusion approval was provided.

Accepted resolution paths remain:

1. Backend provides a list endpoint.
2. Slugs are discovered from another confirmed API endpoint.
3. Custom marketing pages are explicitly excluded from sitemap for now.
4. Manual slugs are approved by the business/SEO owner.
5. Blocker remains open.
