import { notFound } from "next/navigation";
import {
  getAllEditionIds,
  getEdition,
  getOrganization,
  getBreadcrumbAncestors,
  getTournament,
} from "@/lib/data";
import { FlagGroup } from "@/components/Flag";
import { NameWithFlag } from "@/components/NameWithFlag";
import { Breadcrumb } from "@/components/Breadcrumb";

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
          {
            label: tournament.name,
            href: `/organizations/${org.id}/tournaments/${tournament.id}`,
          },
          { label: edition.label },
        ]}
      />

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
            <div className="flex items-center gap-1.5">
              <FlagGroup codes={edition.hostCodes} />
              <span>{edition.host}</span>
            </div>
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
              <NameWithFlag
                name={edition.champion}
                isCountry={tournament.scope === "national"}
                size="md"
              />
            </div>
          </div>
          <div className="p-6">
            <div className="text-xs uppercase tracking-wide text-ink/40 mb-1">
              Runner-up
            </div>
            <div className="font-display text-3xl uppercase tracking-tight">
              <NameWithFlag
                name={edition.runnerUp}
                isCountry={tournament.scope === "national"}
                size="md"
              />
            </div>
          </div>
          <div className="p-6">
            <div className="text-xs uppercase tracking-wide text-ink/40 mb-1">
              Third place
            </div>
            <div className="font-display text-3xl uppercase tracking-tight text-ink/60">
              {edition.thirdPlace ? (
                <NameWithFlag
                  name={edition.thirdPlace}
                  isCountry={tournament.scope === "national"}
                  size="md"
                />
              ) : (
                "—"
              )}
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
