import Svg, { Circle, Path } from "react-native-svg";

// A small numbered "place" medal (1-4), shown in an edition's result slots when the
// edition hasn't been played yet: a stand-in for the team that will fill that place.
// Same geometry as the web app's PlaceIcon; `color` is the slot's own colour
// (champion blue, runner-up green, 3rd / 4th grey), and the ribbon is that colour,
// lighter. The numbers are paths rather than text, so they match the web exactly.
// Purely decorative: the row or label next to it already says what the slot is.

type Place = 1 | 2 | 3 | 4;

const DIGITS: Record<Place, string> = {
  1: "M13.3 11.4 L16.6 9 V19",
  2: "M12.7 11.6 C13.1 10 14.3 9 16.1 9 C18 9 19.2 10.1 19.2 11.7 C19.2 13 18.5 13.9 17.3 15 L12.7 19 H19.6",
  3: "M12.8 10.3 C13.5 9.6 14.6 9 16 9 C17.8 9 19 9.9 19 11.3 C19 12.7 17.8 13.6 16 13.7 C18.1 13.8 19.5 14.8 19.5 16.4 C19.5 18 18.1 19.1 16 19.1 C14.5 19.1 13.3 18.6 12.5 17.7",
  4: "M17.6 9 L12.3 15.6 H19.9 M17.6 9 V19.2",
};

const RIBBON =
  "M10.2 23.4 L7 34.2 L11.6 31.4 L14.6 35 L16 24.2 Z M21.8 23.4 L25 34.2 L20.4 31.4 L17.4 35 L16 24.2 Z";

export function PlaceIcon({
  place,
  color,
  size = 24,
}: {
  place: Place;
  color: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={Math.round((size * 36) / 32)}
      viewBox="0 0 32 36"
      fill="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Path d={RIBBON} fill={color} fillOpacity={0.38} />
      <Circle cx={16} cy={14} r={11} stroke={color} strokeWidth={2.1} />
      <Path
        d={DIGITS[place]}
        stroke={color}
        strokeWidth={2.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
