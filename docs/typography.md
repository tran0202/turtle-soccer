# Typography notes

## Current pairing (as of this note)

- **Headline / display**: Big Shoulders Inline Display (`Big_Shoulders_Inline_Display` in next/font/google)
- **Body**: Source Serif 4

Wired up in `app/layout.tsx`, exposed as CSS vars `--font-display` / `--font-body`,
mapped to Tailwind's `font-display` / `font-body` classes in `tailwind.config.ts`.

## Previous pairings (rolled back from, in order)

1. **Big Shoulders Display** + **Inter** — the original pairing. Both
   excellent, highly legible, but Inter especially is the single most common
   body font on the web, and plain Big Shoulders Display is a fairly ordinary
   condensed-athletic headline choice.
2. **Big Shoulders Stencil Display** + **Literata** — tried briefly. Solid
   archive-leaning pairing; came very close to being the final choice. Good
   fallback if Big Shoulders Inline ever feels too busy at small sizes (the
   inline stroke detail can get muddy below ~20px).

If the current pairing ever feels wrong, either of the above are safe,
already-verified-working fallbacks — just swap the imports in `app/layout.tsx`.

## Other combinations tried and rejected (not because they're bad — just picked one)

Reasoning: the site is an *archive*, so a headline+serif-body pairing reads as
"yearbook/almanac" rather than "sports app," which is a more distinctive
direction than condensed-display + sans-body (an extremely common formula for
sports sites specifically).

**Headline alternatives** (condensed/athletic, considered instead of Big
Shoulders Inline):
- **Oswald** — explicitly ruled out. It's one of the most overused condensed
  display fonts on the web (default in many WordPress/Squarespace themes,
  common in sports/scoreboard contexts specifically) — the opposite of
  distinctive.
- **Staatliches** — vintage stencil-poster feel, only ships in one weight, so
  no bold/regular hierarchy within headlines.
- **Teko** — condensed and technical/telemetry-feeling, less "athletic jersey"
  and more "digital scoreboard readout."
- **Big Shoulders Stencil Display** — a sibling of the current choice (see
  "Previous pairings" above); stencil-cut rather than inline-stroke.

**Body alternatives** (considered instead of Source Serif 4):
- **Literata** — see "Previous pairings" above; very close alternative,
  designed for long-form reading (it's the font behind Google Play Books).
- **IBM Plex Sans** — has real character (distinctive apertures), sans rather
  than serif, so it keeps the "sports site" feeling rather than "archive."
- **Public Sans** — US government design-system font, clean, understated,
  comparatively rare in the wild.
- **Karla** — grotesk with quirky, slightly rounded details.

## If revisiting this later

All of the above are on Google Fonts and load the same way the current fonts
do — via `next/font/google` in `app/layout.tsx`. Note that next/font/google
sometimes splits a variable font's optical-size axis into separate named
exports rather than one unified family (e.g. Big Shoulders Inline is
`Big_Shoulders_Inline_Text` / `Big_Shoulders_Inline_Display`, not a single
`Big_Shoulders_Inline` — same story for Big Shoulders Stencil. TypeScript will
error and tell you the correct name if you guess wrong).

