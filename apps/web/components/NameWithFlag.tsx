import { getCountryCode, getClubCountryCode, getClubCode } from "@turtle-soccer/core";
import { Flag, FLAG_SIZE_PX } from "./Flag";
import { ClubMark } from "./ClubMark";

export function NameWithFlag({
  name,
  isCountry,
  size = "md",
  nameMaxWidth = "10rem",
  compact = false,
}: {
  name: string;
  isCountry: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  // Different call sites have very different actual available width (a
  // narrow edition-table cell vs. a wide winner-place box on the edition
  // detail page) — a single fixed cap wraps too early in wide contexts and
  // overflows in narrow ones, so each caller can size this for its own
  // container instead of NameWithFlag guessing.
  nameMaxWidth?: string;
  // For layouts too narrow for the full inline treatment (e.g. mobile
  // edition-table rows). For a country: flag on top, 3-letter code below. For
  // a club: the same elements the regular (non-compact) club view uses —
  // crest, a short 3-letter club code (see lib/clubs.ts), and small country
  // flag — consistent with how a country shows a 3-letter code here too,
  // rather than reducing to just a country flag/code and losing the club's
  // own identity.
  compact?: boolean;
}) {
  const code = isCountry ? getCountryCode(name) : getClubCountryCode(name);

  if (compact) {
    if (!code) return <>{name}</>;

    if (!isCountry) {
      const clubCode = getClubCode(name);
      return (
        <span className="inline-flex flex-col items-center gap-0.5">
          <ClubMark clubName={name} size={size} />
          <span className="font-display text-xl uppercase tracking-wide text-current">
            {clubCode ?? name}
          </span>
          <Flag code={code} label={name} heightPx={FLAG_SIZE_PX[size] / 2} />
        </span>
      );
    }

    return (
      <span className="inline-flex flex-col items-center gap-0.5">
        <Flag code={code} label={name} size={size} />
        {/* text-current: inherits whatever color the caller applies (e.g.
            text-turtle-blue for a champion), matching how the full-name mode
            is colored externally rather than taking a color prop itself. */}
        <span className="font-display text-xl uppercase tracking-wide text-current">
          {code}
        </span>
      </span>
    );
  }

  if (isCountry) {
    if (!code) return <>{name}</>;

    return (
      <span className="inline-flex items-center align-middle gap-2">
        <Flag code={code} label={name} size={size} />
        {name}
      </span>
    );
  }

  if (!code) return <>{name}</>;

  return (
    <span className="inline-flex items-center gap-1.5">
      <ClubMark clubName={name} size={size} />
      <span style={{ maxWidth: nameMaxWidth }}>
        {name}{" "}
        <Flag code={code} label={name} heightPx={FLAG_SIZE_PX[size] / 2} />
      </span>
    </span>
  );
}
