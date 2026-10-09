// A small numbered "place" medal (1-4), shown in an edition's result slots when the
// edition hasn't been played yet: a stand-in for the team that will fill that place.
//
// Drawn in currentColor, so each slot's own colour applies (champion blue, runner-up
// green, 3rd / 4th grey); the ribbon is the same colour, lighter. The numbers are
// paths rather than text, so they look identical everywhere. The mobile app has a
// matching PlaceIcon with the same geometry.

type Place = 1 | 2 | 3 | 4;

const DIGITS: Record<Place, string> = {
  1: "M13.3 11.4 L16.6 9 V19",
  2: "M12.7 11.6 C13.1 10 14.3 9 16.1 9 C18 9 19.2 10.1 19.2 11.7 C19.2 13 18.5 13.9 17.3 15 L12.7 19 H19.6",
  3: "M12.8 10.3 C13.5 9.6 14.6 9 16 9 C17.8 9 19 9.9 19 11.3 C19 12.7 17.8 13.6 16 13.7 C18.1 13.8 19.5 14.8 19.5 16.4 C19.5 18 18.1 19.1 16 19.1 C14.5 19.1 13.3 18.6 12.5 17.7",
  4: "M17.6 9 L12.3 15.6 H19.9 M17.6 9 V19.2",
};

const RIBBON =
  "M10.2 23.4 L7 34.2 L11.6 31.4 L14.6 35 L16 24.2 Z M21.8 23.4 L25 34.2 L20.4 31.4 L17.4 35 L16 24.2 Z";

const NAMES: Record<Place, string> = {
  1: "Champion",
  2: "Runner-up",
  3: "Third place",
  4: "Fourth place",
};

export function PlaceIcon({
  place,
  size = 24,
  className,
}: {
  place: Place;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      role="img"
      aria-label={`${NAMES[place]}: to be decided`}
      viewBox="0 0 32 36"
      width={size}
      height={Math.round((size * 36) / 32)}
      fill="none"
      className={className}
    >
      <path d={RIBBON} fill="currentColor" fillOpacity={0.38} />
      <circle cx={16} cy={14} r={11} stroke="currentColor" strokeWidth={2.1} />
      <path
        d={DIGITS[place]}
        stroke="currentColor"
        strokeWidth={2.3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
