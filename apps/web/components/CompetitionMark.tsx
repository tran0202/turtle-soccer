import { InitialsBadge } from "./InitialsBadge";
import competitionLogos from "@/data/competition-logos.json";

// Only add a competition here once its logo's copyright/PD status has
// actually been verified (same rule as ORG_LOGOS in OrgMark.tsx). Everyone
// else falls back to the initials badge.
const COMPETITION_LOGOS: Record<string, { src: string }> = competitionLogos;

// Most competition logos are now real photos of trophies (tall, narrow
// objects — ratios from 0.42 for Copa Libertadores' trophy to 0.80 for the
// Club World Cup's), not wide wordmarks, so these boxes are biased portrait
// (~0.7:1) to fit the majority of that content, rather than the wide 3.2:1
// box used elsewhere for actual wordmark logos (OrgMark, and the one
// landscape outlier here, the Premier League logo, will render narrower
// than full box width as a result — an acceptable trade-off for fitting
// most of the content well instead of a little of it).
const SIZE_CLASSES = {
  sm: "h-[100px] w-[70px]",
  md: "h-[100px] w-[70px]",
  lg: "h-[125px] w-[88px]",
  // Narrower box for compact grids (e.g. the 2-column cards on an org's own
  // page). No competition currently has a verified working logo file, so
  // there's no wide-wordmark aspect ratio to preserve room for here. A
  // proportional box (1/3 of its row, height derived via aspect-ratio)
  // rather than a fixed pixel box, at every screen width.
  card: "w-1/3 aspect-[2]",
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
