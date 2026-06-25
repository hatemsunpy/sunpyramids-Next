# Sprint 17 Booking Evidence Cleanup, Dashboard Verification, and Next Approval Pack

Date: 2026-06-25

## Summary

Sprint 16 retry completed successfully using local untracked credentials from `.local-test-creds.json`: login, profile, and cart passed, one controlled test booking was created for `Test_tour` (`tour_id` 664), and the run stopped before payment. Sprint 17 confirms credential cleanup, records the booking evidence available in the workspace, queues the dashboard-verifier cleanup decision, and prepares the next approval pack for payment, coupon, rent-car, tracking, sitemap, and UI parity.

No new booking, payment, coupon, rent-car, or invoice mutation was run in Sprint 17. No payment callback was called with `invoice_id`. No credential value was printed, saved to docs, or committed. Production cutover remains blocked.

## A. Credentials Cleanup Confirmation

| Check | Result |
|---|---|
| `.local-test-creds.json` listed in `.gitignore` | Yes; line 12 of `.gitignore`. |
| `.local-test-creds.json` staged | No; `git status --porcelain` reports no entry for it. |
| `.local-test-creds.json` committed/tracked | No; `git ls-files --error-unmatch` reports it is not tracked; no commit history exists for it. |
| Credential values printed in docs/logs/commands | No. |
| Credential values saved in docs or committed files | No. |
| `.local-test-creds.json` deletion after validation | Pending owner action; recommended delete after the dashboard verifier confirms booking cleanup. |
| Account password rotation | Pending owner action; recommended rotate the test account password after validation. |

Credential handling rule applied: the credentials file is local and untracked only, ignored by git, and must be deleted by the owner once the booking evidence is reconciled. The test account password should be rotated by the owner after validation. No password value is recorded in this report.

## B. Booking Evidence Confirmation

Source: Sprint 16 retry summary (`docs/next-migration/sprint16-retry-validation-summary.md`) and owner-approved booking report.

| Field | Result |
|---|---|
| Booking created | Yes |
| Booking ID/reference | Unknown / not captured in the workspace evidence. |
| Test customer used | Yes; credentials not exposed. |
| Tour used | `Test_tour` / numeric `tour_id` 664 / code `Test` / title `Test Tour`. |
| Payment completed | No. |
| Payment URL/redirect returned | Unknown; not captured in the workspace evidence. |
| Stopped before payment | Yes. |
| Payment callback with `invoice_id` called | No. |
| Duplicate booking created | Unknown; not detectable from the workspace evidence. |

Booking ID/reference is missing from the local evidence. A new booking must not be created to recover it. The assigned dashboard verifier is asked to locate the booking by:

- test customer account,
- `Test_tour` / `tour_id` 664,
- Sprint 16 retry creation time (2026-06-25).

The located booking ID/reference and the duplicate check result should be recorded back into this report by the verifier or owner.

## C. Dashboard Verification

The dashboard verifier must confirm against the production-risk backend dashboard (`https://sunpyramidtours.com`):

| Check | Status |
|---|---|
| Booking exists in dashboard | Pending verifier. |
| Booking belongs to the test customer | Pending verifier. |
| Booking is for `Test_tour` / `tour_id` 664 | Pending verifier. |
| Payment status is unpaid/pending/not completed | Pending verifier. |
| No payment was captured | Pending verifier. |
| No duplicate booking was created | Pending verifier. |
| No unexpected order/payment record was created | Pending verifier. |
| Test booking cleanup decision | Pending verifier: cancel / delete / mark as test / leave as evidence. |

Verifier result: not yet available from this workspace. The verifier should not expose unrelated customer data and should record only the test booking decision and ID/reference.

## D. Cart State After Booking

| Check | Status |
|---|---|
| Cart state after booking creation | Not captured; unknown from the workspace evidence. |
| Cart cleared after booking | Unknown. |
| `Test_tour` still appears in cart | Unknown. |
| Cart behavior matches Nuxt/backend expectations | Pending confirmation. |
| Cleanup needed | Unknown; if cleanup is needed, ask the owner before removing anything. |

No new cart mutation was run in Sprint 17. Cart post-booking state should be confirmed by the verifier or owner via the dashboard/API read-only, not by a new mutation. If a cart row remains and the owner wants it removed, explicit approval is required before any `DELETE /api/cart/remove/664` or `POST /api/cart/clear`.

## E. Payment Safety Recheck

Payment was not completed. No callback was called with `invoice_id`. No payment, coupon, or rent-car mutation was run.

No-invoice callback safety was already validated in Sprint 16 route smoke and is not re-run as a mutation in Sprint 17:

| Route | Sprint 16 result |
|---|---|
| PayPal verify (no `invoice_id`) | 200; safe. |
| PayPal canceled (no `invoice_id`) | 200; safe. |
| Fawaterk success (no `invoice_id`) | 200; safe. |
| Fawaterk pending (no `invoice_id`) | 200; safe. |
| Fawaterk canceled (no `invoice_id`) | 200; safe. |

Expected and observed: no payment mutation request, no SSR mutation, no metadata/static/layout/prefetch mutation, safe UI response.

## F. Next Approval Pack

Checklist for the next validations. Each item remains blocked until the listed approval/data is provided.

### 1. Payment sandbox or explicit payment test approval

- [ ] PayPal sandbox invoice/order ID.
- [ ] Fawaterk sandbox invoice ID.
- [ ] Written approval for a controlled payment-provider handoff test.

### 2. Coupon validation

- [ ] Valid coupon code.
- [ ] Invalid coupon negative test (can use `INVALID-TEST-CODE`).

### 3. Rent-car validation

- [ ] Pickup location ID.
- [ ] Destination ID.
- [ ] Approved reversible cart/rental test.

### 4. Tracking validation

- [ ] GTM Preview access.
- [ ] GA4 DebugView access.
- [ ] Google Ads conversion test method.
- [ ] TikTok/Clarity approval.

### 5. Custom marketing sitemap

- [ ] Approve `GET /api/pages` as source of truth.
- [ ] Or provide backend list endpoint.
- [ ] Or provide approved manual slugs.
- [ ] Or approve temporary exclusion.

### 6. UI parity approval

- [ ] Owner name recorded.
- [ ] Pages to approve listed.
- [ ] Desktop/mobile approval method agreed.

## G. Validation Commands

| Check | Result |
|---|---|
| `npm run lint` | Passed (exit 0). |
| `npm run build` | Passed (exit 0); route manifest generated. |
| `git diff --check` | Passed (exit 0); only LF-to-CRLF working-copy warnings were emitted. |

Route smoke was not re-run in Sprint 17; no dependency was installed. Prior Sprint 16 route smoke remains the current evidence.

## Remaining Blockers

- Booking ID/reference not captured locally; awaiting dashboard verifier lookup.
- Dashboard verifier cleanup decision pending.
- Cart post-booking state pending read-only confirmation.
- Duplicate-booking check pending verifier.
- Credential file deletion and test account password rotation pending owner action.
- Payment sandbox/approval, coupon validation, rent-car validation, tracking validation, sitemap decision, UI parity approval, and final business approval remain blocked.

## Verdict

Production cutover remains blocked until payment, coupon, rent-car, tracking, sitemap, UI parity, and final business approvals are completed.