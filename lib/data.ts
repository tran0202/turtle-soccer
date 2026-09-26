import organizations from "@/data/organizations.json";
import competitions from "@/data/competitions.json";
import editions from "@/data/editions.json";

export type Organization = {
  id: string;
  name: string;
  fullName: string;
  scope: "national" | "club" | "both";
  type: string;
  level: "global" | "confederation" | "association" | "league";
  parentId: string | null;
  // For the handful of nations that have switched confederations — e.g.
  // Australia moved from OFC to AFC in 2006. A short note shown on the
  // org's own page; null for everyone else.
  confederationHistory: string | null;
  // For confederation members that are NOT FIFA members (associate members
  // only, or full confederation members without FIFA recognition at all) —
  // e.g. Zanzibar, a CAF associate member since 2004, has never been
  // admitted to FIFA. null for every normal FIFA-member association.
  fifaAffiliation: string | null;
  // Distinct from FIFA membership: whether this association is a full or
  // merely associate member of its own confederation. null means full (true
  // for essentially every FIFA member, and most non-FIFA ones too — only a
  // few of the latter, like Zanzibar or Kiribati, are associate members).
  confederationStatus: "associate" | null;
  // null for associations added without an individually-verified founding
  // year (see docs/organizations.md) — never rendered for association-level
  // orgs anyway, only used as a fallback on the root org listing page for
  // orgs with no children.
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
  // The name this specific edition was actually played under, if different
  // from the competition's current name (e.g. Copa América's early editions
  // were played as the "South American Championship"). Falls back to the
  // competition's own name everywhere this is null.
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
  // For the rare case of a genuine 3rd-place MATCH that ended without a
  // decider (e.g. drawn after extra time, no shootout held) — both teams are
  // officially declared joint third, and there's no fourth place at all.
  // Different from `semifinalists`, which means no 3rd-place match was ever
  // played. thirdPlace/fourthPlace are both null whenever this is set.
  coThirdPlace: [string, string] | null;
  semifinalists: [string, string] | null;
  topScorers: TopScorer[];
  notes: string;
};

export function getOrganizations(): Organization[] {
  return organizations as Organization[];
}

export function getOrganization(id: string): Organization | undefined {
  return getOrganizations().find((o) => o.id === id);
}

export function getRootOrganizations(): Organization[] {
  return getOrganizations().filter((o) => o.parentId === null);
}

export function getChildOrganizations(parentId: string): Organization[] {
  return getOrganizations().filter((o) => o.parentId === parentId);
}

// Full ancestor chain from the root down to (and including) this org, for
// breadcrumbs. e.g. for Premier League: [FIFA, UEFA, The FA, Premier League].
export function getOrgAncestors(id: string): Organization[] {
  const chain: Organization[] = [];
  let current = getOrganization(id);
  while (current) {
    chain.unshift(current);
    current = current.parentId ? getOrganization(current.parentId) : undefined;
  }
  return chain;
}

// Same chain, but drops the root (FIFA) whenever there's something below it.
// The root org isn't meaningfully different from a confederation — it's just
// the one with no parent — so breadcrumbs under a confederation shouldn't
// carry it along as dead weight. Only shows up when it's the org actually
// being viewed.
export function getBreadcrumbAncestors(id: string): Organization[] {
  const chain = getOrgAncestors(id);
  return chain.length > 1 ? chain.slice(1) : chain;
}

export function getAllCompetitions(): Competition[] {
  return competitions as Competition[];
}

export function getCompetitionsByOrg(organizationId: string): Competition[] {
  return (competitions as Competition[]).filter(
    (c) => c.organizationId === organizationId
  );
}

export function getCompetition(id: string): Competition | undefined {
  return (competitions as Competition[]).find((c) => c.id === id);
}

export function getEditionsByCompetition(competitionId: string): Edition[] {
  return (editions as Edition[])
    .filter((e) => e.competitionId === competitionId)
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export function getEdition(id: string): Edition | undefined {
  return (editions as Edition[]).find((e) => e.id === id);
}

export function getAllOrgIds(): string[] {
  return getOrganizations().map((o) => o.id);
}

export function getAllCompetitionIds(): { orgId: string; competitionId: string }[] {
  return (competitions as Competition[]).map((c) => ({
    orgId: c.organizationId,
    competitionId: c.id,
  }));
}

export function getAllEditionIds(): {
  orgId: string;
  competitionId: string;
  editionId: string;
}[] {
  return (editions as Edition[]).map((e) => {
    const c = getCompetition(e.competitionId)!;
    return { orgId: c.organizationId, competitionId: c.id, editionId: e.id };
  });
}
