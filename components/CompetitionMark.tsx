import { InitialsBadge } from "./InitialsBadge";
import competitionLogos from "@/data/competition-logos.json";

// Only add a competition here once its logo's copyright/PD status has
// actually been verified (same rule as ORG_LOGOS in OrgMark.tsx). Everyone
// else falls back to the initials badge.
const COMPETITION_LOGOS: Record<string, { src: string }> = competitionLogos;

const SIZE_CLASSES = {
  sm: "h-[100px] w-[320px]",
  md: "h-[100px] w-[320px]",
  lg: "h-[125px] w-[400px]",
  // Narrower box for compact grids (e.g. the 2-column cards on an org's own
  // page). No competition currently has a verified working logo file, so
  // there's no wide-wordmark aspect ratio to preserve room for here.
  card: "h-20 w-40",
} as const;

const BADGE_SIZE = {
  sm: "sm",
  md: "md",
  lg: "lg",
  card: "sm",
} as const;

export function CompetitionMark({
  competitionId,
  competitionName,
  size = "md",
}: {
  competitionId: string;
  competitionName: string;
  size?: "sm" | "md" | "lg" | "card";
}) {
  const logo = COMPETITION_LOGOS[competitionId];

  if (!logo) {
    return <InitialsBadge name={competitionName} size={BADGE_SIZE[size]} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${SIZE_CLASSES[size]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={competitionName}
        className="max-h-full max-w-full object-contain"
      />
    </span>
  );
}
