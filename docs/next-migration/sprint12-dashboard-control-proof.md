# Sprint 12 — dashboard control proof

Date: 2026-08-24. Production remained read-only.

## Control chain

| Surface | Dashboard/backend write authority | API read authority | Next consumer | Proof | Status |
|---|---|---|---|---|---|
| Trip roots/children/counts | Category dashboard requests/models/relationships | `categories`, `categories/count` | `getTripTaxonomy` → Trips filter/results | Live labels, IDs/slugs, and counts rendered | PASS |
| Egypt destinations | Destination dashboard request/model | `destinations?...parent.slug=egypt` | `getTripTaxonomy` → Trips filter/results | Current localized titles/slugs rendered | PASS |
| Site title/logo | Settings form + enum-backed update | filtered `settings?option_key=...` | `SiteShell` → Header/Footer | Current values rendered; local fallback defined | PASS |
| Notification emails | Settings form array | filtered setting | Footer + Contact | Current API email list rendered | PASS |
| Social links | Settings form array | filtered setting | Footer | Current type/URL pairs rendered | PASS |
| Location URL | Settings form value | filtered setting | Footer + Contact address link | Current map URL rendered | PASS |
| Company team | Settings form name/position/image array | `settings?option_key=company_team` | About team cards | Current 11-member payload rendered | PASS |
| Currency | Currency dashboard request/model | `currencies` | Currency provider + rental append/booking | Selected backend currency ID submitted | PASS by source |
| Profile/session | Client/profile controllers | authenticated profile endpoints | Account flow | Exact request/response contracts wired | PASS by source |

The dashboard update controller clears the `settings_` cache prefix after a successful update, so subsequent filtered API reads can observe settings changes without a frontend deployment.

## Current setting-option truth

| Option key | Next consumption | Classification |
|---|---|---|
| `site_title` | Header/Footer display/alt/copyright | CONSUMED_PUBLIC |
| `logo` | Header/Footer image | CONSUMED_PUBLIC |
| `notification_emails` | Footer/Contact mail links | CONSUMED_PUBLIC |
| `social_links` | Footer social links | CONSUMED_PUBLIC |
| `company_location_url` | Footer/Contact location link | CONSUMED_PUBLIC |
| `company_team` | About team | CONSUMED_PUBLIC |
| `media_url` | Not directly consumed; media URLs arrive in resources | INFRASTRUCTURE_NOT_FRONTEND_CONTENT |
| `cdn_provider` | Not consumed | INFRASTRUCTURE_NOT_FRONTEND_CONTENT |
| `server_error_emails` | Not consumed | INTERNAL_ONLY |
| `github_repo` | Not consumed | DEPLOYMENT_INTERNAL |
| `github_token` | Never consumed | SECRET_MUST_NOT_BE_PUBLIC |
| `tiny_editor` | Not consumed | DASHBOARD_INTERNAL |
| `queue_monitor_ui` | Not consumed | DASHBOARD_INTERNAL |

No current setting option exists for public telephone numbers, physical address text, or WhatsApp number. Next therefore cannot honestly claim dashboard control for those fields.

## Propagation proof status

Read-only production proof confirms the current dashboard-produced values propagate through API to SSR. The requested mutation proof is **BLOCKED** because there is no approved staging dashboard/API/frontend target or reversible test record in the workspace. Required prerequisite:

1. Staging dashboard URL and authorized credentials.
2. Staging API base and Next staging URL using that API.
3. Approval to edit and revert one noncritical public setting or team record.

No production dashboard value was changed.
