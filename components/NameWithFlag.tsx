import { getCountryCode } from "@/lib/countries";
import { getClubCountryCode } from "@/lib/clubs";
import { Flag, FLAG_SIZE_PX } from "./Flag";
import { ClubMark } from "./ClubMark";

export function NameWithFlag({
  name,
  isCountry,
  size = "md",
  nameMaxWidth = "10rem",
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
}) {
  if (isCountry) {
    const code = getCountryCode(name);
    if (!code) return <>{name}</>;

    return (
      <span className="inline-flex items-center align-middle gap-2">
        <Flag code={code} label={name} size={size} />
        {name}
      </span>
    );
  }

  const countryCode = getClubCountryCode(name);
  if (!countryCode) return <>{name}</>;

  return (
    <span className="inline-flex items-center gap-1.5">
      <ClubMark clubName={name} size={size} />
      <span style={{ maxWidth: nameMaxWidth }}>
        {name}{" "}
        <Flag
          code={countryCode}
          label={name}
          heightPx={FLAG_SIZE_PX[size] / 2}
        />
      </span>
    </span>
  );
}
