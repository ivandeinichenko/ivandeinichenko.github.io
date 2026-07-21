# ID-13 — Design Specification

Personal site of **Ivan Deinichenko, Senior Frontend Engineer** (ivandeinichenko.github.io).
This document describes the visual system so an AI agent (or human) can extend the site without breaking it.

## 1. Concept

**"Engineering datasheet / spec sheet."** The site presents the engineer as a production-grade
component: part number, specifications table, field tests, work log, barcode. The tone is dry,
technical, self-aware (mildly ironic), and confident. Everything reads like a hardware datasheet,
not a marketing page.

Key metaphors (keep them consistent):
- Header: `PART NO. ID-13` (ID = initials, 13 = years of experience) + `STATUS: ● AVAILABLE`
- Sections are labeled like code comments: `// SPECIFICATIONS`, `// FIELD TESTS`, `// WORK LOG`,
  `// SIDE PROJECTS — OFF-DUTY OUTPUT`, `// CONTACT`
- Hero: surname once, huge, with a dashed "dimension line" underneath (`|← 13 YEARS IN PRODUCTION →|`)
  like an engineering drawing measurement
- Contact block: "Ready to deploy." + a decorative barcode (`ID-13 · SRB`)

## 2. Color tokens

CSS custom properties. `:root` holds the **dark** theme (the default); `html[data-theme="light"]`
overrides them for light. The `data-theme` attribute is set by `js/theme-switcher.js`.

| Token        | Dark (default) | Light      | Usage |
|--------------|----------------|------------|-------|
| `--bg`       | `#101114`      | `#f2f0eb`  | page background |
| `--panel`    | `#14161a`      | `#ece9e2`  | raised surfaces (rarely used) |
| `--fg`       | `#eceef0`      | `#17181b`  | primary text |
| `--muted`    | `#8f939a`      | `#6e6a61`  | secondary text, labels, nav |
| `--line`     | `#2c2e33`      | `#d9d5cc`  | all borders / hairlines |
| `--accent`   | `#e08b3c`      | `#c06f22`  | accent (amber/orange); ✓ marks, links hover, status, CTA bg |
| `--accent-fg`| `#101114`      | `#f7f5f0`  | text on accent background |

Rules:
- Exactly **one accent color**. Never introduce a second accent.
- Dark is the default theme. With no saved preference the site follows `prefers-color-scheme`;
  an explicit user click persists to `localStorage('preferred-theme')`.
- All borders are 1px `var(--line)`. No shadows, no glassmorphism, no gradients, no border-radius
  (buttons and cards are square).

## 3. Typography

| Font | Role |
|------|------|
| **Archivo Black** | display only: hero surname, "Ready to deploy." heading. Always uppercase, `letter-spacing:-.01em` |
| **Archivo** (400/500/700) | card titles (`font:700 18px`) |
| **IBM Plex Mono** (400/500) | ALL structural text: header, nav, section labels, spec/log tables, metrics, buttons, footer, badges. Uppercase for labels |
| **Instrument Sans** (400/500/600) | body/descriptive paragraphs only |

Scale:

| Role | Size |
|------|------|
| hero surname | `clamp(34px, 9.5vw, 112px)` |
| contact heading | `clamp(28px, 3.6vw, 41px)` |
| hero paragraph | `clamp(16px, 1.7vw, 19px)/1.65` |
| card titles | 18px |
| contact paragraph | 15.5px/1.6 |
| field-test descriptions | 15px/1.6 |
| spec & log tables, card descriptions, log bullets | 14.5px |
| field-test metrics, buttons, dates | 13.5px |
| header, nav, section labels, hero kicker | 13px |
| tech tags, meta rows, barcode label, footer | 12px–12.5px |

The floor of the hero clamp is **34px, not 44px**: the surname is set on one line
(`white-space:nowrap`), and above ~35px it overflows the padding box below ~360px viewports —
where `.hero{overflow:hidden}` would silently clip it rather than scroll. Raise the `vw`
coefficient or the ceiling if the hero should grow; leave the floor alone.

Voice: English, terse, metric-driven. Numbers over adjectives ("SEO 40→100", "6× LCP",
"2000+ components refactored (career)"). Mild datasheet irony is on-brand
("max observed output", "✓ shipped", "OFF-DUTY OUTPUT") — never silly.

