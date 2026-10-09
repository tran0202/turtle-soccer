import { View, StyleSheet } from "react-native";
import { AppText as Text } from "./AppText";
import { getCountryCode, getClubCountryCode } from "@turtle-soccer/core";
import { Flag } from "./Flag";
import { LogoMark } from "./LogoMark";
import { CLUB_LOGOS } from "../lib/clubLogoRegistry";

// A country shows its flag and name. A club shows its logo (an initials badge
// if it has none), its name, and a small flag of its country — like the web's
// ClubMark. Club logos come from clubLogoRegistry.ts (see mobile_change.py).
// Pass `display` to show the name in the web's display font.
export function NameWithFlag({
  name,
  isCountry,
  size = 20,
  textStyle,
  display = false,
}: {
  name: string;
  isCountry: boolean;
  size?: number;
  textStyle?: object;
  display?: boolean;
}) {
  const code = isCountry ? getCountryCode(name) : getClubCountryCode(name);

  if (!code) {
    return <Text display={display} style={textStyle}>{name}</Text>;
  }

  // A club shows its logo (or an initials badge if it has none), then its
  // name, then a small flag of its country — the same as the web.
  if (!isCountry) {
    const crest = Math.round(size * 1.25);
    return (
      <View style={styles.row}>
        <LogoMark registry={CLUB_LOGOS} logoKey={name} name={name} width={crest} height={crest} />
        <Text display={display} style={[styles.name, textStyle]}>{name}</Text>
        <Flag code={code} size={Math.round(size / 2)} />
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <Flag code={code} size={size} />
      <Text display={display} style={[styles.name, textStyle]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    flexShrink: 1,
  },
});
