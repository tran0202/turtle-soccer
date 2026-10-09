import { Pressable, View, StyleSheet } from "react-native";
import { AppText as Text } from "./AppText";
import type { Edition } from "@turtle-soccer/core";
import { LogoMark } from "./LogoMark";
import { ResultChip } from "./ResultChip";
import { PlaceIcon } from "./PlaceIcon";
import { EDITION_LOGOS } from "../lib/editionLogoRegistry";
import { getEditionPlaces } from "../lib/editionPlaces";

// Same colors as the web's edition rows: champion blue, runner-up green,
// third gray, fourth lighter gray (or the same gray as third when the two are
// unranked), and a faint dash where a slot is empty.
const BLUE = "#2B34DE";
const GREEN = "#1C8A4B";
const INK_60 = "#171A2199";
const INK_40 = "#171A2166";
const INK_30 = "#171A214D";

// One edition on a competition page, laid out like the web app's narrow-screen
// row: edition logo and year on the left, then four equal cells for champion,
// runner-up, third and fourth.
export function EditionResultRow({
  edition,
  isCountry,
  onPress,
}: {
  edition: Edition;
  isCountry: boolean;
  onPress: () => void;
}) {
  const { third, fourth, unranked } = getEditionPlaces(edition);
  // No result yet: each empty slot shows its numbered place medal instead of a dash.
  const upcoming = edition.champion === null;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={
        edition.champion
          ? `${edition.label}, champion ${edition.champion}, runner-up ${edition.runnerUp ?? "not recorded"}`
          : `${edition.label}, not yet played`
      }
    >
      <View style={styles.markAndYear}>
        <LogoMark
          registry={EDITION_LOGOS}
          logoKey={edition.id}
          name={edition.label}
          width={44}
          height={44}
        />
        <Text display style={styles.year} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.6}>
          {edition.label}
        </Text>
      </View>

      <View style={styles.cells}>
        <View style={styles.cell}>
          {edition.champion ? (
            <ResultChip name={edition.champion} isCountry={isCountry} color={BLUE} />
          ) : (
            <PlaceIcon place={1} color={BLUE} size={26} />
          )}
        </View>
        <View style={styles.cell}>
          {edition.runnerUp ? (
            <ResultChip name={edition.runnerUp} isCountry={isCountry} color={GREEN} />
          ) : (
            <PlaceIcon place={2} color={GREEN} size={26} />
          )}
        </View>
        <View style={styles.cell}>
          {third ? (
            <ResultChip name={third} isCountry={isCountry} color={INK_60} />
          ) : upcoming ? (
            <PlaceIcon place={3} color={INK_60} size={26} />
          ) : (
            <Text style={styles.dash}>—</Text>
          )}
        </View>
        <View style={styles.cell}>
          {fourth ? (
            <ResultChip name={fourth} isCountry={isCountry} color={unranked ? INK_60 : INK_40} />
          ) : upcoming ? (
            <PlaceIcon place={4} color={INK_40} size={26} />
          ) : (
            <Text style={styles.dash}>—</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E4E1D8",
    borderRadius: 8,
    // The web card's soft offset shadow (3px 3px 6px at 8% ink).
    shadowColor: "#171A21",
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  // Nearly every label is a year ("2022") or a season ("2023-24"), but a few
  // are longer (e.g. "2023 Finalización"). Capping this block at 42% of the
  // row, and letting the label wrap and scale down inside it, keeps a long
  // label from squeezing the four result cells off the row; short labels
  // are unaffected.
  markAndYear: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
    maxWidth: "42%",
  },
  year: {
    flexShrink: 1,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
    color: "#171A21",
  },
  cells: {
    flex: 1,
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    alignItems: "center",
  },
  dash: {
    fontSize: 12,
    color: INK_30,
  },
});