## 4. Layout

- Full-bleed hero and header; all other sections `max-width:1120px; margin:0 auto`.
- Horizontal padding everywhere: `clamp(20px, 4vw, 48px)`. Section spacing `clamp(48px, 8vh, 88px)`.
- Header is sticky, background `var(--bg)`, bottom hairline. Nav items are lowercase mono:
  `specs / work / log / side / contact`.
- **Spec & log tables**: 3-column CSS grid (`label | value | check` or `date | role | location`),
  rows separated by 1px top borders, no vertical lines, no zebra striping.
- **Cards** (field tests, side projects): 1px `var(--line)` border, square corners,
  padding ~22–24px; hover = border turns `var(--accent)` (transition .25s). No lift/shadow.
- Buttons: mono uppercase text in a 1px bordered box; primary button = accent background,
  `--accent-fg` text, no border.

## 5. Motion

Restrained; CSS-only:
- Page load: hero elements stagger in with `riseIn` (fade + 22px translateY, .6s, delays .05–.55s).
- Dimension line dashes scale in with `drawIn` (scaleX 0→1, transform-origin left/right).
- Status dot `●` blinks (`blink` 2.2s infinite).
- Hover: card/button border → accent; link color → accent. Nothing else moves.
- All of the above is disabled under `prefers-reduced-motion: reduce`.
- No scroll-jacking, no parallax, no particles (the old site had particles — deliberately removed).

## 6. Content structure (in order)

1. **Header** — part no., nav, status, theme toggle `[light_mode]`/`[dark_mode]`
2. **Hero** — mono kicker line (name, role, "PRODUCTION GRADE", location), surname in Archivo Black,
   dimension line, one descriptive paragraph
3. **// SPECIFICATIONS** — skills as a spec table with `✓` verdicts. NEVER use skill bars or percentages
4. **// FIELD TESTS** — 3 featured engagements, each: title + dates, 1–2 sentence description,
   right-aligned accent metrics (2 lines)
5. **// WORK LOG — FULL HISTORY** — all positions as compact table rows; current row's date in accent.
   Each row is a `<details>`: collapsed it reads as a plain table row, expanded it reveals
   achievement bullets and a mono tech-tag list (keyword surface for recruiters/ATS)
6. **// SIDE PROJECTS — OFF-DUTY OUTPUT** — cards with `TYPE: BOOK / CHANNEL / APP` meta row
7. **// CONTACT** — bordered box: "Ready to deploy." + paragraph + buttons (CV.PDF ↓ primary,
   LINKEDIN ↗, TELEGRAM ↗, MAIL ↗) + barcode
8. **Footer** — copyright + LinkedIn / Email / CV links. Keep it plain and production-grade;
   no "specimen sheet" / "handcrafted" mock-up flavour text

Link conventions: external `↗`, downloads `↓`, in-page `→`. Arrows are part of the label text.

## 7. Do / Don't

**Do**: keep everything measurable and terse; reuse the mono-label + hairline-table pattern for
any new section (`// NEW SECTION`); keep one accent; keep square corners; keep both themes working.

**Don't**: skill bars/percentages, emoji, gradients, glassmorphism, rounded cards, particle
backgrounds, stock icons/illustrations, more than one accent color, marketing superlatives,
photos/avatars (the site is intentionally photo-free), floating back-to-top buttons.

## 8. Files

The site is vanilla HTML/CSS/JS built with Vite (no framework, no runtime dependencies).

- `index.html` — all markup, plus `<head>`: SEO meta, canonical, Open Graph / Twitter,
  JSON-LD `Person`, favicon, non-blocking Google Fonts, GA gtag snippet.
- `css/themes.css` — color tokens (§2) · `css/main.css` — layout and components (§4)
  · `css/animations.css` — keyframes (§5) · `css/responsive.css` — 760px breakpoint + print.
- `js/theme-switcher.js` — theme state, anti-flash, `themechange` event
  · `js/main.js` — smooth scroll, active nav · `js/analytics.js` — GA4 events.
- `public/assets/` — favicon, CV PDF, og-image. Served from the site root.

Responsive: single breakpoint at 760px (status hidden, check/location columns dropped,
field-test metrics move under text). Hero scales via `clamp()`.
