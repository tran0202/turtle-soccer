# Turtle Soccer Archive — monorepo

A Yarn workspaces monorepo containing the web app, the mobile app, and the
data/logic layer they both share.

```
apps/
  web/      Next.js 14 site (the original project)
  mobile/   Expo (React Native) app for iOS and Android
packages/
  core/     Shared types, data-access functions, and the organizations/
            competitions/editions JSON data itself — the single source of
            truth both apps import from
```

## Getting started

```bash
yarn install        # installs and links everything, both apps and the shared package
yarn web             # runs the Next.js dev server (apps/web)
yarn mobile          # starts the Expo dev server (apps/mobile)
```

## How the shared package works

`packages/core` is the single source of truth for the archive's data:
organizations, competitions, editions, and the country/club lookup tables.
Both apps import the exact same functions from `@turtle-soccer/core` —
there's no duplication, and no separate copy of the data to keep in sync.

Every data-access function is `async`, even though reading the bundled JSON
doesn't strictly require it:

```ts
const org = await getOrganization("fifa");
```

This is deliberate. `packages/core/src/dataSource.ts` is the single place
that decides whether data comes from the bundled JSON or a live API:

```ts
const DATA_SOURCE: DataSource = "bundled"; // or "api"
```

Because every screen in both apps already calls these functions with
`await` and handles a loading state, switching that one value (and filling
in the `fetch` calls already stubbed out in the `"api"` branch) is the
*entire* migration to a live API — no screen in either app needs to change.

## Why raw TypeScript, not a built package

`packages/core` ships its TypeScript source directly rather than being
pre-compiled to JS. Both apps' bundlers are configured to compile it
themselves:

- **Web**: `next.config.mjs` sets `transpilePackages: ["@turtle-soccer/core"]`
- **Mobile**: `metro.config.js` is configured to watch the whole monorepo and
  resolve packages from the workspace root, Expo's standard monorepo setup

This means editing a file in `packages/core` takes effect immediately in
both apps' dev servers — no separate build step to remember.

## A note on the web app's logo-mapping files

`apps/web/data/*-logos.json` (org, competition, edition, and club logos)
deliberately stayed in `apps/web` rather than moving into the shared
package. Their values are file paths into `apps/web/public/` specifically —
meaningless to the mobile app, which will need its own, different approach
to bundling or loading images (e.g. `require()` on local assets) whenever
that gets built out. Only the three core data files (organizations,
competitions, editions) and the country/club code lookups are genuinely
shared business data.

## Current state of the mobile app

This is a working proof of concept, not a full port of the web app:

- Two screens exist (organizations list, organization detail), proving the
  shared async data layer end-to-end, including loading and error states
- No flags, logos, or the web app's visual design (fonts, the blue/green/
  amber color system) — plain React Native styling for now
- Competitions and editions screens don't exist yet, but would follow the
  exact same pattern as the two screens that do

## Deploying the web app

If this replaces an existing Vercel deployment of the web app on its own,
the Vercel project's **Root Directory** setting needs to be updated to
`apps/web` (Project Settings → General → Root Directory) so it builds the
right app out of the monorepo.
