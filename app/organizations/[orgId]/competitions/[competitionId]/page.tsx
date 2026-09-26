import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllCompetitionIds,
  getEditionsByCompetition,
  getOrganization,
  getBreadcrumbAncestors,
  getCompetition,
} from "@/lib/data";
import { CompetitionMark } from "@/components/CompetitionMark";
import { EditionMark } from "@/components/EditionMark";
import { NameWithFlag } from "@/components/NameWithFlag";
import { Breadcrumb } from "@/components/Breadcrumb";

export function generateStaticParams() {
  return getAllCompetitionIds();
}

export default function CompetitionPage({
  params,
}: {
  params: { orgId: string; competitionId: string };
}) {
  const org = getOrganization(params.orgId);
  const competition = getCompetition(params.competitionId);
  if (!org || !competition || competition.organizationId !== org.id) {
    return notFound();
  }
  const editions = getEditionsByCompetition(competition.id);
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
          { label: competition.name },
        ]}
      />

      <div className="flex items-start gap-3 mt-4 mb-10">
        <CompetitionMark competitionId={competition.id} competitionName={competition.name} size="lg" />
        <div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-display text-6xl uppercase tracking-tight">
              {competition.name}
            </h1>
            {org.country && (
              <span className="text-base text-ink/50">
                <NameWithFlag name={org.country} isCountry size="sm" />
              </span>
            )}
          </div>
          <p className="text-ink/60 max-w-lg mt-2">{competition.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="uppercase tracking-wide text-ink/50">
              {competition.scope} · {competition.gender}
            </span>
            <span className="text-ink/40">since {competition.founded}</span>
          </div>
        </div>
      </div>

      <h2 className="text-sm uppercase tracking-wide text-turtle-green mb-3">
        Editions
      </h2>

      {(() => {
        // A competition's format is usually consistently one or the other —
        // always crowns a 3rd/4th place, or never does — so the shared
        // column header defaults to whichever most editions use. Ties (or a
        // minority using thirdPlace) favor "Semifinalist": it's the safer
        // default when a format is inconsistent, since "Third place" implies
        // a certainty that isn't true for every row. Whichever way the
        // header defaults, individual rows that don't match it (Copa
        // América's 1983, played with no 3rd-place match at all; the 2015
        // Gold Cup, which added one for the only time since 2003) get a
        // small in-cell label clarifying what's actually shown there.
        const withThirdPlace = editions.filter((e) => e.thirdPlace !== null).length;
        const usesSemifinalists = withThirdPlace <= editions.length / 2;

        return (
          <>
            <div className="grid grid-cols-[22rem_1fr_1fr_1fr_1fr] gap-4 px-4 pb-2">
              <div />
              <div className="text-sm uppercase tracking-wide text-turtle-green">
                Champion
              </div>
              <div className="text-sm uppercase tracking-wide text-turtle-green">
                Runner-up
              </div>
              <div className="text-sm uppercase tracking-wide text-turtle-green">
                {usesSemifinalists ? "Semifinalist" : "Third place"}
              </div>
              <div className="text-sm uppercase tracking-wide text-turtle-green">
                {usesSemifinalists ? "Semifinalist" : "Fourth place"}
              </div>
            </div>

            <ul className="flex flex-col gap-3">
              {editions.map((e) => {
                const isCountry = competition.scope === "national";
                return (
                  <li
                    key={e.id}
                    className="border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]"
                  >
                    <Link
                      href={`/organizations/${org.id}/competitions/${competition.id}/editions/${e.id}`}
                      className="group grid grid-cols-[22rem_1fr_1fr_1fr_1fr] items-center gap-4 py-5 px-4 hover:bg-paper-surface transition-colors rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <EditionMark editionId={e.id} editionLabel={e.label} size="sm" />
                        <div className="font-display text-3xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
                          {e.label}
                        </div>
                      </div>
                      <div className="font-display text-3xl uppercase tracking-tight text-turtle-blue">
                        <NameWithFlag name={e.champion} isCountry={isCountry} size="lg" />
                      </div>
                      <div className="font-display text-3xl uppercase tracking-tight">
                        <NameWithFlag name={e.runnerUp} isCountry={isCountry} size="lg" />
                      </div>
                      <div className="font-display text-3xl uppercase tracking-tight text-ink/60">
                        {e.coThirdPlace ? (
                          <>
                            <div className="font-body normal-case text-xs tracking-normal text-ink/30 mb-0.5">
                              Joint third
                            </div>
                            <NameWithFlag name={e.coThirdPlace[0]} isCountry={isCountry} size="lg" />
                          </>
                        ) : e.semifinalists ? (
                          <>
                            {!usesSemifinalists && (
                              <div className="font-body normal-case text-xs tracking-normal text-ink/30 mb-0.5">
                                Semifinalist
                              </div>
                            )}
                            <NameWithFlag name={e.semifinalists[0]} isCountry={isCountry} size="lg" />
                          </>
                        ) : e.thirdPlace ? (
                          <>
                            {usesSemifinalists && (
                              <div className="font-body normal-case text-xs tracking-normal text-ink/30 mb-0.5">
                                Third place
                              </div>
                            )}
                            <NameWithFlag name={e.thirdPlace} isCountry={isCountry} size="lg" />
                          </>
                        ) : (
                          <span className="text-ink/30">—</span>
                        )}
                      </div>
                      <div
                        className={`font-display text-3xl uppercase tracking-tight ${
                          e.coThirdPlace || e.semifinalists ? "text-ink/60" : "text-ink/40"
                        }`}
                      >
                        {e.coThirdPlace ? (
                          <>
                            <div className="font-body normal-case text-xs tracking-normal text-ink/30 mb-0.5">
                              Joint third
                            </div>
                            <NameWithFlag name={e.coThirdPlace[1]} isCountry={isCountry} size="lg" />
                          </>
                        ) : e.semifinalists ? (
                          <>
                            {!usesSemifinalists && (
                              <div className="font-body normal-case text-xs tracking-normal text-ink/30 mb-0.5">
                                Semifinalist
                              </div>
                            )}
                            <NameWithFlag name={e.semifinalists[1]} isCountry={isCountry} size="lg" />
                          </>
                        ) : e.fourthPlace ? (
                          <>
                            {usesSemifinalists && (
                              <div className="font-body normal-case text-xs tracking-normal text-ink/30 mb-0.5">
                                Fourth place
                              </div>
                            )}
                            <NameWithFlag name={e.fourthPlace} isCountry={isCountry} size="lg" />
                          </>
                        ) : (
                          <span className="text-ink/30">—</span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        );
      })()}
    </div>
  );
}
