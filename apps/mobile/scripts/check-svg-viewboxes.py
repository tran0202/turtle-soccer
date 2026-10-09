#!/usr/bin/env python3
"""
Lists SVGs under src/assets whose root <svg> has no viewBox, split into:

  FIXABLE   - has numeric width/height, so svgr.config.js (removeDimensions)
              will build a viewBox from them at bundle time. Nothing to do.
  NEEDS FIX - has neither a viewBox nor numeric width/height, so there's
              nothing to derive a viewBox from. Open the file and add one by
              hand (e.g. viewBox="0 0 W H" using the artwork's real extents),
              or swap in a different file.

Usage (from apps/mobile/):
    python3 scripts/check-svg-viewboxes.py
"""
import os
import re

ASSETS = os.path.join(os.path.dirname(__file__), "..", "src", "assets")
NUMERIC = re.compile(r"^\s*\d*\.?\d+\s*(px)?\s*$")

fixable, needs_fix = [], []

for dirpath, _, files in os.walk(ASSETS):
    for f in sorted(files):
        if not f.lower().endswith(".svg"):
            continue
        path = os.path.join(dirpath, f)
        txt = open(path, encoding="utf-8", errors="ignore").read()
        m = re.search(r"<svg\b[^>]*>", txt, re.S)
        if not m:
            needs_fix.append((path, "no <svg> tag found"))
            continue
        tag = m.group(0)
        if "viewBox" in tag:
            continue
        w = re.search(r'\swidth="([^"]+)"', tag)
        h = re.search(r'\sheight="([^"]+)"', tag)
        if w and h and NUMERIC.match(w.group(1)) and NUMERIC.match(h.group(1)):
            fixable.append((path, f"width={w.group(1)} height={h.group(1)}"))
        else:
            needs_fix.append((path, f"width={w.group(1) if w else None} height={h.group(1) if h else None}"))

rel = lambda p: os.path.relpath(p, ASSETS)
print(f"FIXABLE by svgr.config.js ({len(fixable)}):")
for p, d in fixable:
    print(f"  {rel(p)}   [{d}]")
print(f"\nNEEDS A MANUAL viewBox ({len(needs_fix)}):")
for p, d in needs_fix:
    print(f"  {rel(p)}   [{d}]")
