export function Flag({
  code,
  label,
  size = "md",
}: {
  code: string;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "text-base" : size === "lg" ? "text-3xl" : "text-xl";

  return (
    <span
      className={`fi fi-${code} ${sizeClass} align-middle rounded-sm`}
      title={label}
      role={label ? "img" : undefined}
      aria-label={label}
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
  size?: "sm" | "md" | "lg";
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
