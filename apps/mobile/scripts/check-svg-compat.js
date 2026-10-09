#!/usr/bin/env node
/**
 * Finds SVGs that react-native-svg is likely to render wrongly on a phone
 * (colors dropping out to white, parts missing, cropped images) even though
 * they look fine in a browser.
 *
 * It runs each SVG through the SAME processing the app's bundler does
 * (react-native-svg-transformer -> @svgr/core + SVGO, using your
 * svgr.config.js), then inspects the result — so it reports what actually
 * reaches the device, not just what's in the source file.
 *
 * By default it checks only the SVGs the app really bundles (the ones
 * imported by src/lib/*Registry.ts), so unused leftover files don't add
 * noise. Pass --all to check every .svg under src/assets instead.
 *
 * Usage (from apps/mobile/):
 *     node scripts/check-svg-compat.js
 *     node scripts/check-svg-compat.js --all
 *
 * Needs `yarn install` to have been run (it uses @svgr/core, which comes
 * with react-native-svg-transformer).
 */
const fs = require("fs");
const path = require("path");

const mobileRoot = path.resolve(__dirname, "..");
const assetsDir = path.join(mobileRoot, "src", "assets");
const libDir = path.join(mobileRoot, "src", "lib");
const scanAll = process.argv.includes("--all");

let svgr;
try {
  svgr = require("@svgr/core");
} catch (e) {
  console.error(
    "Couldn't load @svgr/core. Run `yarn install` from the repo root first " +
      "(it ships with react-native-svg-transformer), then re-run this."
  );
  process.exit(1);
}

// Same defaults react-native-svg-transformer uses, merged the same way it
// merges a project's svgr.config.js (shallow — a config's svgoConfig
// replaces the default one entirely).
const defaultSVGRConfig = {
  native: true,
  plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            inlineStyles: { onlyMatchedOnce: false },
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
            convertColors: false,
          },
        },
      },
    ],
  },
};

let userConfig = {};
const configPath = path.join(mobileRoot, "svgr.config.js");
if (fs.existsSync(configPath)) {
  userConfig = require(configPath);
} else {
  console.warn(
    "Note: no svgr.config.js found in apps/mobile — checking against the " +
      "transformer's defaults only (SVGs without a viewBox will show as cropped).\n"
  );
}
const config = { ...defaultSVGRConfig, ...userConfig };

// ---- which files to check -------------------------------------------------

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p, out);
    else if (name.toLowerCase().endsWith(".svg")) out.push(p);
  }
  return out;
}

function bundledFromRegistries() {
  const files = new Set();
  if (!fs.existsSync(libDir)) return files;
  for (const f of fs.readdirSync(libDir)) {
    if (!/Registry\.ts$/.test(f)) continue;
    const src = fs.readFileSync(path.join(libDir, f), "utf8");
    for (const re of [
      /from\s+"(\.\.\/assets\/[^"]+\.svg)"/g,
      /require\(\s*"(\.\.\/assets\/[^"]+\.svg)"\s*\)/g,
    ]) {
      let m;
      while ((m = re.exec(src))) files.add(path.resolve(libDir, m[1]));
    }
  }
  return files;
}

// ---- what to look for in the processed output ------------------------------

