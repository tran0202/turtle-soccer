import { InitialsBadge } from "./InitialsBadge";
import editionLogos from "@/data/edition-logos.json";

// Only add an edition here once its logo's copyright/PD status has actually
// been verified (same rule as ORG_LOGOS in OrgMark.tsx and COMPETITION_LOGOS
// in CompetitionMark.tsx). Everyone else falls back to the initials badge.
const EDITION_LOGOS: Record<string, { src: string }> = editionLogos;

// Unlike OrgMark/CompetitionMark, these logos are mostly portrait-oriented
// tournament emblems (the 2022 World Cup logo is roughly 0.8:1, Euro 2024
// roughly 0.76:1) rather than wide wordmarks, so a near-square box fits
// actual content far better than a wide one — a wide box here just leaves
// a lot of empty space on either side of a narrow, tall logo.
const SIZE_CLASSES = {
  sm: "h-[70px] w-[70px]",
  md: "h-[100px] w-[100px]",
  lg: "h-[125px] w-[125px]",
} as const;

export function EditionMark({
  editionId,
  editionLabel,
  size = "md",
}: {
  editionId: string;
  editionLabel: string;
  size?: "sm" | "md" | "lg";
}) {
  const logo = EDITION_LOGOS[editionId];

  if (!logo) {
    return <InitialsBadge name={editionLabel} size={size} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${SIZE_CLASSES[size]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={editionLabel}
        className="max-h-full max-w-full object-contain"
      />
    </span>
  );
}
