import { getCountryCode } from "@/lib/countries";
import { Flag } from "./Flag";

export function NameWithFlag({
  name,
  isCountry,
  size = "md",
}: {
  name: string;
  isCountry: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const code = isCountry ? getCountryCode(name) : undefined;

  if (!code) return <>{name}</>;

  return (
    <span className="inline-flex items-center gap-2">
      <Flag code={code} label={name} size={size} />
      {name}
    </span>
  );
}
