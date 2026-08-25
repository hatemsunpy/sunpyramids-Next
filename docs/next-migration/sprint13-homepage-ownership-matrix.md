# Sprint 13 homepage ownership matrix

Date: 2026-08-24

The audit follows the required source order: Laravel/API where Nuxt proves dynamic ownership, then Nuxt, current Live, and Next. “API-DRIVEN (mixed)” means the data/entities are dynamic while labels or presentation remain intentional static UI copy. Every top-level section is deliberately classified as either **STATIC** or **API-DRIVEN**; there is no unknown ownership.

| Section | Live Content | Nuxt Source | API Endpoint | Ownership | Next Source | Parity | Action |
|---|---|---|---|---|---|---|---|
| 1. Header/navigation | Fixed route labels and approved logo | `components/Header/*`; static routes and `/images/logo.png` | None for navigation | **STATIC** — `STATIC_UI_COPY` + `INTENTIONAL_STATIC_CONTENT` | `Header.tsx`; `APPROVED_BRAND_LOGO` | PASS | Kept static/i18n; did not invent CMS navigation. |
| 2. Main hero/banner | Rotating home gallery | `Home/MainBanner/index.vue` | `GET pages/home?includes=seo` | **API-DRIVEN** — `API_DASHBOARD_CONTROLLED` | `getHome` → `HomePage` → `HomeHeroMedia` | PASS | Render all API gallery images with reduced-motion-safe rotation. |
| 3. Hero promotional copy | “Get started your / Exciting Journey With Us” | Nuxt locale dictionaries | None | **STATIC** — `STATIC_UI_COPY` | `home-copy.ts` → `HomePage` | PASS | Preserved confirmed locale copy. |
| 4. Statistics/counters | `+100K`, `+50`, `+60`, `5.0` and labels | Static arrays + locale dictionaries | None | **STATIC** — `INTENTIONAL_STATIC_CONTENT` | `HomePage` + `home-copy.ts` | PASS | Preserved; not converted to an API dependency. |
| 5. Make/Find/Rent actions | Three actions, translated forms, rental discovery | home action components | `GET locations`; interaction-only rental destination/route lookup | **API-DRIVEN (mixed)** | `HomeSearchShortcuts` | PASS | Labels remain static; entity options remain API-owned. |
| 6. Seasonal campaign | Current Christmas heading plus tour cards | homepage seasonal component | `GET tours?...categories.id=7...` | **API-DRIVEN (mixed)** | `getHomeTours` → `HomePage` | PASS | Current Live campaign copy/link; cards/prices/images remain API-driven. |
| 7. Popular Destination/tours | Filtered tour cards | popular-tours component | `GET tours/home`; filtered `GET tours` | **API-DRIVEN (mixed)** | `getHomeTours` + `HomePopularTours` | PASS | Kept transient failure distinct from valid empty results. |
| 8. Make Your Trip | Planning presentation/form | static form structure and locale dictionaries | Submission only: `POST custom/trips` | **STATIC** — presentation ownership | `HomeSearchShortcuts modeOnly="make"` | PASS | Reused the real form; no invented marketing block. |
| 9. Special Offers | Offer cards/prices | special-offers component | `GET tours?...categories.id=53` | **API-DRIVEN (mixed)** | `getHomeTours` → `HomePage` | PASS | Dynamic records preserved. |
| 10. How It Works | Three exact numbered steps | Static arrays + locale dictionaries | None | **STATIC** — `INTENTIONAL_STATIC_CONTENT` | `HomePage` + `home-copy.ts` | PASS | Preserved as valid hardcoded presentation. |
| 11. Highlights of Egypt | Destination cards | home destinations component | `GET destinations/home?...` | **API-DRIVEN** | `getHomeDestinations` → `HomePage` | PASS | Titles/images/links remain API-owned. |
| 12. Travel Blogs | Recent blog cards | home blogs component | `GET blogs/home?...` | **API-DRIVEN** | `getHomeBlogs` → `HomePage` | PASS | Records/media remain dynamic. |
| 13. Sustainability block | Approved static sentence and certification image | Static Nuxt block | None | **STATIC** — `INTENTIONAL_STATIC_CONTENT` | `HomePage` | PASS | Restored the current Live em-dash copy exactly. |
| 14. Gallery | Static gallery art with dashboard social destinations | Static image array + `social_links` setting | `GET settings?option_key=social_links` | **API-DRIVEN (mixed)** | `getPublicSiteSettings` → `HomePage` | PASS | Static imagery retained; links use filtered setting only. |
| 15. FAQ | Five question/answer records | home FAQ component | `GET faqs/home?page_limit=5` | **API-DRIVEN** | `getHomeFaqs` → `HomePage` | PASS | Records remain dashboard/API controlled. |
| 16. Need Help/lead CTA | Static heading and input labels | Static component + Nuxt dictionaries | Submission only: `POST contact-requests` | **STATIC** — presentation ownership | `HomeNeedHelpForm` | PASS | Copy localized; mutation only on explicit submit. |
| 17. Partner/certification imagery | Fixed approved partner strip | Static Nuxt asset list | None; static URLs resolve on backend media host | **STATIC** — `INTENTIONAL_STATIC_CONTENT` | `HomePage` `partners` | PASS | Preserved fixed approved list. |
| 18. Footer | Static route groups plus title/emails/social/location | `components/Footer/index.vue` | Narrow filtered settings calls | **API-DRIVEN (mixed)** | `SiteShell` → `getPublicSiteSettings` → `Footer` | PASS | Dynamic supported fields; static logo/phone/address/WhatsApp retained. |
| 19. Contact information | Three phones, WhatsApp, address, notification emails, sustainability mailbox | Mixed: notification setting plus static contact literals | `settings?option_key=notification_emails` and `company_location_url` | **API-DRIVEN (mixed)** | `site-contact.ts`; filtered settings → Footer/contact page | PASS | Centralized frontend-owned fields; appended Nuxt-static sustainability mailbox. |
| 20. Social links | Footer and gallery destinations | `social_links` setting | `GET settings?option_key=social_links` | **API-DRIVEN** | `getPublicSiteSettings` → Footer/HomePage/contact page | PASS | No unfiltered settings request. |

## Totals

- API-driven top-level sections: **12** (including mixed API/static presentation sections).
- Intentional-static top-level sections: **8**.
- Unknown-ownership sections: **0**.

Exact static sections preserved: header/navigation and approved logo; hero promotional copy; counters; Make Your Trip presentation; How It Works; sustainability; Need Help presentation; partner/certification imagery. Static sub-values also remain inside mixed sections: current campaign copy, labels, phone/address/WhatsApp, sustainability mailbox, gallery art, and footer route groups.

Exact dynamic sections verified: hero gallery; action entity options; seasonal tours; popular tours; special offers; destination highlights; blogs; gallery social destinations; FAQs; footer settings; dynamic contact email/location values; social links.

## Dynamic proof chains

All loaders attach the active locale through the shared API helper. Dynamic entity text is never copied into `home-copy.ts`.

1. `pages/home?includes=seo` → `getHome` → `HomePage`/`HomeHeroMedia`.
2. tour list endpoints → `getHomeTours` → `HomePage`/`HomePopularTours`/`TourCard`.
3. `destinations/home` → `getHomeDestinations` → `HomePage`/`DestinationCard`.
4. `blogs/home` → `getHomeBlogs` → `HomePage`/`BlogCard`.
5. `faqs/home` → `getHomeFaqs` → `HomePage`.
6. filtered settings endpoints → `getPublicSiteSettings` → `SiteShell`, `Footer`, `HomePage`, and contact page.
