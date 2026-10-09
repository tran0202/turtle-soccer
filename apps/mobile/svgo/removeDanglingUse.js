/**
 * Custom SVGO plugin: removes <use> elements whose target no longer exists.
 *
 * Why: SVGO's own clean-up can delete the thing a <use> points at, but leave the
 * <use> behind. The classic case: a <symbol> whose only content is an empty
 * <path d=""/> (editors export these). removeHiddenElems deletes the empty path,
 * removeEmptyContainers then deletes the now-empty <symbol>, and every <use> of
 * that symbol is left dangling.
 *
 * In a browser a <use> of a missing (or empty) target draws nothing, so deleting
 * it changes nothing visible. But react-native-svg's native side logs a warning
 * for each one:
 *
 *   WARN  `Use` element expected a pre-defined svg template as `href` prop,
 *         template named: aJ is not defined.
 *
 * Removing the dangling <use> elements silences those warnings and doesn't alter
 * the picture.
 *
 * Only same-document references ("#id") are considered; a <use> pointing at an
 * external file is left alone. Place this AFTER preset-default in svgr.config.js,
 * so it sees the tree after SVGO has finished deleting things.
 */
const hrefOf = (node) => node.attributes["xlink:href"] ?? node.attributes.href;

module.exports = {
  name: "removeDanglingUse",
  fn: () => ({
    root: {
      enter(root) {
        const ids = new Set();
        (function collect(n) {
          if (n.type === "element" && typeof n.attributes.id === "string") ids.add(n.attributes.id);
          (n.children || []).forEach(collect);
        })(root);

        (function prune(n) {
          if (!n.children) return;
          n.children = n.children.filter((child) => {
            if (child.type === "element" && child.name === "use") {
              const href = hrefOf(child);
              if (typeof href === "string" && href.startsWith("#") && !ids.has(href.slice(1))) return false;
            }
            return true;
          });
          n.children.forEach(prune);
        })(root);
      },
    },
  }),
};
