# Nuxt-Derived Values Applied

Date: 2026-06-23

Sprint 8 reviewed public configuration and technical references discovered in `nuxt_sunpyramids/` and compared them with the current Next.js project. No private values were found or added. No production code changes were required because the safe public values were already present in the Next.js implementation.

## Applied Values Review

| Value | Nuxt source | Current Next location | Already present in Next | Applied in this pass | File changed | Why safe |
|---|---|---|---|---|---|---|
| Public frontend URL `https://sunpyramidstours.com` | `nuxt_sunpyramids/public/sitemap.xml`, `robots.txt`, `Llms.txt` | `lib/seo.ts`, `app/layout.tsx`, `app/sitemap.ts` | Yes | No | N/A | Public production frontend domain; used only for public SEO/origin behavior. |
| Backend/API fallback `https://sunpyramidtours.com/api/` | `nuxt_sunpyramids/nuxt.config.ts`, `composables/useApi.js` | `lib/config.ts` | Yes | No | N/A | Public backend/API origin; preserves the required backend-domain separation. |
| reCAPTCHA Enterprise site key `6LeaVMEqAAAAANXKFLnQvxeAoWvTeEOUlatRYIFn` | `nuxt_sunpyramids/nuxt.config.ts`, `composables/recapcha.js` | `lib/recaptcha.ts` | Yes | No | N/A | Public site key only; no secret key added. Script remains submit-time and diagnostic-suppressed. |
| reCAPTCHA action `submit` | `nuxt_sunpyramids/composables/recapcha.js` | `lib/recaptcha.ts`, submit callers | Yes | No | N/A | Public client action name; backend acceptance remains blocked until staging confirms it. |
| reCAPTCHA payload field `recaptcha_token` | Nuxt form components | `components/ContactForm.tsx`, `components/CustomerFlows.tsx` | Yes | No | N/A | Public request field name; does not fake or bypass backend validation. |
| GTM container `GTM-KDF33T7` | `nuxt_sunpyramids/app.vue` | `components/ThirdPartyScripts.tsx`, `app/layout.tsx` noscript | Yes | No | N/A | Public container ID; no new events or conversion logic added. |
| GA4 measurement ID `G-NKZ6W32C4J` | `nuxt_sunpyramids/app.vue` | `components/ThirdPartyScripts.tsx` | Yes | No | N/A | Public measurement ID; no new conversion events added. |
| Representative public tour slugs | `nuxt_sunpyramids/public/sitemap.xml`, `Llms.txt` | Migration docs and local validation references | Yes, in docs | No | N/A | Public URLs only; not treated as numeric tour IDs. |
| Rent-car endpoints and payload shape | Nuxt rent-car components | `components/CustomerFlows.tsx`, docs | Yes | No | N/A | Public endpoint/payload references; real staging IDs still blocked. |
| Checkout and payment payload shapes | Nuxt checkout/payment components | `components/CustomerFlows.tsx`, docs | Yes | No | N/A | Endpoint and field parity only; no private payment data or sandbox invoices added. |
| Payment callback endpoints | Nuxt callback pages | `components/PaymentCallbackStatus.tsx` | Yes | No | N/A | Public endpoint paths; guarded by browser `invoice_id` and client-side execution only. |

## Values Intentionally Not Applied

| Value | Reason not applied |
|---|---|
| `https://new-sunpyramids-demo.vercel.app` | Only a Nuxt `APP_URL` fallback. It needs owner confirmation before being treated as official staging. |
| Test customer credentials | No credentials found. Must be provided through secure owner handoff. |
| Admin/dashboard credentials or private dashboard URL | No safe value found. Must be provided by dashboard/content owner if required. |
| Numeric tour ID | Public slugs are not numeric product/cart IDs. Numeric IDs must come from staging API responses. |
| Rental pickup/destination IDs | Endpoint shape is known, but real IDs must come from staging data. |
| Valid coupon code | No public test coupon found. Do not invent one. |
| PayPal/Fawaterk sandbox invoice IDs | No sandbox IDs found. Do not invent invoice IDs. |
| Backend reCAPTCHA acceptance settings | Not present in Nuxt public code. Backend owner must confirm valid/missing/invalid behavior. |
| Google Ads conversion IDs or labels | No `AW-` ID or conversion label found in safe Nuxt source. Could be in GTM; needs tag-owner access. |
| TikTok/Clarity approval or debug access | Direct source snippets were not found in Nuxt; prior evidence indicates GTM-controlled cost. Owner approval remains required. |
| Custom marketing sitemap slugs | Public static sitemap paths are evidence, not an approved source-of-truth. Do not hardcode without backend endpoint, approved manual list, or explicit exclusion. |

## Verification Notes

- Public SEO URLs still use `https://sunpyramidstours.com`.
- Backend/API calls still use `https://sunpyramidtours.com` / `https://sunpyramidtours.com/api/` where intended.
- Diagnostic `?no-third-party=1` mode still suppresses client GTM/GA, TrustIndex, and reCAPTCHA script injection.
- reCAPTCHA remains submit-time only through `generateRecaptchaToken()`; there is no global page-load reCAPTCHA script in the Next layout.
- Payment mutation-like callbacks remain client-only and guarded by browser `invoice_id`.
- No secrets were added in this pass.

## Still Requiring Owner Confirmation

- Confirmed staging frontend URL
- Confirmed staging backend/API URL if different from the public fallback
- Test customer account and password
- Admin/dashboard access if dashboard validation is required
- Valid coupon
- Real tour numeric ID and rental pickup/destination IDs
- PayPal and Fawaterk sandbox invoice IDs
- Backend reCAPTCHA settings
- GTM Preview, GA4 DebugView, and Google Ads test method
- TikTok/Clarity approval or debug access
- Custom marketing sitemap decision
- UI parity approval owner
