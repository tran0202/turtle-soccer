// The shared data layer used by both the web and mobile apps. Every function
// is async — even though reading bundled JSON doesn't strictly need to be.
// This is deliberate: every screen in both apps already awaits these calls
// and handles a loading state, so switching dataSource.ts from bundled JSON
// to a real API later needs zero changes here or in any screen.

import { fetchOrganizations, fetchCompetitions, fetchEditions } from "./dataSource";
import type { Organization, Competition, Edition } from "./types";

export type { Organization, Competition, Edition, TopScorer, Host } from "./types";

export async function getOrganizations(): Promise<Organization[]> {
  return fetchOrganizations();
}

export async function getOrganization(id: string): Promise<Organization | undefined> {
  const orgs = await getOrganizations();
  return orgs.find((o) => o.id === id);
}

export async function getRootOrganizations(): Promise<Organization[]> {
  const orgs = await getOrganizations();
  return orgs.filter((o) => o.parentId === null);
}

export async function getChildOrganizations(parentId: string): Promise<Organization[]> {
  const orgs = await getOrganizations();
  return orgs.filter((o) => o.parentId === parentId);
}

// Full ancestor chain from the root down to (and including) this org, for
// breadcrumbs. e.g. for Premier League: [FIFA, UEFA, The FA, Premier League].
export async function getOrgAncestors(id: string): Promise<Organization[]> {
  const chain: Organization[] = [];
  let current = await getOrganization(id);
  while (current) {
    chain.unshift(current);
    current = current.parentId ? await getOrganization(current.parentId) : undefined;
  }
  return chain;
}

// Same chain, but drops the root (FIFA) whenever there's something below it.
export async function getBreadcrumbAncestors(id: string): Promise<Organization[]> {
  const chain = await getOrgAncestors(id);
  return chain.length > 1 ? chain.slice(1) : chain;
}

export async function getAllCompetitions(): Promise<Competition[]> {
  return fetchCompetitions();
}

export async function getCompetitionsByOrg(organizationId: string): Promise<Competition[]> {
  const competitions = await getAllCompetitions();
  return competitions.filter((c) => c.organizationId === organizationId);
}

export async function getCompetition(id: string): Promise<Competition | undefined> {
  const competitions = await getAllCompetitions();
  return competitions.find((c) => c.id === id);
}

export async function getAllEditions(): Promise<Edition[]> {
  return fetchEditions();
}

export async function getEditionsByCompetition(competitionId: string): Promise<Edition[]> {
  const editions = await getAllEditions();
  return editions
    .filter((e) => e.competitionId === competitionId)
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
}

export async function getEdition(id: string): Promise<Edition | undefined> {
  const editions = await getAllEditions();
  return editions.find((e) => e.id === id);
}

// The editions immediately before and after this one, chronologically,
// within the same competition — e.g. for World Cup 2022, previous is 2018
// and next is 2026. null at either end of a competition's history.
export async function getAdjacentEditions(
  editionId: string
): Promise<{ previous: Edition | null; next: Edition | null }> {
  const edition = await getEdition(editionId);
  if (!edition) return { previous: null, next: null };

  const siblings = await getEditionsByCompetition(edition.competitionId);
  const index = siblings.findIndex((e) => e.id === editionId);

  return {
    previous: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
    next: index > 0 ? siblings[index - 1] : null,
  };
}

// The three functions below exist for Next.js's generateStaticParams (web
// app only — mobile has no equivalent need), but live here with everything
// else since they're still just shaping the same shared data.

export async function getAllOrgIds(): Promise<string[]> {
  const orgs = await getOrganizations();
  return orgs.map((o) => o.id);
}

export async function getAllCompetitionIds(): Promise<
  { orgId: string; competitionId: string }[]
> {
  const competitions = await getAllCompetitions();
  return competitions.map((c) => ({
    orgId: c.organizationId,
    competitionId: c.id,
  }));
}

export async function getAllEditionIds(): Promise<
  { orgId: string; competitionId: string; editionId: string }[]
> {
  const editions = await getAllEditions();
  return Promise.all(
    editions.map(async (e) => {
      const c = await getCompetition(e.competitionId);
      if (!c) throw new Error(`Edition ${e.id} references missing competition ${e.competitionId}`);
      return { orgId: c.organizationId, competitionId: c.id, editionId: e.id };
    })
  );
}
