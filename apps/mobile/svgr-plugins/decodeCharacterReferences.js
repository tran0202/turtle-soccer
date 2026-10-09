/**
 * SVGR plugin (runs on the raw SVG text BEFORE SVGO parses it): replaces
 * numeric character references — &#10; &#9; &#x20; &#233; — with the literal
 * characters they stand for.
 *
 * Why: SVGO parses SVG with the `sax` library, and since sax 1.5.0 that
 * parser refuses any file with more than 512 entity references
 * ("Parsed entity count exceeds max entity count"), which fails the whole
 * bundle. Numeric references are the usual way to hit it: Illustrator-style
 * exports wrap long `points`/`d` attributes with &#10; and &#9; (newline and
 * tab), so one detailed logo can contain thousands of them. Decoding them is
 * lossless — a literal character means exactly what its reference did — and
 * the parser doesn't count literal characters.
 *
 * Deliberately NOT decoded:
 *   - & < > " '   — these must stay escaped or the markup breaks (the parser
 *                   also doesn't count these five, so they can't trigger the
 *                   limit).
 *   - characters XML 1.0 forbids (e.g. &#0;)
 *   - anything inside <!-- comments --> or <![CDATA[ ... ]]>, where &#10; is
 *     literal text rather than a reference.
 *
 * Only handles NUMERIC references. A file with >512 uses of custom named
 * entities (declared in its own <!DOCTYPE ... [ <!ENTITY ...> ]>) would still
 * hit the limit — not seen in practice, but that's where to look if it does.
 *
 * To use: list this FIRST in `plugins` in svgr.config.js (see there).
 */
const MUST_STAY_ESCAPED = new Set([0x26, 0x3c, 0x3e, 0x22, 0x27]); // & < > " '

// XML 1.0 "Char" production
const isLegalXmlChar = (cp) =>
  cp === 0x9 ||
  cp === 0xa ||
  cp === 0xd ||
  (cp >= 0x20 && cp <= 0xd7ff) ||
  (cp >= 0xe000 && cp <= 0xfffd) ||
  (cp >= 0x10000 && cp <= 0x10ffff);

// Group 1 = a comment or CDATA block (left untouched); group 2 = a numeric reference.
const TOKEN = /(<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>)|&#([xX][0-9a-fA-F]+|[0-9]+);/g;

function decodeCharacterReferences(svg /* , config, state */) {
  return svg.replace(TOKEN, (match, protectedBlock, ref) => {
    if (protectedBlock) return match;
    const cp = /^[xX]/.test(ref) ? parseInt(ref.slice(1), 16) : parseInt(ref, 10);
    if (!Number.isFinite(cp) || MUST_STAY_ESCAPED.has(cp) || !isLegalXmlChar(cp)) return match;
    return String.fromCodePoint(cp);
  });
}

module.exports = decodeCharacterReferences;
