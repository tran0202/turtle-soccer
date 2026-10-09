import { View, StyleSheet } from "react-native";
import { AppText as Text } from "./AppText";

// Identical palette, hash, and initials logic to the web app's
// InitialsBadge — kept in sync by hand so a given name always produces the
// same color/initials on both platforms.
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
    return words[0].toUpperCase();
  }
  return words
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function InitialsBadge({
  name,
  width,
  height,
}: {
  name: string;
  width: number;
  height: number;
}) {
  const text = getBadgeText(name);
  const color = PALETTE[hashText(name) % PALETTE.length];

  return (
    <View
      style={[
        styles.badge,
        {
          width,
          height,
          borderColor: `${color}55`,
          backgroundColor: `${color}14`,
        },
      ]}
    >
      <Text
        style={[styles.text, { color, fontSize: Math.max(10, height * 0.32) }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
