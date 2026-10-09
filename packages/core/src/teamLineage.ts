/**
 * Ties together national teams that are the same line of team across a change
 * of FIFA code, so a future "Germany, all-time" view can total West Germany
 * and Germany together instead of treating them as strangers.
 *
 * HOW IT'S MODELLED
 *
 * The unit of identity is the FIFA code a team used at the time (FRG, GER,
 * TUR...). Names are just labels for a code, and several names can share one:
 * Turkey and Türkiye are both TUR (see countries.ts). Two names with the same
 * code are the same team by definition, so a rename that keeps its code needs
 * NO entry in this file. That is why Turkey/Türkiye has no link.
 *
 * A link below is needed only when the code CHANGES. It points the old code at
 * the new one, and means: FIFA credits the old team's records to the new one,
 * so totals should combine them. A rename that changes the code (Zaire ->
 * DR Congo) needs a link for the same reason a succession does. The code is
 * the deciding factor, not whether it was "really" a rename.
 *
 * Codes can repeat across eras: pre-war Germany and today's Germany are both
 * GER, with West Germany (FRG) in between. The single link FRG -> GER therefore
 * pulls all three eras into one lineage, because the two GER eras already share
 * a code. No link is needed from pre-war Germany.
 *
 * LIMITS (by design, for now)
 *
 *  - One successor per code. A case where records are credited to TWO
 *    successors at once (one source says Czechoslovakia's go to the Czech
 *    Republic AND Slovakia jointly) can't be expressed, and combining both
 *    would double-count. Settle those when they come up.
 *  - Only credited continuations live here. A historical tie that FIFA does
 *    NOT merge (East Germany -> Germany) is deliberately left out, so totals
 *    stay correct. If you want to show those as "related" later, add a `kind`
 *    field to LineageLink then; nothing here has to change first.
 *
 * ADDING A CASE
 *
 * Add the link when you add the first edition that uses the old name. Check
 * who FIFA credits before adding one. Sources disagree on some cases (East
 * Germany, Czechoslovakia), so confirm it rather than assuming.
 * The old name also needs its own entry in countries.ts
 * (HISTORICAL_TEAM_CODES) and a flag file named after its code, e.g.
 * flags/FRG.svg.
 */

export type LineageLink = {
  /** The predecessor's FIFA code, as used at the time (e.g. "FRG"). */
  from: string;
  /** The successor's FIFA code that inherits the records (e.g. "GER"). */
  to: string;
  /** The year the changeover took effect. Informational. */
  year: number;
  note: string;
};

export const LINEAGE_LINKS: readonly LineageLink[] = [
  {
    from: "FRG",
    to: "GER",
    year: 1990,
    note:
      "West Germany -> reunified Germany (3 Oct 1990). West Germany was " +
      "declared Germany's official successor team after 1949, and FIFA counts " +
      "its World Cup record (titles in 1954, 1974 and 1990) toward Germany.",
  },
];

/** The code this team's records continue under, one step on (FRG -> GER), or undefined. */
export function getSuccessorCode(code: string): string | undefined {
  return LINEAGE_LINKS.find((l) => l.from === code)?.to;
}

/**
 * The code the whole lineage is totaled under: the end of the chain.
 * FRG -> "GER", GER -> "GER", TUR -> "TUR" (no links, so it stands alone).
 */
export function getLineageCode(code: string): string {
  const seen = new Set<string>();
  let current = code;
  while (!seen.has(current)) {
    seen.add(current);
    const next = getSuccessorCode(current);
    if (!next) break;
    current = next;
  }
  return current;
}

/**
 * Every code in the same lineage as `code`, including itself: predecessors
 * and successors alike. The lineage's own code comes first.
 * "GER" or "FRG" -> ["GER", "FRG"]; "TUR" -> ["TUR"].
 */
export function getLineageCodes(code: string): string[] {
  const lineage = getLineageCode(code);
  const members = new Set<string>([lineage, code]);
  for (const link of LINEAGE_LINKS) {
    if (getLineageCode(link.from) === lineage) {
      members.add(link.from);
      members.add(link.to);
    }
  }
  return [lineage, ...[...members].filter((c) => c !== lineage)];
}
