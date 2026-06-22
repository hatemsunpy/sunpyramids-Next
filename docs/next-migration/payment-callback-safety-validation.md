# Payment Callback Safety Validation

## Safety Requirement

Payment callback pages are UI-safe / SSR-safe clones. They must not trigger payment mutation APIs during SSR, metadata generation, static generation, layout rendering, or route prefetch.

## Current Implementation

- Component: `components/PaymentCallbackStatus.tsx`
- It is marked `"use client"`.
- It reads `invoice_id` from `useSearchParams()`.
- It calls the backend only inside `useEffect()`, after hydration.
- If `invoice_id` is missing, it does not call the backend.
- Server-rendered route shell comes from `components/ClonedNuxtPages.tsx`.

## Route Matrix

| Route | Callback key | Endpoint | Client-side only | Requires `invoice_id` | Can run during SSR | Prefetch mutation risk | Status |
|---|---|---|---|---|---|---|---|
| `/order/payment/callback/paypal/verify` | `paypal-verify` | `payments/paypal/capture` | Yes | Yes | No | No, call is in hydrated client effect | Code pass; backend validation pending. |
| `/order/payment/callback/paypal/canceled` | `paypal-canceled` | `payments/paypal/cancel` | Yes | Yes | No | No, call is in hydrated client effect | Code pass; backend validation pending. |
| `/order/payment/callback/fawaterk/success` | `fawaterk-success` | `payments/fawaterk/update/invoice` | Yes | Yes | No | No, call is in hydrated client effect | Code pass; backend validation pending. |
| `/order/payment/callback/fawaterk/pending` | `fawaterk-pending` | `payments/fawaterk/update/invoice` | Yes | Yes | No | No, call is in hydrated client effect | Code pass; backend validation pending. |
| `/order/payment/callback/fawaterk/canceled` | `fawaterk-canceled` | `payments/fawaterk/update/invoice` | Yes | Yes | No | No, call is in hydrated client effect | Code pass; backend validation pending. |

## Validation Performed

- Static code inspection confirms no payment endpoint is called by `generateMetadata()`.
- Static code inspection confirms no payment endpoint is called by app layouts.
- Static code inspection confirms payment API calls are not in Server Components.
- Browser validation on `http://localhost:3000/order/payment/callback/paypal/verify` without `invoice_id` showed no `payments/paypal/*` or `payments/fawaterk/*` network request.
- Browser network log showed normal Next route prefetch requests for page links and analytics/tracking requests, but no payment mutation API.
- Browser console on the no-invoice payment route had no errors; only headless localhost third-party warnings from Hotjar/Plausible.
- Runtime backend validation with real/sandbox invoice IDs is still required.

## Sprint 3 Revalidation

Date: 2026-06-22

Target: local production build at `http://localhost:3000`.

Result: passed for no-invoice safety. A real Chrome browser loaded `/order/payment/callback/paypal/verify` without `invoice_id`; the network log contained no `payments/paypal/*` or `payments/fawaterk/*` request, and the console had no errors.

Sandbox invoice validation was not performed because no approved staging/sandbox invoice IDs were available.

## Sprint 4 Revalidation

Date: 2026-06-22

Target: local production build at `http://localhost:3000`.

Result: passed for no-invoice safety. A fresh Chrome browser context loaded `/order/payment/callback/paypal/verify?no-third-party=1`; no `payments/paypal/*` or `payments/fawaterk/*` request was made and there were no console errors.

Static code status remains unchanged: payment endpoints are only referenced by the client-only `PaymentCallbackStatus` component and are not called from layouts, metadata generation, static generation, or Server Components.

## Cutover Status

Code-level SSR safety: passed.

Payment/business validation: pending. Production cutover remains blocked until sandbox/real payment callback behavior is validated with approved invoice IDs.
