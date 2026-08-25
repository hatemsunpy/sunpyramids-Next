# Sprint 12 — dynamic backend control completion report

Date: 2026-08-24 (Africa/Cairo)

## Executive result

Sprint 12 implemented the remaining confirmed P1 Nuxt/Laravel contracts without changing Laravel or mutating production. The optimized Next build passes. Read-only runtime proves live taxonomy/count/destination filters, public settings, the About team, locale headers/UI labels, SEO, and the split sitemap.

The release state remains **BLOCKED**, not because these P1 implementations failed, but because no approved staging dashboard was available for the required edit/observe/revert propagation test and because the public unfiltered settings API exposes operational/secret options that must be restricted and rotated by the backend owner.

## P1 disposition

| P1 | Outcome | Evidence / decision |
|---:|---|---|
| 1 | Implemented | `/trips` consumes reliable `categories`, `categories/count`, and Egypt destinations; root, child, count, and result queries use backend IDs/slugs. |
| 2 | Implemented + audited | Next requests only six public presentation option keys; all current options are classified in the dashboard proof report. |
| 3 | Implemented where backend data exists | Site title, logo, notification emails, social URLs, and location URL are settings-driven. Phone/address/WhatsApp have no current setting key and remain explicit fallbacks. |
| 4 | Implemented | About team names, positions, and images use `company_team`; missing/unusable payload renders an unavailable state. |
| 5 | Implemented for active Nuxt contracts | Selected live currency ID, available destinations, route lookup, and rental cart append are wired. Direct inventory/checkout were not active Nuxt UI contracts. |
| 6 | Implemented | `profile/me`, server logout, multipart profile image, post-update refresh, and 401 local-session clearing. |
| 7 | Omitted by condition | Current Nuxt has booking list only; no dedicated booking-detail UI was found. |
| 8 | Omitted by condition | Current Nuxt displays reviews but contains no `POST tour-reviews` submission call/UI. |
| 9 | Omitted by condition | Current Nuxt contains no visible/direct `blogs/search/{search}` call. |
| 10 | Implemented | Supported reset endpoint is used in both modes; social-login callback routes now complete session creation; authenticated profile state refreshes from `profile/me`. |
| 11 | Completed for confirmed dynamic substitutions | Taxonomy, settings, team, marketing mappings, and rental currency defects are removed. Remaining high-impact literals are classified. |
| 12 | Implemented | API lists do not receive invented entities; missing taxonomy/team renders an explicit state; settings use confirmed fallback only when missing/unusable. |
| 13 | Implemented for shared targeted surfaces | Header/footer/mobile nav, auth, profile, and rental/planner labels reuse confirmed Nuxt dictionaries across seven locales with per-key English fallback only for missing Nuxt keys. |
| 14 | Passed | Valid home/about/blog/tour runtime retained title, canonical, alternates, and JSON-LD when supplied by the backend. |
| 15 | Passed | Index + six child sitemaps: 4,972 URLs, zero duplicate locations, 86,400-second cache policy. |
| 16 | Created | See `sprint12-dashboard-control-proof.md`. |
| 17 | Updated | 61 current Laravel API routes classified: 45 MATCHED, 2 BLOCKED, 14 BACKEND_ONLY; two stale absent contracts are separately DEPRECATED. |
| 18 | Passed within safe scope | Production build and read-only local/live GET checks passed; no production booking/contact/review/profile/image/rental/cart/payment/coupon/custom-trip mutation was sent. |
| 19 | Passed | New settings/taxonomy/team GET loaders use `apiFetchReliable` retry/error classification. |
| 20 | Blocked correctly | No staging dashboard URL/credentials were available; production was not edited. Missing prerequisite: approved staging dashboard + API/frontend target and reversible test record. |

## Runtime evidence

- `npm run lint`: pass.
- `npm run build`: pass on Next 16.2.9; 40 static generation tasks and all expected dynamic routes compiled.
- `/trips`: HTTP 200; live `Day Tour`, count `308`, and `Cairo Tours` rendered.
- `/trips?main=day-tour`: HTTP 200 with backend-derived filtered request.
- `/de/trips`: HTTP 200; confirmed German shared UI plus localized API content rendered.
- `/about-us`: HTTP 200; current `company_team` names/positions rendered.
- `/contact-us`: HTTP 200; current dashboard notification email and location URL rendered.
- `/social-login`: HTTP 200 callback shell; no session payload was injected during audit.
- Valid home/about/blog/tour: HTTP 200 with canonical and locale alternates; JSON-LD appears when the API record supplies schema.
- Every sitemap endpoint: HTTP 200 and `public, s-maxage=86400, stale-while-revalidate=86400`.

## Remaining release blockers

1. Restrict the public unfiltered `GET settings` response to a public allowlist and rotate exposed credentials. Next already avoids the unfiltered call.
2. Run the staging-only dashboard edit/observe/revert proof for at least one representative public setting or team member.
3. Owner decision: add dashboard setting keys for public phones, physical address, and WhatsApp, or accept them as deployment-controlled fallbacks.
4. Preserve the existing release blockers recorded in the risk register, including guest-cart IP identity and any outstanding staging payment/checkout validation.

Final Sprint 12 state: **route PARTIAL; dynamic PARTIAL; dashboard PARTIAL; locale PARTIAL; SEO PARTIAL; sitemap PASS; production BLOCKED**.
