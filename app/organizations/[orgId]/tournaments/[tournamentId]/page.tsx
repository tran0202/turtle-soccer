import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTournamentIds,
  getEditionsByTournament,
  getOrganization,
  getBreadcrumbAncestors,
  getTournament,
} from "@/lib/data";
import { InitialsBadge } from "@/components/InitialsBadge";
import { FlagGroup } from "@/components/Flag";
import { NameWithFlag } from "@/components/NameWithFlag";
import { Breadcrumb } from "@/components/Breadcrumb";

export function generateStaticParams() {
  return getAllTournamentIds();
}

export default function TournamentPage({
  params,
}: {
  params: { orgId: string; tournamentId: string };
}) {
  const org = getOrganization(params.orgId);
  const tournament = getTournament(params.tournamentId);
  if (!org || !tournament || tournament.organizationId !== org.id) {
    return notFound();
  }
  const editions = getEditionsByTournament(tournament.id);
  const ancestors = getBreadcrumbAncestors(org.id);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Organizations", href: "/organizations" },
          ...ancestors.map((a) => ({
            label: a.name,
            href: `/organizations/${a.id}`,
          })),
          { label: tournament.name },
        ]}
      />

      <div className="flex items-center gap-3 mt-4 mb-2">
        <InitialsBadge name={tournament.name} size="lg" />
        <div className="flex items-baseline gap-3 flex-wrap">
          <h1 className="font-display text-5xl uppercase tracking-tight">
            {tournament.name}
          </h1>
          {org.country && (
            <span className="text-sm text-ink/50">
              <NameWithFlag name={org.country} isCountry size="sm" />
            </span>
          )}
        </div>
      </div>
      <p className="text-ink/60 mb-10 max-w-lg">{tournament.description}</p>

      <h2 className="text-xs uppercase tracking-wide text-turtle-green mb-3">
        Editions
      </h2>
      <ul className="border-t border-paper-line">
        {editions.map((e) => (
          <li key={e.id} className="border-b border-paper-line">
            <Link
              href={`/organizations/${org.id}/tournaments/${tournament.id}/editions/${e.id}`}
              className="group grid grid-cols-[5rem_1fr_auto] items-baseline gap-4 py-5 hover:bg-paper-surface transition-colors px-2 -mx-2"
            >
              <div className="font-display text-2xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
                {e.label}
              </div>
              <div>
                <div className="text-ink">
                  Champion:{" "}
                  <span className="text-turtle-blue">
                    <NameWithFlag
                      name={e.champion}
                      isCountry={tournament.scope === "national"}
                      size="sm"
                    />
                  </span>
                </div>
                {!org.country && (
                  <div className="text-sm text-ink/50 mt-0.5 flex items-center gap-1.5">
                    Hosted by
                    <FlagGroup codes={e.hostCodes} size="sm" />
                    {e.host}
                  </div>
                )}
              </div>
              <div className="text-right shrink-0 text-xs text-ink/40">
                {e.teams} teams
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
