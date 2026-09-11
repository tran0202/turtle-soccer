import { InitialsBadge } from "./InitialsBadge";

// Only add an org here once its logo's copyright/PD status has actually been
// verified — see conversation history. Everyone else falls back to the
// initials badge rather than risking an unverified crest.
const ORG_LOGOS: Record<string, { src: string }> = {
  fifa: { src: "/fifa-logo.svg" },
  uefa: { src: "/uefa-logo.svg" },
};

const SIZE_CLASSES = {
  sm: "h-4",
  md: "h-6",
  lg: "h-10",
} as const;

export function OrgMark({
  orgId,
  orgName,
  size = "md",
}: {
  orgId: string;
  orgName: string;
  size?: "sm" | "md" | "lg";
}) {
  const logo = ORG_LOGOS[orgId];

  if (!logo) {
    return <InitialsBadge name={orgName} size={size} />;
  }

  // Plain <img>, not next/image: these are already-vector local assets with
  // nothing to gain from the image optimizer, which also avoids a Next.js
  // gotcha where contentDispositionType:"attachment" (required to allow SVGs
  // through next/image at all) makes some browsers refuse to render them inline.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={logo.src}
      alt={orgName}
      className={`${SIZE_CLASSES[size]} w-auto`}
    />
  );
}
