// Identical to the type definitions in the web app's lib/data.ts — kept in
// sync by hand for now since the two projects don't share a package yet.
// If the data shape changes on one side, mirror the change here too.

export type Organization = {
  id: string;
  name: string;
  fullName: string;
  scope: "national" | "club" | "both";
  type: string;
  level: "global" | "confederation" | "association" | "league";
  parentId: string | null;
  confederationHistory: string | null;
  fifaAffiliation: string | null;
  confederationStatus: "associate" | null;
  founded: number | null;
  country: string | null;
  description: string;
};

export type Competition = {
  id: string;
  organizationId: string;
  name: string;
  scope: "national" | "club";
  gender: "men" | "women";
  founded: number;
  frequency: string;
  description: string;
};

export type TopScorer = {
  name: string;
  goals: number;
  countryCode: string;
};

export type Host = {
  name: string;
  code: string;
};

export type Edition = {
  id: string;
  competitionId: string;
  label: string;
  historicalName: string | null;
  hosts: Host[];
  hostType: "single" | "multi" | "final" | "multi-final";
  startDate: string;
  endDate: string;
  teams: number;
  champion: string;
  runnerUp: string;
  thirdPlace: string | null;
  fourthPlace: string | null;
  coThirdPlace: [string, string] | null;
  semifinalists: [string, string] | null;
  topScorers: TopScorer[];
  notes: string;
};
