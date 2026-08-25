# Sprint 13 backend read-only findings

Date: 2026-08-24

Laravel was treated as read-only. Findings below are documentation/ownership items, not changes. Secret values are intentionally omitted.

| Classification | Endpoint/source | Finding | Frontend consequence/mitigation | Cutover impact | Backend owner action |
|---|---|---|---|---|---|
| `BACKEND_SECURITY_RISK` + `BACKEND_CHANGE_REQUIRED` | `GET /api/settings` | Unfiltered public queries can expose operational/secret settings. | Next requests only explicit public keys and never serializes unused settings. This does not secure the endpoint itself. | **BLOCKER** until backend/security owner accepts or restricts exposure and rotates affected credentials. | Add a public allowlist/resource and rotate exposed credentials. |
| `BACKEND_SECURITY_RISK` + `BACKEND_CHANGE_REQUIRED` | `GET /api/bookings/{id}` | Controller `show` performs an unscoped `find($id)` inside auth middleware rather than constraining `client_id`. | Next does not call booking detail; profile uses scoped booking index. Frontend cannot fix authorization. | Security blocker if detail endpoint remains available to customers. | Scope by authenticated client/policy and add authorization tests. |
| `BACKEND_CHANGE_REQUIRED` | `ContactUsRequest`; `POST /api/contact-requests`; custom-trip request path | No Laravel reCAPTCHA token validation was found. | Next generates `recaptcha_token` at submit time when available. `FRONTEND_TOKEN_PRESENT`; `BACKEND_VERIFICATION_NOT_CONFIRMED`. | Bot-protection limitation; business/security decision required. | Verify token server-side with action/hostname/score policy and fail closed as approved. |
| `BACKEND_CHANGE_REQUIRED` (accepted parity) | guest cart model/service | Guest identity is `request()->ip()`. | `GUEST_CART_IP_IDENTITY = ACCEPTED_EXISTING_PARITY`; Next does not invent `guest_cart_token`. | Not a Sprint 13 frontend blocker unless business reverses acceptance. | Adopt a server-issued guest token in a future backend sprint if required. |
| `BACKEND_CHANGE_REQUIRED` | settings/contact contract | No proven backend fields own phone, physical address, or WhatsApp. The `logo` setting does not match the Nuxt/Live header logo. | Next centralizes proven frontend-owned contact values and approved static logo; supported settings stay filtered/dynamic. | Not a frontend blocker. | Add explicit public contact/brand fields only after ownership and dashboard requirements are approved. |
| `BACKEND_CHANGE_REQUIRED` | `GET payments/*/capture|cancel|update/invoice` | Payment-verification routes mutate state through GET. PayPal cancel also reads verification state before its missing-payment guard. | Next invokes these only in a client effect, requires `invoice_id`, never invokes during SSR/metadata/layout/static generation/prefetch, and shares in-flight requests. This cannot correct HTTP method or server authorization. | Sandbox validation remains blocked; server method/guard hardening recommended before final approval. | Move mutation to an authenticated/signed idempotent POST/webhook design and fix null/ownership guards. |
| `BACKEND_SECURITY_RISK` + `BACKEND_CHANGE_REQUIRED` | payment configuration/error responses | Payment credentials/configuration and verbose booking exception trace exposure were observed in source. | No credential is copied to Next; payment redirects are HTTPS host-allowlisted. | Backend/security release gate. | Move/rotate secrets, suppress traces in API responses, verify production payment configuration. |

## Read-only contract status

Public GET contracts for pages, tours, categories, destinations, blogs, events/categories, FAQs, currencies, locations, settings, and travel-guide content remain compatible with the Next loaders. The root backend redirect/login requirement was respected; no authentication bypass was attempted. No POST, PUT, PATCH, or DELETE request was sent to production.

## Backend integrity evidence

Pre-work source baseline over `app`, `routes`, `config`, `database`, and `resources`: 669 files; aggregate SHA-256 `6787EE8F21936E842D3A6BBF1634F199A532BC82D815C1871F5A3BF4EE5289C4`. The same scope is recomputed at final validation; any mismatch fails the Sprint 13 gate.

Final recomputation: 669 files; aggregate SHA-256 `6787EE8F21936E842D3A6BBF1634F199A532BC82D815C1871F5A3BF4EE5289C4`; baseline match **TRUE**. Backend files modified: **ZERO**.