function analyze(out, src) {
  const wrong = []; // likely to render with wrong/missing colors or shapes
  const check = []; // may differ from the browser — worth eyeballing on device
  const count = (re) => (out.match(re) || []).length;

  const rootMatch = out.match(/<Svg[\s\S]*?>/);
  if (!rootMatch || !/viewBox=/.test(rootMatch[0])) {
    wrong.push("no viewBox — will show cropped to the top-left corner");
  }

  // Gradients that get their colors from ANOTHER gradient via href and have
  // no color stops of their own. react-native-svg doesn't follow the href,
  // so anything painted with one draws nothing (the background shows
  // through, typically white).
  const gradRe = /<(Linear|Radial)Gradient\b([^>]*?)(\/>|>([\s\S]*?)<\/\1Gradient>)/g;
  const stopless = [];
  let g;
  while ((g = gradRe.exec(out))) {
    const attrs = g[2];
    const body = g[4] || "";
    const id = (attrs.match(/\bid="([^"]+)"/) || [])[1];
    if (id && /href/i.test(attrs) && !/<Stop\b/.test(body)) stopless.push(id);
  }
  const usedStopless = stopless.filter((id) =>
    new RegExp(`url\\(#${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\)`).test(out)
  );
  if (usedStopless.length) {
    wrong.push(
      `${usedStopless.length} gradient(s) borrow their colors via href (unsupported) — ` +
        "shapes painted with them will go transparent/white"
    );
  }

  // The same property set twice on one element — e.g. fill="white" AND
  // style={{ fill: "#000037" }}. CSS says the style wins, so a browser shows
  // navy; react-native-svg does the opposite (attributes override style), so
  // the phone shows white. Typically left behind when a logo exported in one
  // color is recolored in an editor that writes to style but keeps the old
  // attribute. svgr.config.js's convertStyleToAttrs step resolves these; this
  // flags any that still get through.
  const conflicts = [];
  const tagRe = /<([A-Z]\w*)\b([\s\S]*?)\/?>/g;
  let t;
  while ((t = tagRe.exec(out))) {
    const attrs = t[2];
    const styleMatch = attrs.match(/style=\{\{([\s\S]*?)\}\}/);
    if (!styleMatch) continue;
    const styleKeys = [...styleMatch[1].matchAll(/(?:^|,)\s*(\w+)\s*:/g)].map((m) => m[1]);
    const attrNames = [...attrs.replace(styleMatch[0], "").matchAll(/\b([a-zA-Z]+)=/g)].map((m) => m[1]);
    const both = styleKeys.filter((k) => attrNames.includes(k));
    if (both.length) conflicts.push(both);
  }
  if (conflicts.length) {
    const props = [...new Set(conflicts.flat())].join(", ");
    wrong.push(
      `${conflicts.length} element(s) set ${props} as BOTH an attribute and a style — ` +
        "react-native-svg lets the attribute win (a browser lets the style win), so colors will differ"
    );
  }

  if (count(/mixBlendMode/g)) {
    wrong.push(`${count(/mixBlendMode/g)}x mix-blend-mode (unsupported — colors blend wrongly)`);
  }
  // Leftover class names only matter if the source actually defined CSS for
  // them (a <style> block the bundler failed to inline). Many files carry
  // class="..." attributes that are never defined anywhere — harmless, since
  // the shapes already have explicit fill attributes — so don't flag those.
  const sourceHadStyles = /<style\b/i.test(src);
  if (sourceHadStyles && (count(/className=/g) || /<Style\b/.test(out))) {
    wrong.push("CSS from <style> left unresolved — those fills won't apply");
  }

  // A <use> pointing at an id that no longer exists. SVGO can delete the target
  // (e.g. a <symbol> holding only an empty <path d="">) and leave the <use>
  // behind. It draws nothing either way, but react-native-svg logs
  //   "`Use` element expected a pre-defined svg template ... template named: X
  //    is not defined"
  // for each one. svgo/removeDanglingUse.js (wired in svgr.config.js) removes
  // them, so this should never fire; it's here to catch it if that step is lost.
  const useRefs = [...out.matchAll(/<Use\b[^>]*?(?:xlinkHref|href)="#([^"]+)"/g)].map((m) => m[1]);
  const definedIds = new Set([...out.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
  const dangling = [...new Set(useRefs.filter((r) => !definedIds.has(r)))];
  if (dangling.length) {
    check.push(`${dangling.length} <use> point at ids that don't exist (${dangling.slice(0, 4).join(", ")}) — logs "template … is not defined" warnings`);
  }

  if (count(/<Mask\b/g)) check.push(`${count(/<Mask\b/g)}x <Mask> (luminance masks can render inconsistently)`);
  if (count(/<Filter\b/g)) check.push(`${count(/<Filter\b/g)}x <Filter> (blurs/shadows often missing)`);
  if (count(/<Image\b/g)) check.push(`${count(/<Image\b/g)}x embedded <Image>`);

  return { wrong, check };
}

// ---- run -------------------------------------------------------------------

(async () => {
  const bundled = scanAll ? new Set(walk(assetsDir)) : bundledFromRegistries();
  const files = [...bundled].sort();

  if (!files.length) {
    console.error(
      scanAll
        ? "No .svg files found under src/assets."
        : "No registries found in src/lib — run with --all to scan src/assets instead."
    );
    process.exit(1);
  }

  const rel = (p) => path.relative(assetsDir, p);
  const wrongList = [];
  const checkList = [];
  const missingList = [];
  const errorList = [];
  let clean = 0;

  for (const file of files) {
    if (!fs.existsSync(file)) {
      missingList.push(rel(file));
      continue;
    }
    try {
      const src = fs.readFileSync(file, "utf8");
      const out = await svgr.transform(src, config);
      const { wrong, check } = analyze(out, src);
      if (wrong.length) wrongList.push([rel(file), wrong, check]);
      else if (check.length) checkList.push([rel(file), check]);
      else clean++;
    } catch (e) {
      errorList.push([rel(file), String(e.message).split("\n")[0]]);
    }
  }

  console.log(
    `Checked ${files.length} SVG(s) ${scanAll ? "under src/assets" : "bundled by the app's registries"}\n`
  );

  if (wrongList.length) {
    console.log(`LIKELY WRONG ON DEVICE (${wrongList.length})`);
    for (const [f, wrong, check] of wrongList) {
      console.log(`  ${f}`);
      wrong.forEach((w) => console.log(`      ! ${w}`));
      check.forEach((c) => console.log(`      ? ${c}`));
    }
    console.log();
  }
  if (checkList.length) {
    console.log(`CHECK ON DEVICE — may differ from the browser (${checkList.length})`);
    for (const [f, check] of checkList) {
      console.log(`  ${f}`);
      check.forEach((c) => console.log(`      ? ${c}`));
    }
    console.log();
  }
  if (missingList.length) {
    console.log(`REFERENCED BUT MISSING ON DISK (${missingList.length}) — bundling will fail`);
    missingList.forEach((f) => console.log(`  ${f}`));
    console.log();
  }
  if (errorList.length) {
    console.log(`COULDN'T BE PROCESSED (${errorList.length})`);
    errorList.forEach(([f, e]) => console.log(`  ${f}\n      ${e}`));
    console.log();
  }
  console.log(`Clean: ${clean}`);
})();
