// Read by react-native-svg-transformer (via @svgr/core's cosmiconfig lookup,
// which searches upward from each .svg file's folder) — so one file here
// covers every SVG under apps/mobile.
//
// Five fixes for SVGs that render fine in a browser but wrong in
// react-native-svg (or that the bundler can't even parse):
//
// 0. decodeCharacterReferences (svgr-plugins/decodeCharacterReferences.js) —
//    runs on the raw SVG text before SVGO sees it. SVGO's parser (sax >=
//    1.5.0) refuses any file with more than 512 entity references, which
//    fails the whole bundle with "Parsed entity count exceeds max entity
//    count". Illustrator-style exports hit this easily (&#10; and &#9; line
//    breaks and tabs inside path data). The plugin swaps numeric references
//    for the literal characters they stand for — lossless. See the file.
//
// 1. resolveGradientHrefs (svgo/resolveGradientHrefs.js) — gradients that
//    borrow their color stops from another gradient via href. React Native
//    doesn't follow that href, so shapes painted with such a gradient draw
//    nothing and the background (white) shows through. The plugin copies the
//    stops/inherited attributes in directly. See the file for details.
//
// 2. convertStyleToAttrs — an element can carry the same property twice,
//    e.g. fill="white" AND style="fill:#000037". CSS says the style wins, so
//    browsers show navy. react-native-svg does the opposite — attributes
//    override style — so the same file shows white. (Typical cause: a logo
//    exported white from Figma, then recolored in Inkscape, which writes the
//    new color to style but leaves the old fill attribute behind.) Converting
//    style declarations into attributes makes the style value the one that
//    survives.
//
//    ORDER MATTERS: this must come AFTER preset-default. That step's
//    inlineStyles folds <style>-block class rules into inline styles in the
//    right precedence order; convert before it and a class rule can end up
//    overriding an inline style it should lose to (this broke the AFA crest
//    when tried the other way round).
//
// 3. dropNoneReferences (svgo/dropNoneReferences.js) — editors often write
//    clip-path="none" / mask="none" / filter="none". That's the default and
//    changes nothing, but react-native-svg warns "Invalid `clipPath` prop,
//    expected a clipPath like "#id", but got: "none"" for each one. Drops
//    them (real url(#...) references are never touched).
//
// 3b. removeDanglingUse (svgo/removeDanglingUse.js) — SVGO's clean-up can
//    delete what a <use> points at (e.g. a <symbol> holding only an empty
//    <path d=""/>) and leave the <use> behind. It draws nothing either way,
//    but react-native-svg warns "`Use` element expected a pre-defined svg
//    template as `href` prop, template named: aJ is not defined" for each
//    one. Removes the dangling <use> elements; the picture is unchanged.
//
// 4. removeDimensions — some SVGs (e.g. the England FA crest) have fixed
//    width/height but no viewBox, so they can't scale to the box they're
//    given and only the top-left portion shows. This builds a viewBox from
//    the width/height when one is missing, then drops the fixed dimensions.
//
// NOTE: react-native-svg-transformer shallow-merges this over its own
// defaults, so `svgoConfig` AND `plugins` here REPLACE its defaults entirely.
// The preset-default overrides and the two named plugins below are copied
// from the transformer's own defaults, and need to stay in sync if you ever
// update that package.
const decodeCharacterReferences = require("./svgr-plugins/decodeCharacterReferences");
const resolveGradientHrefs = require("./svgo/resolveGradientHrefs");
const dropNoneReferences = require("./svgo/dropNoneReferences");
const removeDanglingUse = require("./svgo/removeDanglingUse");

module.exports = {
  // The transformer's default list is ["@svgr/plugin-svgo", "@svgr/plugin-jsx"];
  // ours adds one step in front, so the raw SVG is cleaned up before SVGO
  // parses it.
  plugins: [decodeCharacterReferences, "@svgr/plugin-svgo", "@svgr/plugin-jsx"],
  svgoConfig: {
    plugins: [
      // Runs first, while the file's gradients are still in their original
      // form, before preset-default's cleanup passes touch ids/defs.
      resolveGradientHrefs,
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
      // After preset-default — see note above.
      "convertStyleToAttrs",
      // After convertStyleToAttrs, so style="clip-path:none" is caught too.
      dropNoneReferences,
      // After preset-default, so it sees the tree once SVGO has finished
      // deleting things.
      removeDanglingUse,
      "removeDimensions",
    ],
  },
};
