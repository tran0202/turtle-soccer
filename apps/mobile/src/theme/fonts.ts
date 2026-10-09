import { useFonts } from "expo-font";

// The same two families as the web app (apps/web/app/layout.tsx), at the same
// weights:
//   display  Big Shoulders Inline Display   600 / 700 / 800
//   body     Source Serif 4                 400 / 500 / 600
//
// Each face is required from its own file instead of the package root: the
// root index requires EVERY weight (about 6.7 MB for these two packages) and
// Metro can't drop the unused ones, whereas these six add about 1.4 MB.
export type FontKind = "display" | "body";

const FONT_FILES = {
  "Display-600": require("@expo-google-fonts/big-shoulders-inline-display/BigShouldersInlineDisplay_600SemiBold.ttf"),
  "Display-700": require("@expo-google-fonts/big-shoulders-inline-display/BigShouldersInlineDisplay_700Bold.ttf"),
  "Display-800": require("@expo-google-fonts/big-shoulders-inline-display/BigShouldersInlineDisplay_800ExtraBold.ttf"),
  "Body-400": require("@expo-google-fonts/source-serif-4/400Regular/SourceSerif4_400Regular.ttf"),
  "Body-500": require("@expo-google-fonts/source-serif-4/500Medium/SourceSerif4_500Medium.ttf"),
  "Body-600": require("@expo-google-fonts/source-serif-4/600SemiBold/SourceSerif4_600SemiBold.ttf"),
};

const AVAILABLE: Record<FontKind, number[]> = {
  display: [600, 700, 800],
  body: [400, 500, 600],
};

function numericWeight(weight: unknown): number {
  if (weight === undefined || weight === null || weight === "normal") return 400;
  if (weight === "bold") return 700;
  const n = Number(weight);
  return Number.isFinite(n) && n >= 1 && n <= 1000 ? n : 400;
}

// Browsers pick the nearest weight a font actually has (CSS Fonts 4), and the
// web app relies on that: it loads Source Serif 4 only up to 600, so a
// font-bold there renders at 600. This repeats that rule so the same style
// resolves to the same face on mobile.
export function pickWeight(desired: number, available: number[]): number {
  if (available.includes(desired)) return desired;
  const asc = [...available].sort((a, b) => a - b);
  const above = (w: number) => asc.filter((a) => a > w);
  const below = (w: number) => asc.filter((a) => a < w).reverse();
  let order: number[];
  if (desired >= 400 && desired <= 500) {
    order = [...asc.filter((a) => a >= desired && a <= 500), ...below(desired), ...above(500)];
  } else if (desired < 400) {
    order = [...below(desired), ...above(desired)];
  } else {
    order = [...above(desired), ...below(desired)];
  }
  return order[0];
}

export function resolveFontFamily(kind: FontKind, weight?: unknown): string {
  const picked = pickWeight(numericWeight(weight), AVAILABLE[kind]);
  return `${kind === "display" ? "Display" : "Body"}-${picked}`;
}

export function useAppFonts() {
  return useFonts(FONT_FILES);
}
