#!/usr/bin/env python3
"""
Generates a logo registry .ts file from a web-app *-logos.json mapping file.
Handles mixed SVG (imported as components) and raster JPG/PNG/WEBP (required
as asset references) entries in the same registry, tagged by kind so the
rendering component can branch correctly.

Usage (from apps/mobile/):
    python3 scripts/generate-logo-registry.py <name> <json-path> <assets-subdir>

Example:
    python3 scripts/generate-logo-registry.py org ../../turtle-soccer/data/org-logos.json org-logos
"""
import json
import os
import re
import sys

RASTER_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

def safe_ident(key: str) -> str:
    # e.g. "world-cup-2022" -> "world_cup_2022", "epl-season" -> "epl_season"
    return "logo_" + re.sub(r"[^a-zA-Z0-9_]", "_", key)

def sanitize_filename(assets_dir: str, filename: str) -> str:
    # Non-ASCII filenames (accented characters, etc.) can cause a Unicode
    # normalization mismatch — the exact bytes a JS/TS import string uses
    # (NFC, precomposed) don't always match what a given filesystem actually
    # stores on disk (some normalize to NFD, decomposed, on write or on
    # extraction from a zip made elsewhere) — "resolves fine on this
    # machine, fails on that one" is the usual symptom. If the filename
    # isn't plain ASCII, rename the actual file to a sanitized version (only
    # within this mobile app's own asset copy, never touching the web app's
    # original) and reference that instead.
    if filename.isascii():
        return filename
    import unicodedata
    base, ext = os.path.splitext(filename)
    ascii_base = unicodedata.normalize("NFKD", base).encode("ascii", "ignore").decode("ascii")
    ascii_base = re.sub(r"[^a-zA-Z0-9_]", "_", ascii_base)
    ascii_base = re.sub(r"_+", "_", ascii_base).strip("_")
    new_filename = f"{ascii_base}{ext}"
    old_path = os.path.join(assets_dir, filename)
    new_path = os.path.join(assets_dir, new_filename)
    if os.path.exists(old_path) and not os.path.exists(new_path):
        os.rename(old_path, new_path)
        print(f"  Sanitized non-ASCII filename: {filename} -> {new_filename}")
    return new_filename

def main():
    name, json_path, assets_subdir = sys.argv[1], sys.argv[2], sys.argv[3]
    mapping = json.load(open(json_path))

    lines = [
        f"// Generated from {os.path.basename(json_path)} — do not hand-edit.",
        "// Mixed SVG (imported as components) and raster JPG/PNG/WEBP (required as",
        "// asset references, which Metro resolves to a number) entries, tagged by",
        "// kind so LogoMark can render either correctly. Regenerate with",
        "// scripts/generate-logo-registry.py whenever the source *-logos.json",
        "// changes.",
        'import type { FC } from "react";',
        'import type { SvgProps } from "react-native-svg";',
        "",
    ]

    assets_dir = os.path.join("src", "assets", assets_subdir)

    entries = []
    for key, val in mapping.items():
        filename = os.path.basename(val["src"])
        filename = sanitize_filename(assets_dir, filename)
        ext = os.path.splitext(filename)[1].lower()
        ident = safe_ident(key)
        if ext == ".svg":
            lines.append(f'import {ident} from "../assets/{assets_subdir}/{filename}";')
            entries.append((key, ident, "svg"))
        elif ext in RASTER_EXTS:
            lines.append(f'const {ident} = require("../assets/{assets_subdir}/{filename}");')
            entries.append((key, ident, "raster"))
        else:
            raise ValueError(f"Unrecognized extension {ext} for {filename}")

    lines.append("")
    lines.append("export type LogoEntry =")
    lines.append('  | { kind: "svg"; Component: FC<SvgProps> }')
    lines.append('  | { kind: "raster"; source: number };')
    lines.append("")
    lines.append(f"export const {name.upper()}_LOGOS: Record<string, LogoEntry> = {{")
    for key, ident, kind in entries:
        if kind == "svg":
            lines.append(f'  "{key}": {{ kind: "svg", Component: {ident} }},')
        else:
            lines.append(f'  "{key}": {{ kind: "raster", source: {ident} }},')
    lines.append("};")
    lines.append("")

    out_path = f"src/lib/{name}LogoRegistry.ts"
    with open(out_path, "w") as f:
        f.write("\n".join(lines) + "\n")
    print(f"Generated {out_path} with {len(entries)} entries")

if __name__ == "__main__":
    main()
