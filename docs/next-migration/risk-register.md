# Risk Register

| Risk | Area | Severity | Evidence | Mitigation / owner |
|---|---|---:|---|---|
| Customer flows are route/UI clones but not fully validated | Auth/profile/cart/checkout | Critical | Next route files exist, but endpoint wiring is not fully implemented/validated. | Validate with staging backend before cutover; block production until passed. |
| Payment callbacks could mutate state if moved server-side in future | Payment | Critical | Current implementation is client-only, but callbacks call mutation-like endpoints. | Keep `PaymentCallbackStatus` client-only; add safety validation report; review future changes. |
| Checkout booking creation parity incomplete | Revenue | Critical | Nuxt uses `POST bookings` and `bookings/update/{id}`; Next checkout is currently cloned UI. | Implement/validate exact flow after backend contract confirmation. |
| Dynamic settings/menu/footer/currency may be static in Next | UI/API parity | High | Nuxt shared store fetches `settings`, `countries`, `currencies`; Next shell uses local config/static links. | Validate dashboard-driven requirements; wire API if required. |
| Sitemap is not fully API/database complete | SEO | High | Current sitemap pulls static paths, tours, blogs only. Spec requires categories, destinations, custom marketing pages. | Extend sitemap after endpoint map approval. |
| UI parity gaps from consolidated React components | UX | High | Next uses fewer generic components than Nuxt. | Screenshot compare priority routes and fix confirmed mismatches. |
| Tour detail booking/options/seasons may be incomplete | Revenue/UX | High | Nuxt fetches options/days/seasons and has complex right panel; Next includes differ. | Compare representative tour detail and validate booking panel. |
| Recaptcha/tracking parity incomplete | Forms/marketing | Medium | Nuxt forms use enterprise recaptcha; current `ContactForm` does not. | Confirm backend requirement and tracking scripts before cutover. |
| Locale SEO fallback behavior needs backend confirmation | SEO/i18n | Medium | Next sends `X-Localize`, but locale response content must be tested. | Raw HTML checks per locale on staging. |
| Image optimization/stable dimensions need audit | Performance | Medium | Next components use current image helpers/card styles; LCP not fully measured. | Lighthouse and screenshot audits for homepage/tour detail. |
| Third-party scripts may affect CWV or tracking | Performance/tracking | Medium | TrustIndex and other production scripts need parity. | Test official Lighthouse with third-party scripts enabled. |
| Homepage hydration error in production browser check | Rendering | Critical | Sprint 2 Playwright console reported React minified error #418 on `/`. | Debug hydration mismatch before cutover; do not suppress without root cause. |
| Custom marketing pages missing from sitemap discovery | SEO | High | `custom-pages?page_limit=2` returned 404; Nuxt confirms only `custom-pages/{slug}` detail usage. | Backend list endpoint or explicit business approval required. |

## Production Cutover Rule

Cutover remains blocked while any Critical risk is open.
