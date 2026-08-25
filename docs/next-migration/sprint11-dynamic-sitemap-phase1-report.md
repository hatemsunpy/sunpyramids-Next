# Sprint 11 dynamic sitemap Phase 1 report

Date: 2026-08-24

## Decision and architecture

Phase 1 uses custom Route Handlers instead of `MetadataRoute.Sitemap`. The required sitemap index, fixed public XML filenames, dynamic tour filenames, image and XHTML namespaces, XSL processing instruction, reciprocal locale documents, and byte-aware splitting require strict XML control that the metadata abstraction does not provide cleanly.

```text
Laravel dashboard
  -> Laravel API paginators
  -> bounded reliable enumeration
  -> atomic normalized catalog build
  -> Next Data Cache (86400 seconds)
  -> sitemap index and XML child handlers
```

The handlers are runtime-dynamic so an intermittently unavailable API cannot fail the application build. The normalized catalog—not the rich raw API payload—is cached atomically. This boundary matters because runtime testing found the raw payload was about 25 MB, beyond Next 16.2.9's 2 MB per Data Cache item limit; the normalized catalog fits and was proven reusable across child requests.

## API sources

| Sitemap data | Confirmed API enumeration |
|---|---|
| Pages | `pages?includes=seo` |
| Tours | `tours?includes=seo,categories,destinations` |
| Blogs | `blogs?includes=seo,categories` |
| Events | `categories?parent_id=55&includes=seo` |
| Travel guide | `blog-categories?includes=seo`, using real `parent_id` relationships |
| Tour taxonomies | `categories?includes=seo` |
| Egypt destinations | `destinations?parent.slug=egypt&order_by=display_order,asc&includes=seo` |

Every collection reads confirmed `data.data`, `current_page`, and `last_page` paginator fields. Page 1 determines the last page; all remaining pages are fetched, checked for stable pagination metadata, merged, and deduplicated. A malformed paginator or changed page range throws.

## Cache, retry, and failed revalidation

- Revalidation constant: `60 * 60 * 24` = **86400 seconds**.
- Every sitemap handler exports the statically analyzable literal `revalidate = 86400` required by Next 16.2.9.
- Response policy: `public, s-maxage=86400, stale-while-revalidate=86400`.
- The catalog uses one `unstable_cache` entry keyed by version and API origin.
- All seven required sources resolve through one `Promise.all`; any source failure prevents a new catalog from being returned or cached.
- No final enumeration uses `cache: "no-store"`.
- Safe GET retry limit is 3 attempts with a 20-second timeout and 250/500 ms bounded backoff. Timeout/network/429/500/502/503/504 are transient; confirmed 404, other request errors, and invalid JSON/pagination fail immediately.

Runtime cache proof:

1. Initial live generation returned 200 and populated the normalized catalog cache.
2. A second index request completed in 0.043 seconds; a child request completed in 0.022 seconds, proving reuse rather than re-enumeration.
3. An isolated test build shortened only the compiled test revalidation interval to 1 second; the source was restored immediately afterward.
4. The mock event source succeeded once, then returned 503. Three successive index responses remained HTTP 200, 574 bytes, and byte-identical while the mock recorded 7 event calls and Next logged the failed revalidation.
5. A separate first-generation failure test returned HTTP 500 with zero-byte XML output; it did not publish a successful empty/partial sitemap.

This verifies both atomic initial failure and last-known-good behavior on thrown revalidation in the installed Next 16.2.9 runtime.

## Public routes

- `/sitemap.xml`
- `/sitemap-pages.xml`
- `/sitemap-posts.xml`
- `/sitemap-events.xml`
- `/sitemap-travel-guide.xml`
- `/sitemap-taxonomies.xml`
- `/sitemap-tours-1.xml` through the dynamically determined final chunk
- `/sitemap.xsl`
- `/robots.txt` points to `https://sunpyramidstours.com/sitemap.xml`

