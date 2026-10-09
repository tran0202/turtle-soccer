import { View, StyleSheet } from "react-native";
import { AppText as Text } from "./AppText";
import { getCountryCode, getClubCountryCode, getClubCode } from "@turtle-soccer/core";
import { Flag } from "./Flag";
import { InitialsBadge } from "./InitialsBadge";
import { LogoMark } from "./LogoMark";
import { CLUB_LOGOS } from "../lib/clubLogoRegistry";

// The compact result shown in a narrow edition row, mirroring the web app's
// NameWithFlag `compact` mode:
//   - a country: its flag over its 3-letter code
//   - a club: a club mark over its short code, over a small flag of its
//     country (a club has no flag of its own, so it shows where it's from)
// The club mark is the club's logo when it has one (apps/web/data/club-logos.json,
// mirrored into clubLogoRegistry.ts), otherwise an initials badge — the same
// fallback as the web.
export function ResultChip({
  name,
  isCountry,
  color,
}: {
  name: string;
  isCountry: boolean;
  color: string;
}) {
  const countryCode = isCountry ? getCountryCode(name) : getClubCountryCode(name);

  // A name the lookups don't know: show it as plain text rather than
  // nothing, same graceful fallback as the web.
  if (!countryCode) {
    return (
      <Text style={[styles.fallback, { color }]} numberOfLines={2}>
        {name}
      </Text>
    );
  }

  if (isCountry) {
    return (
      <View style={styles.chip}>
        <Flag code={countryCode} size={16} />
        <Text display style={[styles.code, { color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
          {countryCode}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.chip}>
      {CLUB_LOGOS[name] ? (
        <LogoMark registry={CLUB_LOGOS} logoKey={name} name={name} width={22} height={22} />
      ) : (
        <InitialsBadge name={name} width={28} height={18} />
      )}
      <Text display style={[styles.code, { color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
        {getClubCode(name) ?? name}
      </Text>
      <Flag code={countryCode} size={8} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: "center",
    gap: 2,
  },
  code: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  fallback: {
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
  },
});
