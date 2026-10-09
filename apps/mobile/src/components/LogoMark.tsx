import { Image, View, StyleSheet } from "react-native";
import type { LogoEntry } from "../lib/orgLogoRegistry";
import { InitialsBadge } from "./InitialsBadge";

// Generic renderer for any of the three logo registries (org, competition,
// edition) — each entry is either a real logo (SVG component or raster
// image) or, if the key isn't in the registry at all, falls back to an
// initials badge the same way the web app's OrgMark/CompetitionMark/
// EditionMark do.
export function LogoMark({
  registry,
  logoKey,
  name,
  width,
  height,
}: {
  registry: Record<string, LogoEntry>;
  logoKey: string;
  name: string;
  width: number;
  height: number;
}) {
  const entry = registry[logoKey];

  if (!entry) {
    return <InitialsBadge name={name} width={width} height={height} />;
  }

  if (entry.kind === "svg") {
    const Svg = entry.Component;
    return (
      <View style={[styles.box, { width, height }]}>
        <Svg width={width} height={height} />
      </View>
    );
  }

  return (
    <Image
      source={entry.source}
      style={{ width, height }}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: "center",
    justifyContent: "center",
  },
});
