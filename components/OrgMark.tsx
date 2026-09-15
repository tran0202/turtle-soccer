import { InitialsBadge } from "./InitialsBadge";
import orgLogos from "@/data/org-logos.json";

// Only add an org here once its logo's copyright/PD status has actually been
// verified — see conversation history. Everyone else falls back to the
// initials badge rather than risking an unverified crest.
// Works with any image format (svg, png, jpg, webp...) — the extension in
// "src" is all that matters.
const ORG_LOGOS: Record<string, { src: string }> = orgLogos;

// Fixed box per size, not just a fixed height. Logos have different aspect
// ratios (FIFA's wordmark is much wider than UEFA's), so height-only sizing
// makes each logo a different rendered width, throwing off where the text
// next to it starts. A fixed-width box + object-contain keeps that consistent
// regardless of each logo's shape. Width is sized to fit FIFA's ~3:1 wordmark
// at each height without shrinking.
const SIZE_CLASSES = {
  sm: "h-20 w-64",
  md: "h-[5.5rem] w-72",
  lg: "h-28 w-[22rem]",
} as const;

export function OrgMark({
  orgId,
  orgName,
  size = "md",
}: {
  orgId: string;
  orgName: string;
  size?: "sm" | "md" | "lg";
}) {
  const logo = ORG_LOGOS[orgId];

  if (!logo) {
    return <InitialsBadge name={orgName} size={size} />;
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
