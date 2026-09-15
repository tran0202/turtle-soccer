import { InitialsBadge } from "./InitialsBadge";
import competitionLogos from "@/data/competition-logos.json";

// Only add a competition here once its logo's copyright/PD status has
// actually been verified (same rule as ORG_LOGOS in OrgMark.tsx). Everyone
// else falls back to the initials badge.
const COMPETITION_LOGOS: Record<string, { src: string }> = competitionLogos;

const SIZE_CLASSES = {
  sm: "h-20 w-64",
  md: "h-[5.5rem] w-72",
  lg: "h-28 w-[22rem]",
} as const;

export function CompetitionMark({
  competitionId,
  competitionName,
  size = "md",
}: {
  competitionId: string;
  competitionName: string;
  size?: "sm" | "md" | "lg";
}) {
  const logo = COMPETITION_LOGOS[competitionId];

  if (!logo) {
    return <InitialsBadge name={competitionName} size={size} />;
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
