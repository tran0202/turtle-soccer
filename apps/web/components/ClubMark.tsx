import { InitialsBadge } from "./InitialsBadge";
import clubLogos from "@/data/club-logos.json";

// Only add a club here once its logo's copyright/PD status has actually been
// verified (same rule as ORG_LOGOS in OrgMark.tsx). Everyone else falls back
// to the initials badge.
const CLUB_LOGOS: Record<string, { src: string }> = clubLogos;

// Club crests are roughly square/shield-shaped, not wide wordmarks like org
// logos — so unlike OrgMark/CompetitionMark/EditionMark's wide fixed boxes,
// this is a square box sized to match the cap-heights Flag.tsx uses at each
// tier, so a club logo sits at the same visual height a flag would have.
const SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-[34px] w-[34px]",
  xl: "h-[31px] w-[31px]",
} as const;

// InitialsBadge doesn't have an "xl" tier — falls back to its own "lg".
const BADGE_SIZE = {
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "lg",
} as const;

export function ClubMark({
  clubName,
  size = "md",
}: {
  clubName: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const logo = CLUB_LOGOS[clubName];

  if (!logo) {
    return <InitialsBadge name={clubName} size={BADGE_SIZE[size]} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center align-middle shrink-0 ${SIZE_CLASSES[size]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={clubName}
        className="max-h-full max-w-full object-contain"
      />
    </span>
  );
}
