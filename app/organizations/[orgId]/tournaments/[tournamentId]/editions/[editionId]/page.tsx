import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllEditionIds,
  getEdition,
  getOrganization,
  getTournament,
} from "@/lib/data";

export function generateStaticParams() {
  return getAllEditionIds();
}

function formatDateRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const s = new Date(start).toLocaleDateString("en-US", opts);
  const e = new Date(end).toLocaleDateString("en-US", opts);
  return s === e ? s : `${s} – ${e}`;
}

export default function EditionPage({
  params,
}: {
  params: { orgId: string; tournamentId: string; editionId: string };
}) {
  const org = getOrganization(params.orgId);
  const tournament = getTournament(params.tournamentId);
  const edition = getEdition(params.editionId);

  if (
    !org ||
    !tournament ||
    !edition ||
    tournament.organizationId !== org.id ||
    edition.tournamentId !== tournament.id
  ) {
    return notFound();
  }

  return (
    <div>
      <Link
        href={`/organizations/${org.id}/tournaments/${tournament.id}`}
        className="text-sm text-ink/50 hover:text-turtle-blue transition-colors"
      >
        ← {tournament.name}
      </Link>

      <h1 className="font-display text-5xl uppercase tracking-tight mt-4">
        {tournament.name}
      </h1>
      <div className="font-display text-2xl text-turtle-blue uppercase tracking-tight mb-8">
        {edition.label}
      </div>

      <div className="border border-paper-line rounded-none">
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-paper-line border-b border-paper-line">
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-turtle-green mb-1">
              Host
            </div>
            <div>{edition.host}</div>
          </div>
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-turtle-green mb-1">
              Dates
            </div>
            <div>{formatDateRange(edition.startDate, edition.endDate)}</div>
          </div>
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-turtle-green mb-1">
              Teams
            </div>
            <div>{edition.teams}</div>
          </div>
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-turtle-green mb-1">
              Top Scorer
            </div>
            <div>{edition.topScorer}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-paper-line">
          <div className="p-6">
            <div className="text-xs uppercase tracking-wide text-ink/40 mb-1">
              Champion
            </div>
            <div className="font-display text-3xl uppercase tracking-tight text-turtle-blue">
              {edition.champion}
            </div>
          </div>
          <div className="p-6">
            <div className="text-xs uppercase tracking-wide text-ink/40 mb-1">
              Runner-up
            </div>
            <div className="font-display text-3xl uppercase tracking-tight">
              {edition.runnerUp}
            </div>
          </div>
          <div className="p-6">
            <div className="text-xs uppercase tracking-wide text-ink/40 mb-1">
              Third place
            </div>
            <div className="font-display text-3xl uppercase tracking-tight text-ink/60">
              {edition.thirdPlace ?? "—"}
            </div>
          </div>
        </div>
      </div>

      {edition.notes && (
        <p className="text-ink/60 mt-8 max-w-lg leading-relaxed">
          {edition.notes}
        </p>
      )}
    </div>
  );
}
