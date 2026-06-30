# Product

## Register

brand

Default register is **brand** (marketing-led: design IS the product — desire, imagery, and storytelling sell the trips). The booking flow (`book-egypt-trip`, `make-your-trip`, `cart`, `order`, `auth`, `profile`, `tour`, `trips`) is treated with **product**-register rigor when worked on directly: scannable, error-tolerant, conversion-focused. PRODUCT.md carries `brand` as the single default; per-task overrides are expected for booking surfaces.

## Users

**Primary:** first-time international leisure travelers planning an Egypt trip. They are excited about iconic experiences (pyramids, Nile cruises, Luxor, Aswan) but cautious about safety, trust, logistics, transportation, and booking reliability. They research on desktop and mobile, often across multiple sessions, comparing operators before committing. They are not Egypt experts — they need orientation, clarity, and reassurance at every step.

**Secondary:** repeat visitors and diaspora familiar with Egypt, who want depth, custom itineraries, and flexible planning rather than hand-holding. The product must serve them through deeper tours and customizable trips without making the primary experience heavier.

**Context:** planning a high-cost, high-emotion, logistically complex trip to a country they may not have visited. Trust and clarity beat novelty. Every screen should lower the perceived risk of booking.

## Product Purpose

Sun Pyramids Tours is a seasoned Egyptian travel operator's direct booking website. It exists to:

- Showcase Egypt tours, destinations, and experiences with operator-grade expertise and imagery.
- Move a cautious first-time visitor from "is this real / safe?" to a confident booking.
- Provide a custom-trip planner for travelers who want a tailored itinerary.
- Convert interest into booked trips through a cart/checkout/account flow that feels as trustworthy as the marketing.

Success looks like: a first-time international visitor understands what they'd do in Egypt, trusts that Sun Pyramids can execute it, and completes a booking without abandoning over uncertainty.

## Brand Personality

Expert, grounded, established. A seasoned local operator with deep knowledge, clear communication, and reliable execution — not luxurious-for-luxury's-sake, not playful, not hype-driven. Practical and trustworthy above all.

Warmth and hospitality support the tone in service moments (guide interactions, contact, support) but never overwhelm the expert core. Premium visual moments appear through imagery and layout, not through ornamental styling. Voice is clear, confident, specific; never breathless.

Three words: **expert, grounded, trustworthy.**

## Anti-references

- **Cheap-OTA clutter.** No excessive deal stickers, fake urgency, countdown timers, "72 people viewing now", or noisy booking pressure. Calm confidence, not FOMO.
- **The 2026 AI cream/sand/beige warm-neutral default.** Egypt can inspire warm tones, but the brand already has a stronger identity (deep blue, orange, Trip Sans). The site must feel distinctive, not beige and bland. Warmth is carried by imagery, accent, and voice — not by a warm-tinted near-white body background.
- **Dark, moody luxury.** Tour information, pricing, trust signals, and CTAs must stay clear, readable, and scannable — not buried under cinematic dark-mode drama.
- **SaaS card-grid scaffold.** No generic startup template of repeated icon+heading+text cards with uppercase tracked eyebrows above every section. The site should feel like a real Egyptian travel operator: content-rich, destination-led, practical, trust-building.

## Design Principles

1. **You're in good hands.** Trust before desire. Lead every surface with expertise, reliability, and clarity. The first job is to lower perceived risk; wonder and desire follow through imagery, not through hype.
2. **Scannable, not cinematic.** Tour info, pricing, trust signals, and CTAs are easy to find and compare. Never bury the booking path under visual drama. Clarity is the conversion lever.
3. **Distinctive by identity, not by trend.** Lean on the committed deep-blue + orange + Trip Sans system. Egypt's warmth comes through imagery and accent color, not through a warm-neutral body palette. The site is recognizable as Sun Pyramids, not as "a 2026 AI travel site."
4. **Real operator, not template.** Content-rich and destination-led over repeated card scaffolds. Sections earn their structure from the content they carry; each reveal fits what it reveals.
5. **Calm conversion.** No fake urgency. Confidence — not pressure — drives booking. The flow from tour → planner → cart → checkout should feel like one continuous act of being well looked after.

## Accessibility & Inclusion

**Production target: WCAG 2.1 AA.** First-time international travelers include older, cautious, and less-tech-savvy users, so the interface must be clear, readable, and easy to navigate.

Core requirements:

- Body text contrast ≥ 4.5:1 against its background; large/bold text ≥ 3:1; placeholder text meets the same 4.5:1 (not the muted-gray default).
- Visible, persistent focus states; full keyboard navigation and parity.
- Accessible forms with clear labels, field grouping, and descriptive error messages.
- Descriptive alt text on destination/tour imagery.
- `prefers-reduced-motion` alternatives for every animation (crossfade or instant, never gated visibility).
- Readable typography and generous tap targets, especially on the mobile bottom bar and booking controls.

WCAG AAA is a stretch goal for critical areas (contrast, readability, reduced motion) where feasible, but AA is the committed bar.