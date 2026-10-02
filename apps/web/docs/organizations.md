# National associations: full FIFA membership

As of this note, `data/organizations.json` includes all 211 current FIFA
member associations across all 6 confederations, plus Monaco (not a FIFA
member, kept only because `lib/clubs.ts` needs it for AS Monaco's flag).

## Why this note exists

24 associations were already in the data with full detail (verified founding
year, hand-written description) before this addition — added individually,
research-first, the way everything else on this site works. Populating the
*rest* of FIFA's 211 members the same way wasn't practical in one pass: that's
211 individually-verified founding years, which would mean something like
100+ separate research checks. Rather than either skip the other ~187
countries entirely or invent plausible-sounding founding years for them, the
person running this project chose a middle path — call it Path #1:

**All 211, but lighter-weight**: real country, real confederation, correct
FIFA trigram code, and the *real* official federation name — but no founding
year, and a shorter description than the original 24 get.

## What's verified, and how

- **Federation full names**: pulled directly from Wikipedia's "List of FIFA
  members" table (country ↔ official body name), not guessed. Cross-checked:
  every one of the 211 names in our data matched something in that table with
  no leftovers on either side.
- **Confederation membership**: AFC's 46 were verified directly against the
  Asian Football Confederation Wikipedia page's own member table. The other
  five confederations were assigned by geography plus the specific
  well-documented exceptions (Israel and Kazakhstan in UEFA rather than AFC;
  Guyana and Suriname in CONCACAF despite South American geography; Australia
  in AFC rather than OFC), then validated two ways: every one of CAF's 54
  entries (assigned by elimination — whatever wasn't claimed by another
  confederation) is a genuine African nation with no stray non-African
  country, and every confederation's final count matches FIFA's official
  membership numbers exactly (AFC 46, CAF 54, CONCACAF 35, CONMEBOL 10, OFC
  11, UEFA 55 — summing to 211).

## What's NOT verified — the actual trade-off

- **`founded` is `null`** for all 187 newly added associations. This isn't
  hidden or defaulted to a guess — the `Organization` type explicitly allows
  `founded: number | null` for exactly this reason. It's never rendered
  anywhere for association-level orgs regardless (confirmed before this work
  started — the only place `founded` displays is a fallback on the root
  `/organizations` page for orgs with *no children*, a path associations never
  hit), so this has zero visible effect on the site today. It only matters if
  someone later wants to show founding year somewhere for associations, at
  which point these 187 need real research the same way the original 24 got.
- **`name` (the short display label, e.g. "AFA", "DFB") is a computed
  initialism** from the federation's full name (e.g. "Afghanistan Football
  Federation" → "AFF"), not a verified real-world acronym. Some of these will
  match what that federation is actually commonly called; many won't have a
  well-known short form at all, or use a different one in practice. If you
  spot one that's wrong or awkward, it's a one-line fix in
  `data/organizations.json` — the `name` field for that entry.
- **`description` is a generated one-liner** ("The governing body for
  football in {country}, a member of {CONFEDERATION}.") rather than the
  hand-written, specific description the original 24 have.

## If revisiting this later

Bringing any of these 187 up to the original 24's level of detail is just
editing that one entry in `data/organizations.json` — add a real `founded`
year (verified, not guessed), a proper description, and correct the `name` if
the computed initialism isn't right. Nothing else in the codebase needs to
change; the data model already treats every association the same way
regardless of how much detail it has.
