import { Text, StyleSheet, type TextProps } from "react-native";
import { resolveFontFamily } from "../theme/fonts";

// A drop-in replacement for React Native's <Text> that uses the web app's fonts.
//
//   <Text>           body text    -> Source Serif 4
//   <Text display>   display text -> Big Shoulders Inline Display, uppercase
//
// On the web the display face is only ever used uppercase, so `display` turns
// that on (a style can still override textTransform). Custom fonts are one
// file per weight, so the weight in the style (fontWeight: "700", say) is
// translated into the matching font file, using the same nearest-weight rule
// a browser applies. A style that sets its own fontFamily is left alone.
//
// Files import it as `Text`, so existing <Text> JSX needs no changes:
//   import { AppText as Text } from "../components/AppText";
export type AppTextProps = TextProps & { display?: boolean };

export function AppText({ display = false, style, ...rest }: AppTextProps) {
  const flat = StyleSheet.flatten(style) ?? {};

  if (flat.fontFamily) {
    return <Text {...rest} style={style} />;
  }

  return (
    <Text
      {...rest}
      style={[
        display ? { textTransform: "uppercase" as const } : null,
        style,
        {
          fontFamily: resolveFontFamily(display ? "display" : "body", flat.fontWeight),
          // The family name already IS the weight; neutralise fontWeight so the
          // OS doesn't faux-bold a face that is already bold.
          fontWeight: "normal" as const,
        },
      ]}
    />
  );
}
