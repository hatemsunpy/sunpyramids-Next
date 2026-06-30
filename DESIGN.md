---
name: Sun Pyramids Tours
description: Expert-led Egypt tour booking — established operator clarity with destination imagery.
colors:
  primary: "#163a96"
  secondary: "#f7951d"
  neutral-bg: "#eeeeee"
  surface: "#ffffff"
  ink: "#1d1f1f"
  muted: "#6b7280"
  border: "#eeeeee"
  error: "#dc2626"
  success: "#1faf38"
  focus-ring: "#4d78e5"
typography:
  display:
    fontFamily: '"Trip Sans", sans-serif'
    fontSize: "clamp(2.3rem, 8vw, 6.25rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "normal"
  headline:
    fontFamily: '"Trip Sans", sans-serif'
    fontSize: "clamp(1.8rem, 3vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: '"Trip Sans", sans-serif'
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "normal"
  body:
    fontFamily: '"Trip Sans", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: '"Trip Sans", sans-serif'
    fontSize: "0.85rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0"
rounded:
  pill: "999px"
  card: "1rem"
  input: "1rem"
  panel: "1.75rem"
  status: "1.5rem"
spacing:
  section: "4.5rem"
  container: "min(100% - 2rem, 1280px)"
  card-gap: "1.25rem"
  component-gap: "1rem"
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.5rem"
  button-primary-hover:
    backgroundColor: "#c57007"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0.875rem 1.5rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    padding: "0.75rem 1.25rem"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "0"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.input}"
    padding: "1rem"
---

# Design System: Sun Pyramids Tours

> **Deployment boundary (2026-06-28):** The public site `https://sunpyramidstours.com` is still the legacy Nuxt production build. Next.js changes in this repo are visible only on the staging preview (`https://sunpyramids-next.vercel.app`) and the current local verified preview (`http://localhost:3003`). Do not use the live production URL or `localhost:3000` to validate Next.js implementation changes. See `docs/next-migration/deployment-boundary.md` for the full rule.

## 1. Overview

**Creative North Star: "The Expert Itinerary"**

This system should feel like a clean, confident, guide-in-hand trip folder from an established local operator. Sun Pyramids Tours is not selling inspiration alone; it is orienting first-time international travelers, lowering perceived risk, and making booking feel safe. The interface is practical, organized, and reassuring — destination imagery creates desire, but structure and clarity create trust.

The design language is **refined and practical**: clear hierarchy, rounded but not playful components, a disciplined blue-and-amber palette, and generous white surfaces floating over a soft gray ground. Every element earns its place by helping the visitor compare, choose, and book with confidence.

This system explicitly rejects the four anti-patterns named in `PRODUCT.md`: cheap-OTA clutter and fake urgency, the 2026 AI cream/sand warm-neutral default, dark moody luxury that hides conversion, and the generic SaaS card-grid scaffold. It also rejects the leftover `--theme-color: #ff4c3b` defined in the legacy production stylesheet; that variable is not used in any rendered element and should not be revived.

**Key Characteristics:**
- One display typeface (Trip Sans) used across all voices, differentiated by weight and scale.
- Deep blue (`#163a96`) for trust, navigation, and primary operator identity; amber (`#f7951d`) for CTAs and warmth.
- Soft gray body background (`#eeeeee`) with white surfaces for cards, panels, and inputs.
- Pill-shaped actions and rounded cards — friendly but never childish.
- Flat-by-default layout; shadows appear only on floating or hovered surfaces.
- Conversion-first scannability: prices, durations, and CTAs are immediately visible.

## 2. Colors

The palette is a committed two-color brand system on a neutral ground. Blue carries trust and established expertise; amber carries the CTA and the warmth of Egyptian sunlight. Neutrals stay cool and restrained so the body background never drifts into cream or sand.

### Primary
- **Anchor Blue** (`#163a96`): The brand’s core identity color. Used for the header logo area, navigation hover states, primary links, section trust marks, and the "Make Your Trip" outline button. It should feel like a stable, established operator.

### Secondary
- **Amber CTA** (`#f7951d`): The action color. Used for primary buttons (`Search`, `View Packages`, `See more`), prices on tour cards, special-offer links, and the scroll-thumb accent. Hover darkens to `#c57007`.

### Neutral
- **Soft Gray Ground** (`#eeeeee`): The default page background. Cool, light, and practical — not warm cream, not stark white. This is the production site source of truth and is now implemented in the Next.js repo; the previous `#f9fafb` migration-era divergence has been reconciled.
- **White Surface** (`#ffffff`): Cards, panels, dropdowns, modals, inputs, and the shortcut panel float on this.
- **Ink** (`#1d1f1f`): Primary body and heading text. Near-black with a slight cool shift.
- **Muted Gray** (`#6b7280`): Secondary text, summaries, durations, and metadata. Must maintain ≥ 4.5:1 contrast on white surfaces.
- **Divider/Border** (`#eeeeee`): Card borders, input borders, section separators.

