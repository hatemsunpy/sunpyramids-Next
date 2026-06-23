# Third-Party Performance Approval Report

Date: 2026-06-22

Normal-mode performance is not approved for production cutover. Diagnostic `?no-third-party=1` runs show the first-party app performs well, so the remaining decision is a marketing/tag-owner approval or optimization decision.

| Third party | Source | Loaded by | Routes | Trigger timing | Performance cost | Business purpose | Can defer/scope/gate? | Approval needed | Recommendation |
|---|---|---|---|---|---|---|---|---|---|
| GTM `GTM-KDF33T7` | Google Tag Manager | `components/ThirdPartyScripts.tsx` | All normal routes | Client effect after hydration | High; loads extra tags including TikTok/Clarity | Marketing/conversion container | Can defer until idle or consent-gate with approval | Marketing | Keep unless marketing approves deferral/scope changes. |
| GA4 `G-NKZ6W32C4J` | Google Analytics | `components/ThirdPartyScripts.tsx` | All normal routes | Client effect after hydration | Medium | Analytics | Can defer until idle or consent-gate with approval | Marketing/analytics | Keep; consider idle deferral. |
| TikTok | GTM/container | GTM in normal mode | Marketing tags | GTM-controlled | High contributor in Sprint 4 normal Lighthouse | Paid/social tracking | Can route-scope or consent-gate through GTM | Marketing | Route-scope or defer only with approval. |
| Clarity | GTM/container | GTM in normal mode | Analytics/session recording | GTM-controlled | High contributor in Sprint 4 normal Lighthouse | Session analytics | Can sample, route-scope, or consent-gate | Marketing/product | Optimize in GTM; do not remove unilaterally. |
| TrustIndex | TrustIndex widget script | `components/TrustIndexLoader.tsx` | Widget surfaces | Client effect when widget container exists | Medium | Reviews/social proof | Can route-scope or idle-load | Marketing/product | Keep on review-critical surfaces; consider idle loading. |
| reCAPTCHA Enterprise | Google reCAPTCHA | `lib/recaptcha.ts` | Submit forms only | Submit-time script injection | Low page-load cost after Sprint 4 | Spam protection | Already route/action scoped | Engineering/backend | Keep submit-time; validate backend acceptance. |

Current controls:

- `?no-third-party=1` suppresses GTM/GA, TrustIndex, reCAPTCHA, TikTok, and Clarity for diagnostics.
- reCAPTCHA is submit-time only and no longer globally loaded from layout.
- Payment callbacks do not trigger payment APIs server-side.

Approval options:

1. Keep as-is and accept normal-mode Core Web Vitals cost.
2. Defer GTM/GA until idle.
3. Consent-gate non-essential analytics/marketing tags.
4. Route-scope TikTok/Clarity/TrustIndex to pages where they are required.
5. Remove tags only with marketing approval.

Cutover remains blocked pending marketing/tag-owner approval.

## Sprint 5 Lighthouse Result

Target: local production build at `http://127.0.0.1:3000`.

| Page/mode | Score | LCP | CLS | TBT | Status |
|---|---:|---|---|---|---|
| Home normal | 71 | 3.2s | 0.029 | 970ms | Not approved; normal mode still has high blocking time. |
| Home diagnostic | 88 | 3.7s | 0.029 | 50ms | First-party blocking time is low; LCP needs continued audit. |
| Tour normal | 70 | 2.7s | 0.002 | 920ms | Not approved; normal mode still has high blocking time. |
| Tour diagnostic | 92 | 2.7s | 0.002 | 0ms | First-party route performs well. |

Lighthouse reports were generated successfully, but Lighthouse emitted Windows temp-profile cleanup `EPERM` warnings after report generation.

## Sprint 6 Approval Status

Date: 2026-06-23

No marketing/tag-owner approval, GTM Preview access, GA4 DebugView access, Google Ads conversion test method, or TikTok/Clarity owner contact was provided. Normal-mode third-party performance therefore remains blocked for business approval.

| Third party | Sprint 6 recommendation | Approval needed | Accepted performance cost |
|---|---|---|---|
| GTM | Keep as-is until owner approves idle deferral, consent gate, or route scope. | Marketing/tag owner | Not approved. |
| GA4 | Keep as-is until analytics owner approves idle deferral or consent gate. | Marketing/analytics | Not approved. |
| TikTok | Route-scope, defer, consent-gate, or remove only inside GTM with marketing approval. | Paid/social owner | Not approved. |
| Clarity | Sample, route-scope, defer, or consent-gate only with owner approval. | Product/analytics owner | Not approved. |
| TrustIndex | Keep on review-critical surfaces; consider idle loading after approval. | Marketing/product | Not approved. |
| reCAPTCHA Enterprise | Keep submit-time loading; validate backend acceptance before cutover. | Engineering/backend | Not applicable to normal page-load cost after submit-time change. |

Cutover remains blocked until the owner decision is recorded as either accepted performance cost or approved optimization.

### Sprint 6 Lighthouse Result

Target: local production build at `http://127.0.0.1:3106`.

| Page/mode | Score | LCP | CLS | TBT | Status |
|---|---:|---|---|---|---|
| Home normal | 44 | 9.3s | 0.029 | 1,400ms | Not approved; normal mode remains high-cost. |
| Home diagnostic | 89 | 3.7s | 0.029 | 50ms | First-party blocking time remains low. |
| Tour normal | 66 | 2.9s | 0.002 | 1,090ms | Not approved; normal mode remains high-cost. |
| Tour diagnostic | 90 | 2.8s | 0.002 | 80ms | First-party route remains comparatively healthy. |

Lighthouse emitted Windows temp-profile cleanup `EPERM` warnings after writing JSON reports.
