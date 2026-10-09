#!/usr/bin/env python3
"""
Regenerates src/lib/flagRegistry.ts from whatever .svg files are currently
in src/assets/flags/. Run this after adding or removing a flag file there.

Usage (from apps/mobile/):
    python3 scripts/generate-flag-registry.py
"""
import os

FLAGS_DIR = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "flags")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "flagRegistry.ts")

files = sorted(f for f in os.listdir(FLAGS_DIR) if f.endswith(".svg"))
codes = [f[:-4] for f in files]

lines = [
    '// Generated from apps/mobile/src/assets/flags/*.svg — do not hand-edit.',
    '// Metro cannot dynamically require("./flags/" + code + ".svg") since it',
    '// needs every possible asset path statically analyzable at build time, so',
    '// this explicit map is the standard way to support per-key lookup of one',
    '// of many bundled assets. Regenerate this whenever flags/*.svg changes',
    '// (see scripts/generate-flag-registry.py).',
    'import type { FC } from "react";',
    'import type { SvgProps } from "react-native-svg";',
    '',
]
for code in codes:
    lines.append(f'import {code} from "../assets/flags/{code}.svg";')
lines.append('')
lines.append('export const FLAGS: Record<string, FC<SvgProps>> = {')
for code in codes:
    lines.append(f'  {code},')
lines.append('};')
lines.append('')

with open(OUTPUT_PATH, "w") as f:
    f.write("\n".join(lines) + "\n")

print(f"Generated registry with {len(codes)} flags -> {OUTPUT_PATH}")
