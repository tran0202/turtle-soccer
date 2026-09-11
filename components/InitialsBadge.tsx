const PALETTE = [
  "#2B34DE", // turtle-blue
  "#1C8A4B", // turtle-green
  "#B45309", // amber-brown
  "#0F766E", // teal
  "#7C3AED", // violet
  "#475569", // slate
];

function hashText(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) % 100000;
  }
  return hash;
}

function getBadgeText(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    // Already a short acronym, e.g. FIFA, UEFA, CONMEBOL
    return words[0].toUpperCase();
  }
  // Multi-word name, e.g. "Premier League" -> "PL", "FIFA World Cup" -> "FWC"
  return words
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function InitialsBadge({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const text = getBadgeText(name);
  const color = PALETTE[hashText(name) % PALETTE.length];

  const sizeClasses =
    size === "sm"
      ? "text-[0.6rem] px-1.5 py-0.5"
      : size === "lg"
      ? "text-lg px-3 py-1.5"
      : "text-xs px-2 py-1";

  return (
    <span
      className={`inline-flex items-center justify-center font-display uppercase tracking-tight rounded-sm border shrink-0 ${sizeClasses}`}
      style={{
        color,
        borderColor: `${color}55`,
        backgroundColor: `${color}14`,
      }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}
