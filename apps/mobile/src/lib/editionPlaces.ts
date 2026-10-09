import type { Edition } from "@turtle-soccer/core";

// Which team fills the 3rd and 4th slot of an edition row. Same resolution as
// the web app's competition page and EditionDetailScreen:
//   - a drawn 3rd-place match with no decider (coThirdPlace) puts both teams
//     in the two slots, with no ranking between them
//   - no 3rd-place match played (semifinalists): same, the two losing semifinalists
//   - otherwise a genuine 3rd and 4th place (either can be missing)
export type EditionPlaces = {
  third: string | null;
  fourth: string | null;
  /** True when the two slots carry no ranking between them (joint third /
   *  semifinalists), so the 4th slot shouldn't be dimmed as "lesser". */
  unranked: boolean;
};

export function getEditionPlaces(edition: Edition): EditionPlaces {
  if (edition.coThirdPlace) {
    return { third: edition.coThirdPlace[0], fourth: edition.coThirdPlace[1], unranked: true };
  }
  if (edition.semifinalists) {
    return { third: edition.semifinalists[0], fourth: edition.semifinalists[1], unranked: true };
  }
  return { third: edition.thirdPlace, fourth: edition.fourthPlace, unranked: false };
}
