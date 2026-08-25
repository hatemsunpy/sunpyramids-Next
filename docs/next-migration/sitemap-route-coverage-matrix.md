# Sitemap route coverage matrix

Audit date: 2026-08-24. Production uses a sitemap index with five child sitemaps; Next generates a single dynamic sitemap from several API lists plus a static path array.

## Production baseline

| Live child sitemap | HTTP | URLs |
|---|---:|---:|
| `sitemap-pages.xml` | 200 | 517 |
| `sitemap-posts.xml` | 200 | 734 |
| `sitemap-tours-1.xml` | 200 | 1,074 |
| `sitemap-tours-2.xml` | 200 | 1,074 |
| `sitemap-tours-3.xml` | 200 | 1,074 |
| **Total** | | **4,473** |

Live shape totals across locales: 3,222 tour detail, 734 blog detail, 219 Egypt-tour nested/category/destination, 109 travel-guide article, 59 travel-guide category, 42 event detail, and the remaining static/listing pages. Production locale totals are en 640, fr 644, de 644, it 647, pt 641, es 630, zh 628.

## Next generator coverage

| Route/content type | Live evidence | Next generator source | Included | Correct alternates | Status / gap |
|---|---:|---|:--:|:--:|---|
| Static/listing pages | Production page sitemap | `staticPaths` | Partial | No | Includes nonexistent localized `book-egypt-trip`, `make_your_trip`, and `thankful`; omits capability-aware filtering. |
| Tour detail | 3,222 across locales | paginated `tours` list | Yes, unstable | Partial | Entity list fluctuates with failed pages; alternate URLs are synthetically generated for all locales. |
| Blog detail | 734 across locales | paginated `blogs` list | Yes, unstable | Partial | Unescaped/space-bearing slugs can differ from live encoded URLs. |
| Event detail | 42 | No event fetch/loop | No | No | Entire content type missing. |
| Travel-guide category | 59 | `blog-categories` | Yes, unstable | Partial | Latest sample contained 30 base entries. |
| Travel-guide article | 109 | No nested article loop | No | No | Entire content type missing. |
| Egypt-tour category/destination | 219 | categories + destinations | Partial | Partial | Latest sample contained 77 base entries; live nested combinations are not reproduced. |
| Four API-discovered marketing pages | Live HTTP 200, absent from live sitemap | Not mapped | No | No | Decide indexability; if indexable, add correct page-key routes and sitemap entries. |
| `x-default` | Present in page metadata policy | Not generated in sitemap alternates | No | No | Add `x-default` or document a deliberate search-engine policy. |

## Snapshot comparison and stability

With no code changes, repeated local `/sitemap.xml` requests produced **634**, **618**, and **718** `<url>` entries. The latest 718-entry sample contained:

| Base entry type | Count |
|---|---:|
| Tour detail | 484 |
| Blog detail | 111 |
| Event detail | 0 |
| Travel-guide article | 0 |
| Travel-guide category | 30 |
| Egypt-tour paths | 77 |
| Static/other | 16 |

Every entry had seven `xhtml:link` alternates, but there were zero `x-default` links. A separate 618-entry snapshot compared to the 640 live English URLs matched 497, missed 143, and added 121. Missing classes were 97 tours, 19 Egypt-tour nested paths, 18 travel-guide articles, six events, two differently encoded blog URLs, and one static path. These are point-in-time numbers; the fluctuation is itself the durable finding.

## XML validity and origin

- Public `<loc>` and alternate URLs correctly use `https://sunpyramidstours.com`; no backend-domain page URLs were found.
- The XML is **not well formed**. At least these API slugs are inserted without XML escaping:
  - `Cairo-Private-Nile-Jet-Car-Ride-with-Sunset&Night-Options`
  - `egypt-vacation-itineraries-including-cairo&-nile-cruise-tours`
- A strict XML parser fails at the first raw ampersand; the latest sample contained 16 raw ampersand occurrences across loc/alternate output.
- The API pagination fetch uses `no-store`, a fixed timeout, and no reliable retry/result distinction. A failed page silently shrinks the sitemap.

## Required cutover fixes

1. XML-escape every generated URL and add a strict parser test.
2. Enumerate events and travel-guide articles, and reproduce nested category/destination route identities.
3. Fetch all API pages through reliable bounded retries; fail sitemap generation visibly instead of returning a partial success document.
4. Generate alternates only for route/content translations that exist; add `x-default` consistently with page metadata.
5. Remove nonexistent localized static paths.
6. Snapshot the route identities and compare against the 4,473-URL production baseline; require an explicitly reviewed allowlist for additions/removals.

Sitemap coverage: **FAIL**. Production cutover: **BLOCKED**.

## Sprint 11 Dynamic Sitemap Phase 1 override — 2026-08-24

The failures above are preserved as the **Before Sprint 11** baseline. They are superseded by the custom Phase 1 sitemap architecture described in [the Sprint 11 sitemap report](./sprint11-dynamic-sitemap-phase1-report.md).

| Child | API entities/routes | Localized `<loc>` records | Status |
|---|---:|---:|---|
| Pages | 23 | 149 | PASS |
| Posts/blogs | 111 | 777 | PASS |
| Events | 6 | 42 | PASS |
| Travel guide | 26 | 182 | PASS |
| Taxonomies | 62 | 434 | PASS |
| Tours | 484 | 3,388 | PASS |
| **Total** | **712** | **4,972** | **PASS** |

Locale counts are English 712 and 710 each for FR/DE/IT/PT/ES/ZH. Duplicate `<loc>` count and duplicate normalized URL count are both 0. Strict parsing passed for the index, all six children, and XSL. All 4,972 records carry `x-default`; no `/en` or backend-origin frontend document URL exists.

All confirmed paginator pages are enumerated with at most three transient retries. The normalized all-source catalog is cached atomically for 86,400 seconds. Runtime failure injection proved initial failure returns 500 rather than partial XML and expired-cache regeneration failure continues serving byte-identical last-known-good XML.

**After Sprint 11 sitemap coverage: PASS.** No Phase 1 blocker remains. Phase 2 webhook/on-demand revalidation is intentionally out of scope.
