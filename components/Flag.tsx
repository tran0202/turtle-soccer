export const FLAG_SIZE_PX = {
  sm: 16,
  md: 20,
  lg: 34,
  // Matches the cap-height of an uppercase font-display heading at text-4xl
  // (36px font-size), used next to Champion/Runner-up/Third-place names.
  // Scaled proportionally (26 * 36/30) from the value empirically tuned
  // against the previous text-3xl (30px) heading size.
  xl: 31,
} as const;

export function Flag({
  code,
  label,
  size = "md",
  heightPx,
}: {
  code: string;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  // Overrides the named size with an exact pixel height — used when a flag
  // needs to sit at a fraction of one of the named sizes (e.g. half-size,
  // next to a club's own logo) rather than one of the four fixed tiers.
  heightPx?: number;
}) {
  const height = heightPx ?? FLAG_SIZE_PX[size];
  const width = Math.round((height * 4) / 3);
  // Nepal is the one national flag that isn't rectangular (a double pennant
  // shape), so its source file has transparent space to the right within the
  // standard 4:3 canvas that every other flag fills edge-to-edge. A border
  // around the full box would visibly outline that empty space, which no
  // other flag shows, so it's skipped for this one specifically.
  const showBorder = code !== "NEP";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${code}.svg`}
      alt={label ?? ""}
      role={label ? "img" : "presentation"}
      title={label}
      width={width}
      height={height}
      className={`inline-block align-middle object-cover ${
        showBorder ? "border border-ink/15" : ""
      }`}
      style={{ width, height }}
    />
  );
}

export function FlagGroup({
  codes,
  label,
  size = "md",
}: {
  codes: string[];
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {codes.map((code) => (
        <Flag key={code} code={code} size={size} />
      ))}
      {label && <span>{label}</span>}
    </span>
  );
}
