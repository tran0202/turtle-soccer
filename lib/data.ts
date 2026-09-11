import organizations from "@/data/organizations.json";
import tournaments from "@/data/tournaments.json";
import editions from "@/data/editions.json";

export type Organization = {
  id: string;
  name: string;
  fullName: string;
  scope: "national" | "club" | "both";
  type: string;
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
