# Deployment Boundary: Nuxt Production vs Next.js Repo

Date: 2026-06-28

## Important Validation Rule

| URL | What it is | Valid for Next.js validation? |
|---|---|---|
| `https://sunpyramidstours.com` | Legacy Nuxt production build (still contains `__nuxt` in HTML). | **No.** This is the old production site, not the Next.js app. |
| `https://sunpyramids-next.vercel.app` | Next.js staging preview (Vercel deployment). | **Yes.** Use for staging checks. |
| `http://localhost:3003` | Current verified local Next.js production preview. | **Yes.** Use for local checks. |
| `http://localhost:3000` | Stale old Next.js dev process. | **No.** Do not use for evidence. |

## What This Means

1. **Production site is still Nuxt.** The public domain `https://sunpyramidstours.com` continues to serve the legacy Nuxt application. You can confirm this by inspecting the page HTML and finding `__nuxt` markers and `/_nuxt/` script sources.
2. **Next.js changes are repo/staging-preview only.** Any implementation changes in this repository will not appear on `https://sunpyramidstours.com` until the Next.js app is deployed to production and DNS/routing is cut over.
3. **Production cutover has not happened.** No DNS, proxy, or domain routing change has been made. The production cutover checklist remains open.
4. **Use the verified local preview on port 3003.** After the most recent build, the verified local production preview is running on `http://localhost:3003`. Use this for local validation.
5. **Port 3000 is stale and must be ignored.** An older Next.js dev process is still running on `http://localhost:3000` from a prior session. Do not use screenshots, network logs, or HTML from port 3000 as evidence for current changes.
6. **Do not use the live production URL to validate Next.js implementation changes.** Comparing `https://sunpyramidstours.com` against local Next.js work compares Nuxt to Next.js, which is useful for parity baselines, but it does **not** prove that Next.js changes are live. Use the staging preview or local port 3003 for that.

## Current Local Verified Preview

- Command used to verify recent tour page work: `npx next build` then `npx next start -p 3003`.
- Verified URL example: `http://localhost:3003/tour/from-cairo-6-days-package-to-el-fayoum-oasis-white-desert-and-bahariya-oasis`.
- Confirmed sections: gallery, tour info cards, overview, highlights, itinerary, included/excluded, add-ons, booking panel, season prices, social gallery, related tours.
- If port 3003 is occupied by the stale prior process, use the next free port (e.g., `3004`) and note it in the verification evidence. The one-day-tours category fix was verified on `http://localhost:3004/egypt-tours/one-day-tours/cairo` because 3003 was in use.

## Staging Preview

- URL: `https://sunpyramids-next.vercel.app`
- Use this for deployed validation once the branch is pushed/redeployed.
- Staging route smoke results are tracked in the sprint validation reports; always compare against the latest deploy.

## Validation Note for Recent Changes

The live production domain still serves the legacy Nuxt app. Next.js changes were validated against the local Next.js preview on port 3003 and/or the Next.js staging deployment (`https://sunpyramids-next.vercel.app`), not against the production Nuxt HTML.

This applies to the recent `/tour/[slug]` layout restoration, the `BlogCard` description removal, and the `/egypt-tours/one-day-tours/[destination]` category query fix: the production Nuxt site was only used as a visual/structural/contract parity baseline, while functional correctness and rendered output were confirmed on the local Next.js build (`localhost:3003`, or the next free port if 3003 is occupied) and/or the staging preview.

## Related Files

- `docs/next-migration/production-cutover-checklist.md` — overall cutover status.
- `docs/next-migration/ui-parity-report.md` — UI parity status, including the restored tour detail page.
- `docs/next-migration/staging-env-audit.md` — environment and deployment notes.
