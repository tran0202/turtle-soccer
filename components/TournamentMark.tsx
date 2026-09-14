import { InitialsBadge } from "./InitialsBadge";
import tournamentLogos from "@/data/tournament-logos.json";

// Only add a tournament here once its logo's copyright/PD status has
// actually been verified (same rule as ORG_LOGOS in OrgMark.tsx). Everyone
// else falls back to the initials badge.
const TOURNAMENT_LOGOS: Record<string, { src: string }> = tournamentLogos;

const SIZE_CLASSES = {
  sm: "h-10 w-32",
  md: "h-11 w-36",
  lg: "h-14 w-44",
} as const;

export function TournamentMark({
  tournamentId,
  tournamentName,
  size = "md",
}: {
  tournamentId: string;
  tournamentName: string;
  size?: "sm" | "md" | "lg";
}) {
  const logo = TOURNAMENT_LOGOS[tournamentId];

  if (!logo) {
    return <InitialsBadge name={tournamentName} size={size} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 ${SIZE_CLASSES[size]}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo.src}
        alt={tournamentName}
        className="max-h-full max-w-full object-contain"
      />
    </span>
  );
}