### Utility
- **Error Red** (`#dc2626`): Form errors and payment failure states.
- **Success Green** (`#1faf38`): Confirmation marks and positive status.
- **Focus Ring Blue** (`#4d78e5`): Visible focus outline plus `#e9eefc` glow for keyboard navigation.

### Named Rules
**The Production Palette Rule.** The rendered production site is the source of truth: Anchor Blue `#163a96`, Amber `#f7951d`, Soft Gray `#eeeeee`, Ink `#1d1f1f`. The CSS variable `--theme-color: #ff4c3b` exists in the legacy stylesheet but is unused; do not reintroduce it.

**The Cool-Gray Body Rule.** The page background must remain a cool light gray. Warm cream, sand, beige, or parchment body backgrounds are forbidden — they read as the generic 2026 AI travel aesthetic and undermine the brand’s distinctive blue + amber identity.

## 3. Typography

**Display Font:** Trip Sans (woff2, weights 400 / 500 / 700)
**Body Font:** Trip Sans
**Label/Mono Font:** *none — use Trip Sans at smaller weights*

**Character:** A single geometric sans family keeps the voice unified and practical. Weight and scale do all the differentiation. The system is confident without being loud; headings are bold and tight, body text is open and readable.

### Hierarchy
- **Display** (700, `clamp(2.3rem, 8vw, 6.25rem)`, line-height 1.05): Hero headlines only. Used over full-bleed imagery with a subtle dark overlay and text shadow for legibility.
- **Headline** (700, `clamp(1.8rem, 3vw, 3rem)`, line-height 1.1): Section headings (`Egypt Easter Tours`, `Popular Destinations`, `Make Your Trip`). Left-aligned or centered depending on section; never smaller than the title below it.
- **Title** (700, 1.5rem, line-height 1.45): Card titles, FAQ summaries, sub-section headings.
- **Body** (400, 1rem, line-height 1.7): Long-form copy, tour summaries, blog excerpts. Max line length 70ch.
- **Label** (700, 0.85rem, letter-spacing 0): Tags, metadata pills, prices, durations, uppercase eyebrows when used sparingly.

### Named Rules
**The One Voice Rule.** Trip Sans is the only typeface. Do not pair it with a second sans or a display serif. Differentiate by weight (400 / 500 / 700) and scale, not by family.

**The Readability Rule.** Hero text must always sit over a dark overlay or text shadow so white type remains legible on bright photography. Body text on light surfaces must hit WCAG AA contrast; muted gray (`#6b7280`) is allowed only on white, never on tinted backgrounds.

## 4. Elevation

The system is **flat with structural shadows**. Depth is created mainly through background separation (soft gray ground → white surface), borders (`#eeeeee`), and generous spacing. Shadows are reserved for elements that need to feel temporarily raised or floating: tour-card hover lifts, dropdown panels, the shortcut/search panel, sticky bottom bars, and hero stat bars.

### Shadow Vocabulary
- **Card Hover Lift** (`0 18px 44px rgba(0, 0, 0, 0.11)`): Used on `.tour-card` and `.blog-card` hover states.
- **Floating Panel** (`0 8px 24px rgba(0, 0, 0, 0.095)`): Dropdown menus and elevated cards at rest.
- **Hero Stats Bar** (`0 18px 50px rgba(0, 0, 0, 0.2)`): The white trust bar that floats above the hero image.
- **Shortcut / Help Panel** (`0 16px 50px rgba(0, 0, 0, 0.2)`): The search shortcut panel and the help-band card.
- **Bottom Bar** (`0 0 16px rgba(0, 0, 0, 0.1)`): Mobile fixed bottom navigation.

### Named Rules
**The Structural-Shadow Rule.** Shadows are functional, not decorative. If a surface does not need to float above other content, it does not get a shadow.

## 5. Components

### Buttons
- **Shape:** Pill radius (`999px`).
- **Primary:** Amber background (`#f7951d`), white text, `0.875rem 1.5rem` padding, font-weight 700. Used for search, "View Packages", "See more".
- **Hover / Focus:** Background darkens to `#c57007`; a subtle `translateY(-1px)` lift is allowed on primary buttons. Transition `180ms ease` for background, color, and transform.
- **Outline:** Transparent background, `rgba(29, 31, 31, 0.35)` border, dark text. Hover fills with Ink (`#1d1f1f`) and inverts text to white.
- **Ghost / Header:** Transparent with `rgba(29, 31, 31, 0.5)` border (Sign in, language, cart icon, menu icon). Hover fills Ink and inverts.
- **Tab-style:** Some grouped actions use `20px 20px 0 0` top radius for active tabs (shortcut panel, "Make Trip" / "Find your trip" / "Rent Car").

