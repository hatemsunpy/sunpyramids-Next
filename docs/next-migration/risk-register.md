# Risk Register

| Risk | Area | Severity | Evidence | Mitigation / owner |
|---|---|---:|---|---|
| Customer flows are API-wired but not fully validated | Auth/profile/cart/checkout | Critical | Sprint 5 wires additional confirmed gaps, but no staging credentials/cart/payment data were available. | Validate with staging backend before cutover; block production until passed. |
| Payment callbacks could mutate state if moved server-side in future | Payment | Critical | Current implementation is client-only, but callbacks call mutation-like endpoints. | Keep `PaymentCallbackStatus` client-only; add safety validation report; review future changes. |
| Checkout/payment parity incomplete | Revenue | Critical | Sprint 5 wires `bookings/update/{id}`, but payment sandbox flow remains unvalidated. | Validate exact flow with staging cart, payment method, and sandbox invoice IDs. |
| Dynamic settings/menu/footer/currency may be static in Next | UI/API parity | High | Nuxt shared store fetches `settings`, `countries`, `currencies`; Next shell uses local config/static links. | Validate dashboard-driven requirements; wire API if required. |
| Sitemap is not fully API/database complete | SEO | High | Current sitemap pulls static paths, tours, blogs, categories, destinations, and blog categories. Custom marketing pages remain undiscoverable. | Backend list endpoint or explicit exclusion/manual list approval required. |
| UI parity gaps from consolidated React components | UX | High | Next uses fewer generic components than Nuxt. | Screenshot compare priority routes and fix confirmed mismatches. |
| Tour detail booking/options/seasons may be incomplete | Revenue/UX | High | Nuxt fetches options/days/seasons and has complex right panel; Next includes differ. | Compare representative tour detail and validate booking panel. |
| Recaptcha/tracking parity incomplete | Forms/marketing | Medium | Contact form now generates/submits `recaptcha_token` when Enterprise script is available; backend acceptance and conversion tracking are not validated. | Confirm backend requirement and tracking scripts before cutover. |
| Locale SEO fallback behavior needs backend confirmation | SEO/i18n | Medium | Next sends `X-Localize`, but locale response content must be tested. | Raw HTML checks per locale on staging. |
| Image optimization/stable dimensions need audit | Performance | Medium | Sprint 4 fixed tour fallback hero loading a raw 2 MB CSS background; other pages still need image audits. | Continue Lighthouse and screenshot audits for priority pages. |
| Third-party scripts affect CWV | Performance/tracking | High | Sprint 4 normal Lighthouse remained low while `?no-third-party=1` scored home 100 and tour 94; GTM loads TikTok/Clarity and TrustIndex adds work. | Optimize/approve tag behavior with marketing before cutover. |
| Homepage hydration error regression risk | Rendering | Medium | Sprint 3 fixed the confirmed BlogCard HTML mismatch and browser validation showed no React #418. | Keep console check in pre-cutover validation. |
| Custom marketing pages missing from sitemap discovery | SEO | High | `custom-pages?page_limit=2` returned 404; Nuxt confirms only `custom-pages/{slug}` detail usage. | Backend list endpoint or explicit business approval required. |

## Sprint 5 Risk Notes

- Cart remove/coupon/edit, rent-car append, make-your-trip, and checkout payment update are code-wired but must be treated as unvalidated until staging data is available.
- Third-party normal-mode performance requires marketing/tag owner approval; engineering should not remove GTM/GA/TikTok/Clarity/TrustIndex unilaterally.
- reCAPTCHA acceptance is blocked until staging backend verification confirms the current submit-time token is accepted.

## Sprint 6 Risk Notes

- Staging validation remains the top cutover blocker because no staging frontend URL, staging backend/API URL, test customer, coupon data, cart item data, checkout billing data, payment configuration, or sandbox invoice IDs were provided.
- Auth/profile/cart/checkout/payment cannot be marked passed without real staging/backend evidence.
- Custom marketing sitemap remains a high SEO risk until the backend provides a list endpoint, another confirmed API exposes slugs, business/SEO approves manual slugs, or business/SEO explicitly excludes those pages for cutover.
- Conversion tracking remains a business risk because no GTM Preview, GA4 DebugView, Google Ads test method, or TikTok/Clarity owner approval was available.
- Third-party normal-mode performance remains an approval risk; accepted performance cost must be marked yes/no by marketing/tag owners.

## Production Cutover Rule

Cutover remains blocked while any Critical risk is open.
