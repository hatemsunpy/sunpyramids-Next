# SEO Mapping

Source of truth: `nuxt_sunpyramids/composables/useSeo.js`, `nuxt_sunpyramids/utils/seo.js`, Next `lib/seo.ts`, route `generateMetadata()` functions, and `components/JsonLd.tsx`.

## Current Next SEO Architecture

| Requirement | Current implementation | Status |
|---|---|---|
| Server-side metadata | App routes use `generateMetadata()` and API fetches through `lib/data.ts`. | Implemented for public SEO routes inspected. |
| Dashboard SEO source | `metadataFromPage()` reads `page.seo`. | Implemented. |
| Title fallback | `seo.meta_title`, then page title/name, then safe fallback. | Implemented. |
| Description fallback | `seo.meta_description`, then page description, then safe fallback. | Implemented. |
| Canonical frontend domain | `normalizeCanonical()` rewrites canonical host to `FRONTEND_ORIGIN`. | Implemented. |
| Hreflang/alternates | `metadataFromPage()` emits all supported locales plus `x-default`. | Implemented. Needs raw HTML validation. |
| Open Graph | Uses dashboard OG title/description/image/type with validation for type. | Implemented. |
| Twitter | Uses dashboard Twitter fields with validated card fallback. | Implemented. |
| Meta keywords | `SeoFields` keeps the field but metadata does not render keywords. | Implemented. Needs raw HTML validation. |
| JSON-LD | `JsonLd` uses `validateAndParseSchema()`. | Implemented. |
| Invalid schema safety | Empty/invalid schema returns null and does not render. | Implemented. |

## Nuxt to Next Mapping

| Nuxt concept | Next equivalent | Notes |
|---|---|---|
| `useSeo()` / `useHead()` | `generateMetadata()` and `metadataFromPage()` | SEO-critical content renders server-side. |
| Dashboard `seo` object | `SeoFields` in `types/api.ts` | Field names align with current Next implementation. |
| Structure schema | `validateAndParseSchema()` plus `JsonLd` | Does not invent fallback schema. |
| Locale SEO tabs | `X-Localize` header through `apiFetch()` | Requires backend validation that locale-specific fields are returned. |
| Canonical override | `normalizeCanonical()` | Public host forced to `https://sunpyramidstours.com`. |

## Confirmed Safeguards

- Backend domain is not used by `publicUrl()`, canonical, or sitemap URL helpers.
- Open Graph type and Twitter card values are validated with module-level sets.
- Schema parsing failures do not crash rendering.
- Payment callback routes do not call payment APIs from metadata generation.

## Remaining Validation

- Raw HTML checks passed locally for `/`, `/egypt-tours/one-day-tours`, representative `/tour/[slug]`, and `/contact-us` on 2026-06-22 in both Sprint 2 and Sprint 3.
- Confirmed no `<meta name="keywords">` in rendered HTML for the Sprint 3 priority route set.
- Confirm localized pages return locale-specific SEO data rather than English unless fields are empty.
- Confirm dashboard canonical overrides with backend host are rewritten to frontend host.
- Confirm JSON-LD uses dashboard schema only and never invented business values.

## Sprint 2 Note

The one-day tours page and representative tour page did not render JSON-LD because no valid dashboard `structure_schema` was present in the fetched API data. This matches the rule to avoid invented schema fallback data.
