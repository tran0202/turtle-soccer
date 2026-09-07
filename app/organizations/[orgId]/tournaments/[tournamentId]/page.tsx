import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTournamentIds,
  getEditionsByTournament,
  getOrganization,
  getTournament,
} from "@/lib/data";

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

  return (
    <div>
      <Link
        href={`/organizations/${org.id}`}
        className="text-sm text-ink/50 hover:text-turtle-blue transition-colors"
      >
        ← {org.name}
      </Link>

      <h1 className="font-display text-5xl uppercase tracking-tight mt-4 mb-2">
        {tournament.name}
      </h1>
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
                  <span className="text-turtle-blue">{e.champion}</span>
                </div>
                <div className="text-sm text-ink/50 mt-0.5">
                  Hosted by {e.host}
                </div>
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
