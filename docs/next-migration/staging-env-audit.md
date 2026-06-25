# Staging Environment Audit

Date: 2026-06-25

Scope: Sprint 11 staging 500 triage. No secrets were printed or saved. No local `.env*` files were present in the workspace.

| Variable / setting | Required for | Public/private | Current local value | Expected Vercel value | Missing/unknown | Route impact | Owner required |
|---|---|---|---|---|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Public frontend URL, metadata base, canonical/hreflang/sitemap/robots frontend URLs | Public | Fallback: `https://sunpyramidstours.com` | `https://sunpyramidstours.com` for production SEO output | Unknown in Vercel | Wrong value can leak staging/backend URLs into SEO output. | Hosting/SEO owner confirm. |
| `NEXT_PUBLIC_API_URL` | Server/client API base URL and sitemap API fetches | Public | Fallback: `https://sunpyramidtours.com/api/` | `https://sunpyramidtours.com/api/` unless a true staging API is provided | Unknown in Vercel | Wrong value can break all API-driven SSR routes. Current staging can reach some API data, so this is not the only 500 cause. | Hosting/backend owner confirm. |
| reCAPTCHA Enterprise site key | Submit-time contact/custom-trip token generation | Public | Hardcoded public key in `lib/recaptcha.ts` | Same public key or approved staging key | Backend acceptance unknown | Should not affect SSR/page load; token generation is submit-time only and disabled by `?no-third-party=1`. | Backend/security owner confirm. |
| GTM ID | Client marketing container and noscript iframe | Public | `GTM-KDF33T7` in code | Same ID unless marketing approves otherwise | Debug access missing | Should not cause SSR 500; loaded client-side/noscript only. | Marketing/tag owner. |
| GA4 ID | Client analytics | Public | `G-NKZ6W32C4J` in code | Same ID unless analytics approves otherwise | Debug access missing | Should not cause SSR 500; loaded client-side only. | Analytics owner. |
| `?no-third-party=1` | Diagnostic suppression of client third-party scripts | Public URL flag | Implemented in client loaders | No env value required | N/A | Suppresses client GTM/GA, TrustIndex, and reCAPTCHA loaders; does not change SSR data fetching. | None. |
| Image remote patterns | Next image optimization allowlist | Public config | `sunpyramidtours.com`, `sunpyramidstours.com`, `new-sunpyramids-demo.vercel.app`, R2 host | Same domains deployed with current build | Unknown deployed build version | Missing media host can break optimized images at render/runtime. Current failing routes are shared with SSR sanitizer/API include issues. | Hosting/content owner if media hosts change. |
| Payment callback URLs | Client callback pages and backend-generated redirects | Public/private mix | Frontend uses client callback routes; backend `site_url()` risk documented separately | Backend deployment must set `APP_FRONT_URL` correctly | Unknown | No-invoice callback routes are safe; real invoice callbacks remain blocked. | Backend/payment owner. |
| Test account password env | Optional local secure auth validation only | Private | Not found in checked env names | Do not set in Vercel for docs validation; provide only runtime/manual if needed | Missing | Valid login/profile validation blocked. | Owner/QA provide securely. |

## Sprint 11 Environment Verdict

No confirmed missing Vercel environment variable was proven as the staging 500 root cause. The stronger evidence is:

- Backend `tours/Test_tour?includes=seo,gallery` returns 500, while `includes=seo` returns 200.
- Generic content and tour routes share server-rendered sanitized HTML.
- Current local production build passes all affected routes after the Sprint 11 code changes.

Staging requires redeploy with the current build and post-deploy route verification.

## Sprint 12 Environment Follow-Up

Sprint 12 could not confirm Vercel deployment metadata or environment variables from this workspace. No `.vercel/project.json` file is present. Expected public values remain:

- `NEXT_PUBLIC_APP_URL=https://sunpyramidstours.com`
- `NEXT_PUBLIC_API_URL=https://sunpyramidtours.com/api/`

The deployed staging target routes still return `/500`, so redeploy/env verification remains required.

## Sprint 14 Environment Follow-Up

The previous staging `/500` target routes now return 200 after redeploy. Vercel environment values are still not directly inspectable from this workspace, but route behavior confirms the deployed frontend can reach required public page/tour data for the checked routes.
