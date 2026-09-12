import organizations from "@/data/organizations.json";
import tournaments from "@/data/tournaments.json";
import editions from "@/data/editions.json";

export type Organization = {
  id: string;
  name: string;
  fullName: string;
  scope: "national" | "club" | "both";
  type: string;
  level: "global" | "confederation" | "association" | "league";
  parentId: string | null;
  founded: number;
  country: string | null;
  description: string;
};

export type Tournament = {
  id: string;
  organizationId: string;
  name: string;
  scope: "national" | "club";
  gender: "men" | "women";
  founded: number;
  frequency: string;
  description: string;
};

export type Edition = {
  id: string;
  tournamentId: string;
  label: string;
  host: string;
  startDate: string;
  endDate: string;
  teams: number;
  champion: string;
  runnerUp: string;
  thirdPlace: string | null;
  topScorer: string;
  notes: string;
  hostCodes: string[];
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

export function getAllTournaments(): Tournament[] {
  return tournaments as Tournament[];
}

export function getTournamentsByOrg(organizationId: string): Tournament[] {
  return (tournaments as Tournament[]).filter(
    (t) => t.organizationId === organizationId
  );
}

export function getTournament(id: string): Tournament | undefined {
  return (tournaments as Tournament[]).find((t) => t.id === id);
}

export function getEditionsByTournament(tournamentId: string): Edition[] {
  return (editions as Edition[])
    .filter((e) => e.tournamentId === tournamentId)
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export function getEdition(id: string): Edition | undefined {
  return (editions as Edition[]).find((e) => e.id === id);
}

export function getAllOrgIds(): string[] {
  return getOrganizations().map((o) => o.id);
}

export function getAllTournamentIds(): { orgId: string; tournamentId: string }[] {
  return (tournaments as Tournament[]).map((t) => ({
    orgId: t.organizationId,
    tournamentId: t.id,
  }));
}

export function getAllEditionIds(): {
  orgId: string;
  tournamentId: string;
  editionId: string;
}[] {
  return (editions as Edition[]).map((e) => {
    const t = getTournament(e.tournamentId)!;
    return { orgId: t.organizationId, tournamentId: t.id, editionId: e.id };
  });
}
