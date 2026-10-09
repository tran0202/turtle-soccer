import { View, StyleSheet } from "react-native";
import { FLAGS } from "../lib/flagRegistry";

// Matches the web app's Flag component convention: a 4:3 box, height-driven.
// Nepal (the one non-rectangular national flag) gets the same no-border
// treatment as the web version, for the same reason — a border around the
// full 4:3 box would visibly outline the transparent space its non-
// rectangular artwork leaves within it.
export function Flag({ code, size = 20 }: { code: string; size?: number }) {
  const FlagSvg = FLAGS[code];
  const width = Math.round((size * 4) / 3);

  if (!FlagSvg) {
    return (
      <View
        style={[
          styles.fallback,
          { width, height: size },
        ]}
      />
    );
  }

  return (
    <View style={code === "NEP" ? undefined : [styles.bordered, { width, height: size }]}>
      <FlagSvg width={width} height={size} />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: "#E4E1D8",
    borderRadius: 2,
  },
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#171A2126",
  },
});