### Chips / Tags
- **Style:** `#f7f7f7` background, `#555` text, `999px` radius, `0.4rem 0.7rem` padding.
- **Use:** Tour metadata (destination, category), filter pills, small labels. Keep text at `0.82rem` and weight 500–700.

### Cards / Containers
- **Corner Style:** `1rem` radius.
- **Background:** White (`#ffffff`).
- **Border:** `1px solid #eeeeee` on tour cards, blog cards, FAQ items, account cards, and cart summaries.
- **Shadow Strategy:** No shadow at rest; lift to `0 18px 44px rgba(0,0,0,0.11)` on hover for tour/blog cards.
- **Internal Padding:** `1rem` for card bodies; `1.5rem` for larger content cards (about goals, contact panels, planner forms).

### Inputs / Fields
- **Style:** White background, `1px solid #eeeeee` border, `1rem` radius, `1rem` padding.
- **Focus:** Border shifts to `#4d78e5` with a `0 0 0 4px #e9eefc` glow. No outline removal without a replacement.
- **Placeholder:** Use Muted Gray (`#6b7280`) but ensure contrast meets AA on white.
- **Error / Disabled:** Error state uses Error Red border and text; disabled uses reduced opacity on the same neutral border.

### Navigation
- **Header:** White background (`rgba(255,255,255,0.98)`), bottom border `#f9fafb`, sticky top, z-index 50. Logo on the left, pill search bar in the middle, ghost actions on the right.
- **Desktop Nav:** Ink text, weight 600, pill-shaped hover background (`#dedede`). Dropdown panel is white, `1rem` radius, floating shadow, links turn Anchor Blue on hover.
- **Mobile Drawer:** Slide-in from right, white background, full-height, close with × icon, links stacked with hover background `#f7f7f7`.
- **Bottom Bar (mobile):** Fixed white bar with `0 0 16px rgba(0,0,0,0.1)` shadow, four icon-link columns, primary-blue icons.

### Hero
- **Structure:** Full-viewport height, full-bleed background image or video, dark overlay (`rgba(0,0,0,0.34)`), centered white text.
- **Stats Bar:** White floating bar at the bottom with `1.5rem` radius and heavy shadow; four stats separated by `#eeeeee` dividers. Stat values use Anchor Blue, labels use Muted Gray.

### Signature: Search Shortcut Panel
- White floating panel with `1.75rem` radius and heavy shadow. Tab row at top with pill tabs. One text input, one select, one primary button. Sits above the hero fold. This is the site’s most distinctive conversion component.

## 6. Do's and Don'ts

### Do:
- **Do** use the production-rendered palette as source of truth: Anchor Blue `#163a96`, Amber `#f7951d`, Soft Gray `#eeeeee`, Ink `#1d1f1f`.
- **Do** keep the body background a cool light gray; let warmth come from imagery and the amber accent, not from the page ground.
- **Do** use Trip Sans as the single typeface for every text role; differentiate by weight and scale.
- **Do** make CTAs pill-shaped, amber, and high-contrast; reserve Anchor Blue for trust moments and outline actions.
- **Do** use white cards with `1rem` radius and `#eeeeee` borders as the default content surface.
- **Do** add shadows only to floating surfaces (dropdowns, shortcut panel, hero stats, mobile bottom bar, hover lifts).
- **Do** ensure all body text meets WCAG AA contrast; placeholder text must also hit 4.5:1.
- **Do** provide visible `:focus-visible` rings (`#4d78e5` + `#e9eefc` glow) on every interactive element.
- **Do** keep the global page background at `#eeeeee`. The migration-era `#f9fafb` divergence has been reconciled.

### Don't:
- **Don't** reintroduce the unused legacy `--theme-color: #ff4c3b`. It is not part of the rendered production palette.
- **Don't** use a warm cream, sand, beige, or parchment body background — that is the generic 2026 AI travel aesthetic and conflicts with the brand’s cool gray + blue + amber identity.
- **Don't** add cheap-OTA clutter: countdown timers, fake urgency badges, "72 people viewing now", flashing deal stickers, or noisy booking pressure.
- **Don't** go dark and moody. The interface must stay readable, scannable, and conversion-focused; do not bury pricing or CTAs under cinematic darkness.
- **Don't** build generic SaaS card-grid scaffolds with identical icon + heading + text cards repeated endlessly.
- **Don't** put tiny uppercase tracked eyebrows above every section; one deliberate eyebrow is voice, repeated eyebrows are AI grammar.
- **Don't** use gradient text, glassmorphism as default, or side-stripe colored borders as card accents.
- **Don't** use arbitrary z-index values like `9999`; maintain the semantic scale (header 50, bottom bar 60, drawer backdrop 100).