The public `sitemap-tours-N.xml` filenames are rewritten internally to the dynamic chunk handler. Invalid/nonexistent chunk numbers return 404.

## Current live-API coverage

Counts below are document `<url>/<loc>` records. Locale-capable entities produce one reciprocal document per real locale; the two English-only plan/tailor pages produce English only. Image records are not counted as document URLs.

| Child sitemap | API entities/routes | Localized document URLs | Images |
|---|---:|---:|---:|
| Pages | 23 | 149 | 282 |
| Posts/blogs | 111 | 777 | 805 |
| Events | 6 | 42 | 112 |
| Travel guide | 26 | 182 | 161 |
| Taxonomies | 62 | 434 | 385 |
| Tours | 484 | 3,388 | 34,573 |
| **Total** | **712** | **4,972** | **36,318** |

| Locale | Document URLs |
|---|---:|
| English root | 712 |
| FR | 710 |
| DE | 710 |
| IT | 710 |
| PT | 710 |
| ES | 710 |
| ZH | 710 |
| **Total** | **4,972** |

Current tour chunk count: **1**. The chunk contains 3,388 localized URL records and is about 12.9 MB, below the configured 45,000-record and 45 MB safety limits. Chunking counts serialized locale documents and UTF-8 XML bytes, keeps each entity's locale cluster together, and determines `N` dynamically; it does not assume three files.

## XML and SEO validation

| Check | Result |
|---|---|
| Strict XML parsing of index, all six children, and XSL | PASS |
| Sitemap index children | 6 valid existing children |
| URL-set, image, and XHTML namespaces | PASS |
| Central escaping of `&`, `<`, `>`, `"`, and `'` | PASS |
| Duplicate `<loc>` values | 0 |
| Duplicate normalized URLs | 0 |
| Backend-domain frontend document URLs | 0 |
| `/en` document URLs | 0 |
| `x-default` | Present on all 4,972 document records and points to unprefixed English |
| Reciprocal locale alternates | PASS; full seven-locale clusters except two English-only capabilities |
| Events and nested travel guide | Included |
| Fully paginated tours/blogs | Included; 484 tours and 111 indexable blogs |
| Backend `updated_at` | Used when valid; otherwise omitted |
| Real entity media | Included at original API/R2/storage origins; no origin rewriting |
| Robots index target | PASS |
| XSL | HTTP 200 and valid XSL stylesheet |

## Legacy sitemap comparison

The live legacy baseline was fetched with safe GET requests and parsed strictly.

| Baseline | Pages | Posts | Tours | Events | Guide | Taxonomies | Total docs |
|---|---:|---:|---:|---:|---:|---:|---:|
| Legacy | 517 | 734 | 3,222 across 3 fixed files | folded/absent as separate child | folded/absent | folded into pages | 4,473 |
| Phase 1 | 149 | 777 | 3,388 in 1 dynamic file | 42 | 182 | 434 | 4,972 |

The apparent pages reduction is architectural: category, destination, event, and guide records are now assigned to dedicated child sitemaps instead of being folded into legacy pages/posts. Tour coverage increased from approximately 460 entities represented across seven locale documents to 484 current API entities across 3,388 locale documents. Total document coverage increased by 499; there is no unexplained major URL drop.

Both versions provide locale alternates, `x-default`, image namespaces, tour splitting, and XSL presentation. Phase 1 improves on the baseline with dynamic chunk count, current API pagination, explicit event/guide/taxonomy families, atomic failure handling, backend modification dates rather than regeneration dates, and capability-aware locales. Legacy image count was much larger because it repeated broad media inventories per locale record; Phase 1 deliberately emits only direct real entity media returned in supported API fields and does not scrape content HTML or add UI chrome.

## Outcome

Dynamic Sitemap Phase 1: **PASS**. Phase 2 webhook/tag revalidation is intentionally not implemented.

