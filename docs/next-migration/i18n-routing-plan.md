# i18n Routing Plan

## Supported Locales

| Language | Public route behavior | Next representation |
|---|---|---|
| English | Root, no `/en` | `app/page.tsx` and unprefixed routes |
| French | `/fr` | `app/[locale]/*` |
| German | `/de` | `app/[locale]/*` |
| Italian | `/it` | `app/[locale]/*` |
| Portuguese | `/pt` | `app/[locale]/*` |
| Spanish | `/es` | `app/[locale]/*` |
| Chinese | `/zh` | `app/[locale]/*` |

Arabic is not supported in this migration unless separately approved and fully supported by backend/dashboard/frontend.

## Current Next Implementation

- `types/api.ts` defines `Locale = "en" | "fr" | "de" | "it" | "pt" | "es" | "zh"`.
- `lib/locales.ts` defines supported locales and excludes `/en` from prefixed routes.
- Public localized routes live under `app/[locale]`.
- English routes remain unprefixed.
- `metadataFromPage()` emits `x-default` pointing to English/root equivalent and language alternates for supported locales.
- API requests pass `X-Localize` for the selected locale.

## Route Coverage Notes

- Main public SEO routes have localized equivalents where the current Next app has `[locale]` pages.
- Nuxt-only customer routes such as auth/cart/profile/payment currently exist as unlocalized routes. Treat localization of these private/semi-private flows as a business decision unless Nuxt production proves localized equivalents are indexed or required.
- No `/en` route should be added without explicit approval.
- No trailing-slash locale redirect should be added without explicit approval.

## Remaining Validation

- Verify language switcher preserves equivalent route where possible.
- Verify localized route raw HTML includes correct canonical/hreflang.
- Verify backend returns translated dashboard SEO/content for each supported `X-Localize` value.
- Verify no raw translation keys render in the UI.
