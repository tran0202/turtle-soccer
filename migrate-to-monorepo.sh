#!/usr/bin/env bash
# Restructures the existing turtle-soccer repo into a monorepo IN PLACE,
# using `git mv` so history is preserved for the web app's existing files.
# Run this from the repo root (where the current package.json, app/, etc.
# already live) BEFORE unzipping monorepo-overlay.zip on top.
#
# What this does:
#   1. Moves every existing web-app file/folder into apps/web/
#   2. Removes the lib/ and data/ files that are being replaced by the new
#      packages/core (safe — the overlay adds the real replacements there)
#   3. Leaves everything staged in git for you to review before committing
#
# What this does NOT do: touch Vercel, touch GitHub, or commit anything.
# You review with `git status` / `git diff --staged` and commit yourself.

set -euo pipefail

if [ ! -d .git ]; then
  echo "No .git/ here — run this from the root of your existing turtle-soccer repo."
  exit 1
fi

if [ ! -f package.json ] || ! grep -q '"next"' package.json; then
  echo "This doesn't look like the turtle-soccer Next.js repo root (no package.json with a next dependency). Aborting."
  exit 1
fi

if [ -d apps ]; then
  echo "An apps/ folder already exists here — looks like this migration may have already run. Aborting to avoid double-moving things."
  exit 1
fi

echo "Creating apps/web/ ..."
mkdir -p apps/web

# Move every top-level item that belongs to the web app into apps/web/,
# using git mv so git tracks these as renames. Checked for existence first
# since not everything here (e.g. yarn.lock, .yarnrc.yml, .yarn/) is
# guaranteed to exist depending on your local setup.
WEB_ITEMS=(
  app
  components
  docs
  public
  next-env.d.ts
  next.config.mjs
  package.json
  postcss.config.mjs
  tailwind.config.ts
  tsconfig.json
  lib
  data
  yarn.lock
  .yarnrc.yml
  .yarn
  .prettierrc
)

for item in "${WEB_ITEMS[@]}"; do
  if [ -e "$item" ]; then
    echo "  git mv $item -> apps/web/$item"
    git mv "$item" "apps/web/$item"
  fi
done

# tsconfig.tsbuildinfo is a build cache, never tracked/needed — remove if present.
rm -f apps/web/tsconfig.tsbuildinfo

# lib/data.ts, lib/countries.ts, lib/clubs.ts and data/organizations.json,
# data/competitions.json, data/editions.json are being replaced by
# packages/core (added by the overlay) — remove the old copies. The four
# *-logos.json files in data/ stay; those are web-specific and the overlay
# doesn't touch them.
echo "Removing files superseded by packages/core ..."
git rm -rf apps/web/lib
git rm -f \
  apps/web/data/organizations.json \
  apps/web/data/competitions.json \
  apps/web/data/editions.json

echo ""
echo "Done. Next steps:"
echo "  1. Unzip monorepo-overlay.zip into this same directory (it adds"
echo "     packages/core/, apps/mobile/, the new root package.json, .gitignore,"
echo "     README.md, and updates apps/web/next.config.mjs, apps/web/package.json,"
echo "     and the handful of apps/web files that needed async conversion."
echo "  2. Run: git add -A"
echo "  3. Review with: git status   and   git diff --staged"
echo "  4. yarn install, then sanity-check both apps before committing."
