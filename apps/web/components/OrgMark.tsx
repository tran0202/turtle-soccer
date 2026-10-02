import { InitialsBadge } from "./InitialsBadge";
import orgLogos from "@/data/org-logos.json";

// Only add an org here once its logo's copyright/PD status has actually been
// verified — see conversation history. Everyone else falls back to the
// initials badge rather than risking an unverified crest.
// Works with any image format (svg, png, jpg, webp...) — the extension in
// "src" is all that matters.
const ORG_LOGOS: Record<string, { src: string }> = orgLogos;

// Fixed box per size, not just a fixed height. Logos have different aspect
// ratios — FIFA and AFC's wordmarks are roughly 3:1, while UEFA and CONMEBOL's
// are close to square — so height-only sizing makes each logo a wildly
// different rendered width. A fixed box + object-contain keeps every logo's
// footprint closer together: the box is 1.75:1, wide enough that a square
// logo still renders at full height, but narrow enough that a 3:1 wordmark
// gets width-constrained and shrinks (both dimensions) to fit, rather than
// rendering three times as wide as everything else at the same height.
const SIZE_CLASSES = {
  sm: "h-[100px] w-[175px]",
  // A proportional box (1/3 of its row, with height derived from the same
  // 1.75:1 ratio via aspect-ratio) rather than a fixed pixel box — scales
  // down naturally on narrow screens instead of staying a fixed size that's
  // too wide relative to the viewport, while still looking proportionate on
  // wide screens since it's always relative to its own row's width.
  md: "w-1/3 aspect-[1.75]",
  lg: "h-[125px] w-[220px]",
  // Narrower box for compact grids (e.g. the 2-column cards on an org's own
  // page) where excess box width crowds out the name text next to it.
  card: "w-1/3 aspect-[1.75]",
} as const;

// InitialsBadge doesn't know about "card" — it's a box-width concern specific
// to this component, not a badge-text-size concern, so the fallback badge
// just renders at "sm".
const BADGE_SIZE = {
  sm: "sm",
  md: "md",
  lg: "lg",
  card: "sm",
} as const;

export function OrgMark({
  orgId,
  orgName,
  size = "md",
}: {
  orgId: string;
  orgName: string;
  size?: "sm" | "md" | "lg" | "card";
}) {
  const logo = ORG_LOGOS[orgId];

  if (!logo) {
    return <InitialsBadge name={orgName} size={BADGE_SIZE[size]} />;
  }

  // Plain <img>, not next/image: these are already-vector local assets with
  // nothing to gain from the image optimizer, which also avoids a Next.js
  // gotcha where contentDispositionType:"attachment" (required to allow SVGs
  // through next/image at all) makes some browsers refuse to render them inline.
  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${SIZE_CLASSES[size]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={orgName}
        className="max-h-full max-w-full object-contain"
      />
    </span>
  );
}
