/**
 * Custom SVGO plugin: resolves gradient `href` inheritance at bundle time.
 *
 * Browsers let a gradient pull its color stops (and some of its settings)
 * from another gradient:
 *
 *   <linearGradient id="a">  <stop .../> <stop .../>  </linearGradient>
 *   <linearGradient id="b" xlink:href="#a" x1="0" x2="1"/>   <!-- no stops of its own -->
 *   <path fill="url(#b)"/>
 *
 * react-native-svg doesn't follow that href, so "b" has no stops and
 * anything painted with it draws nothing — the background shows through,
 * usually white. Inkscape-exported logos and coat-of-arms flags do this a lot.
 *
 * This copies the stops (and the attributes the SVG spec says are inherited)
 * directly into each gradient and drops the href, which renders identically
 * in a browser and works in react-native-svg. Source files are never touched;
 * this only runs on the copy the bundler processes.
 *
 * Per the SVG spec, a gradient with an href inherits from the one it points
 * to (following chains):
 *   - its color stops, if it has none of its own
 *   - gradientUnits, gradientTransform, spreadMethod
 *   - the geometry attributes — but only from a gradient of the SAME type
 *     (x1/y1/x2/y2 for linear; cx/cy/r/fx/fy/fr for radial)
 * Anything the gradient sets itself wins over what it would inherit.
 */
const GRADIENTS = new Set(["linearGradient", "radialGradient"]);
const SHARED_ATTRS = ["gradientUnits", "gradientTransform", "spreadMethod"];
const GEOMETRY_ATTRS = {
  linearGradient: ["x1", "y1", "x2", "y2"],
  radialGradient: ["cx", "cy", "r", "fx", "fy", "fr"],
};

const hrefOf = (node) => node.attributes["xlink:href"] ?? node.attributes.href;
const targetId = (href) => (typeof href === "string" && href.startsWith("#") ? href.slice(1) : null);
const isStop = (n) => n.type === "element" && n.name === "stop";
// XAST nodes are plain data (no parent pointers), so this is a safe deep copy.
const clone = (n) => JSON.parse(JSON.stringify(n));

module.exports = {
  name: "resolveGradientHrefs",
  fn: () => ({
    root: {
      enter(root) {
        const byId = new Map();
        (function collect(n) {
          if (n.type === "element" && GRADIENTS.has(n.name) && n.attributes.id) {
            byId.set(n.attributes.id, n);
          }
          (n.children || []).forEach(collect);
        })(root);

        const done = new Set();

        function resolve(node, chain) {
          if (done.has(node)) return;
          const id = targetId(hrefOf(node));
          const target = id ? byId.get(id) : null;

          // Not a gradient href (e.g. points at a pattern) or a broken
          // reference: leave it exactly as it was.
          if (!target) {
            done.add(node);
            return;
          }

          // A cycle (a -> b -> a) can't be resolved; drop the href so it
          // can't cause trouble, and keep whatever the node already has.
          if (chain.has(target)) {
            delete node.attributes["xlink:href"];
            delete node.attributes.href;
            done.add(node);
            return;
          }

          chain.add(node);
          resolve(target, chain); // make sure the target is fully resolved first
          chain.delete(node);

          for (const attr of SHARED_ATTRS) {
            if (node.attributes[attr] === undefined && target.attributes[attr] !== undefined) {
              node.attributes[attr] = target.attributes[attr];
            }
          }
          if (target.name === node.name) {
            for (const attr of GEOMETRY_ATTRS[node.name]) {
              if (node.attributes[attr] === undefined && target.attributes[attr] !== undefined) {
                node.attributes[attr] = target.attributes[attr];
              }
            }
          }

          if (!node.children.some(isStop)) {
            const stops = target.children.filter(isStop).map(clone);
            node.children.push(...stops);
          }

          delete node.attributes["xlink:href"];
          delete node.attributes.href;
          done.add(node);
        }

        for (const node of byId.values()) resolve(node, new Set());
      },
    },
  }),
};
