/**
 * Custom SVGO plugin: removes clip-path / mask / filter attributes whose
 * value is "none".
 *
 * In SVG, "none" is the default for all three, and none of them are
 * inherited, so an explicit `clip-path="none"` changes nothing. But
 * react-native-svg only understands these props as a reference to an id
 * ("#id" / "url(#id)"). Given "none" it prints a dev-mode warning —
 *
 *   WARN  Invalid `clipPath` prop, expected a clipPath like "#id", but got: "none"
 *
 * — and then ignores the value, which is the correct result, just noisy.
 * Editors (Inkscape, Illustrator) emit these attributes freely, so removing
 * them here keeps the console clean without touching how anything renders.
 *
 * Real references (url(#...)) are never touched. Place this AFTER
 * convertStyleToAttrs in svgr.config.js, so a style="clip-path:none" has
 * already become an attribute by the time this runs.
 */
const PROPS = ["clip-path", "mask", "filter"];

module.exports = {
  name: "dropNoneReferences",
  fn: () => ({
    element: {
      enter(node) {
        for (const prop of PROPS) {
          if (typeof node.attributes[prop] === "string" && node.attributes[prop].trim() === "none") {
            delete node.attributes[prop];
          }
        }
      },
    },
  }),
};
