# Hardcoded production content audit

Classification rules:

- `SAFE_STATIC_UI`: design copy, labels, layout, static certification/brand media, or other values that were not dashboard-driven in Nuxt.
- `SAFE_FALLBACK`: a non-authoritative resilience value that is clearly confined to an explicitly degraded state.
- `SUSPICIOUS`: may conceal live-data failure or depends on an environment-specific identifier; needs correction or explicit approval.
- `CONFIRMED_HARDCODED_DYNAMIC_CONTENT`: replaces data that Nuxt obtained from the API/dashboard.

| Location / value | Nuxt authority | Classification | Why it matters | Required action | Status |
|---|---|---|---|---|---|
| `TripsListingPage`: category names/IDs/counts | `GET categories/count` / `GET categories` | API_DRIVEN | Reliable server loader supplies roots, children, IDs, slugs, and counts. | Keep source/runtime regression coverage. | PASS |
| `TripsListingPage`: destination filters | `GET destinations` | API_DRIVEN | Localized titles and backend slugs now drive filter links. | Keep source/runtime regression coverage. | PASS |
| `Footer.tsx`: notification emails | Nuxt `GET settings` | API_DRIVEN_WITH_FALLBACK | Dashboard emails are primary; the previously confirmed production address is used only if the option is missing/unusable. | Add phone/address settings if full operational control is required. | PASS |
| `Footer.tsx`: phones/address/WhatsApp | No equivalent current setting key | SAFE_FALLBACK / UNCONTROLLED | These values cannot be dashboard-driven without a backend schema addition. | Owner decision: add settings keys or explicitly accept deployment-controlled contact data. | PARTIAL |
| Footer/contact social and location URLs | `GET settings` | API_DRIVEN | Exact filtered keys are rendered; unrelated/secret settings are not requested. | Keep filtered-key allowlist. | PASS |
| About team | `settings?option_key=company_team` | API_DRIVEN | Names, positions, and images come from the dashboard option. | Keep explicit unavailable state. | PASS |
| Rental append currency | selected currency / currencies API | API_DRIVEN | Payload now uses `selected.id`; stale EUR/EGP rate fallbacks were removed. | Keep USD-only degraded fallback explicit. | PASS |
| Home category IDs `59` and `53` | category relationships | SUSPICIOUS | IDs are environment-specific selection logic. | Add backend flags/keys or configuration; at minimum name constants and verify IDs per environment. | PARTIAL |
| Currency fallback | `GET currencies` | SAFE_FALLBACK | Only backend-default USD ID 1/rate 1 remains; no stale conversion rates are presented. | Treat non-USD currency availability as unavailable during API failure. | PASS |
| Generic page title/description defaults | SEO API | SAFE_FALLBACK | Can hide missing SEO data and create duplicate titles if used on indexable content. | Keep only for non-indexable error/degraded states; alert on missing production SEO. | PARTIAL |
| Empty arrays after home list API failure | live collections | SUSPICIOUS | Page can look legitimately empty during outage. | Preserve layout but surface observability and return appropriate cache/error behavior. | PARTIAL |
| Four marketing slugs | Page records keyed by live API | API_DRIVEN | Explicit route-to-Page-key mapping replaced the generic record. | Keep Sprint 11 mapping regression. | PASS |
| Home stats, booking steps, gallery layout, partner badges | Nuxt i18n/static component assets | SAFE_STATIC_UI | Not proven to be production records; values are presentational. | Keep static, but translate all localized route UI. | PARTIAL |
| Header/footer navigation structure | Nuxt component/i18n | SAFE_STATIC_UI | Route taxonomy is product navigation, not a content record. Labels now reuse confirmed Nuxt translations. | English per-key fallback only where the Nuxt dictionary has no value. | PASS |
| Payment redirect host allowlist | security policy | SAFE_STATIC_UI | Must be code/config controlled, not editable as content. | Keep explicit; manage environment hosts through reviewed configuration. | PASS |
| Payment status messages, form labels, empty-state copy | Nuxt i18n | SAFE_STATIC_UI | UI copy is valid static code but is currently English on localized routes. | Move to locale dictionaries. | PARTIAL |
| Brand logo, certification media, icons | repository assets | SAFE_STATIC_UI | Stable presentation assets. | No API migration required. | PASS |

No fake tour, blog, event, review, rating, or schema records were found in Next. The primary content integrity problem is substitution of generic/empty UI when the API response is missing, not fabricated entity objects.

Hardcoded production content status: **PARTIAL**. The confirmed dynamic substitutions are removed; phone/address/WhatsApp remain deployment-controlled because the current settings schema exposes no equivalent fields, and several static promotional/design strings remain classified rather than falsely claimed as dashboard-controlled.

## Sprint 13 static-content reconciliation — 2026-08-24

Previously broad “hardcoded” warnings are corrected: hardcoded is not a defect without dynamic ownership evidence. Valid intentional static values include the navigation route map, approved `/images/logo.png`, `+100K/+50/+60/5.0` counters, hero/section labels, the three How It Works steps, current campaign presentation copy, sustainability sentence, Need Help presentation, partner/certification imagery, phone/address/WhatsApp, and the sustainability mailbox.

Confirmed backend-controlled hardcodes remaining: **ZERO known entity substitutions**. Tour/blog/event/FAQ/category/destination/currency/team/SEO records and supported settings are API-driven. Static partner media URLs remain intentional asset references, not invented API records. Unknown ownership: **0** for the 20 audited homepage sections.
