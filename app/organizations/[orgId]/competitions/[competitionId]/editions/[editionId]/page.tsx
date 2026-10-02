import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllEditionIds,
  getEdition,
  getOrganization,
  getBreadcrumbAncestors,
  getCompetition,
  getAdjacentEditions,
} from "@/lib/data";
import { Flag } from "@/components/Flag";
import { EditionMark } from "@/components/EditionMark";
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
  params: { orgId: string; competitionId: string; editionId: string };
}) {
  const org = getOrganization(params.orgId);
  const competition = getCompetition(params.competitionId);
  const edition = getEdition(params.editionId);

  if (
    !org ||
    !competition ||
    !edition ||
    competition.organizationId !== org.id ||
    edition.competitionId !== competition.id
  ) {
    return notFound();
  }

  const ancestors = getBreadcrumbAncestors(org.id);
  const { previous, next } = getAdjacentEditions(edition.id);

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
            label: competition.name,
            href: `/organizations/${org.id}/competitions/${competition.id}`,
          },
          { label: edition.label },
        ]}
      />

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mt-4 mb-8">
        <div>
          {previous && (
            <Link
              href={`/organizations/${org.id}/competitions/${competition.id}/editions/${previous.id}`}
              className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-turtle-amber/60 hover:text-turtle-amber transition-colors whitespace-nowrap"
            >
              &lsaquo; {previous.label}
            </Link>
          )}
        </div>
        <div className="flex items-center justify-center gap-3">
          <span className="sm:hidden">
            <EditionMark editionId={edition.id} editionLabel={edition.label} size="md" />
          </span>
          <span className="hidden sm:inline">
            <EditionMark editionId={edition.id} editionLabel={edition.label} size="lg" />
          </span>
          <h1 className="font-display text-5xl sm:text-6xl uppercase tracking-tight">
            {edition.label} {edition.historicalName ?? competition.name}
          </h1>
        </div>
        <div className="text-right">
          {next && (
            <Link
              href={`/organizations/${org.id}/competitions/${competition.id}/editions/${next.id}`}
              className="font-display text-3xl sm:text-4xl uppercase tracking-tight text-turtle-amber/60 hover:text-turtle-amber transition-colors whitespace-nowrap"
            >
              {next.label} &rsaquo;
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div className="p-4 border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
          <div className="text-sm uppercase tracking-wide text-turtle-green mb-1">
            {edition.hostType === "multi"
              ? "Hosts"
              : edition.hostType === "final"
              ? "Final Host"
              : edition.hostType === "multi-final"
              ? "Final Hosts"
              : "Host"}
          </div>
          {edition.hostType === "multi" || edition.hostType === "multi-final" ? (
            <div className="flex flex-col gap-0.5">
              {edition.hosts.map((h) => (
                <div key={h.name} className="flex items-center gap-1.5">
                  <Flag code={h.code} size="lg" />
                  <span>{h.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Flag code={edition.hosts[0].code} size="lg" />
              <span>{edition.hosts[0].name}</span>
            </div>
          )}
          {edition.hostType === "multi-final" && (
            <p className="text-sm text-ink/40 mt-2 leading-snug">
              Played as a home-and-away round-robin, with the final itself also contested over two legs — no single host country.
            </p>
          )}
        </div>
        <div className="p-4 border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
          <div className="text-sm uppercase tracking-wide text-turtle-green mb-1">
            Dates
          </div>
          <div>{formatDateRange(edition.startDate, edition.endDate)}</div>
        </div>
        <div className="p-4 border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
          <div className="text-sm uppercase tracking-wide text-turtle-green mb-1">
            Teams
          </div>
          <div>{edition.teams}</div>
        </div>
        <div className="p-4 border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
          <div className="text-sm uppercase tracking-wide text-turtle-green mb-1">
            {edition.topScorers.length > 1 ? "Top Scorers" : "Top Scorer"}
          </div>
          <div className="flex flex-col gap-0.5">
            {edition.topScorers.map((scorer) => (
              <div key={scorer.name} className="flex items-center gap-1.5">
                <Flag code={scorer.countryCode} label={scorer.name} size="lg" />
                <span>
                  {scorer.name} ({scorer.goals})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
          <div className="text-sm uppercase tracking-wide text-ink/40 mb-1">
            Champion
          </div>
          <div className="font-display text-4xl uppercase tracking-tight text-turtle-blue">
            <NameWithFlag
              name={edition.champion}
              isCountry={competition.scope === "national"}
              size="xl"
              nameMaxWidth="16rem"
            />
          </div>
        </div>
        <div className="p-6 border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
          <div className="text-sm uppercase tracking-wide text-ink/40 mb-1">
            Runner-up
          </div>
          <div className="font-display text-4xl uppercase tracking-tight text-turtle-green">
            <NameWithFlag
              name={edition.runnerUp}
              isCountry={competition.scope === "national"}
              size="xl"
              nameMaxWidth="16rem"
            />
          </div>
        </div>
        <div className="p-6 border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
          <div className="text-sm uppercase tracking-wide text-ink/40 mb-1">
            {edition.coThirdPlace
              ? "Joint third"
              : edition.semifinalists
              ? "Semifinalist"
              : "Third place"}
          </div>
          <div className="font-display text-4xl uppercase tracking-tight text-ink/60">
            {edition.coThirdPlace ? (
              <NameWithFlag
                name={edition.coThirdPlace[0]}
                isCountry={competition.scope === "national"}
                size="xl"
                nameMaxWidth="16rem"
              />
            ) : edition.semifinalists ? (
              <NameWithFlag
                name={edition.semifinalists[0]}
                isCountry={competition.scope === "national"}
                size="xl"
                nameMaxWidth="16rem"
              />
            ) : edition.thirdPlace ? (
              <NameWithFlag
                name={edition.thirdPlace}
                isCountry={competition.scope === "national"}
                size="xl"
                nameMaxWidth="16rem"
              />
            ) : (
              "—"
            )}
          </div>
        </div>
        <div className="p-6 border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
          <div className="text-sm uppercase tracking-wide text-ink/40 mb-1">
            {edition.coThirdPlace
              ? "Joint third"
              : edition.semifinalists
              ? "Semifinalist"
              : "Fourth place"}
          </div>
          <div
            className={`font-display text-4xl uppercase tracking-tight ${
              edition.coThirdPlace || edition.semifinalists ? "text-ink/60" : "text-ink/40"
            }`}
          >
            {edition.coThirdPlace ? (
              <NameWithFlag
                name={edition.coThirdPlace[1]}
                isCountry={competition.scope === "national"}
                size="xl"
                nameMaxWidth="16rem"
              />
            ) : edition.semifinalists ? (
              <NameWithFlag
                name={edition.semifinalists[1]}
                isCountry={competition.scope === "national"}
                size="xl"
                nameMaxWidth="16rem"
              />
            ) : edition.fourthPlace ? (
              <NameWithFlag
                name={edition.fourthPlace}
                isCountry={competition.scope === "national"}
                size="xl"
                nameMaxWidth="16rem"
              />
            ) : (
              "—"
            )}
          </div>
        </div>
      </div>

      {edition.notes && (
        <p className="text-ink/60 mt-8 leading-relaxed">
          {edition.notes}
        </p>
      )}
    </div>
  );
}
