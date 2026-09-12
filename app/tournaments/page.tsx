import Link from "next/link";
import { getAllTournaments, getOrganization, type Tournament, type Organization } from "@/lib/data";
import { InitialsBadge } from "@/components/InitialsBadge";
import { OrgMark } from "@/components/OrgMark";
import { NameWithFlag } from "@/components/NameWithFlag";

// "confederation" and "association" get a sub-header per owning org (UEFA vs
// CONMEBOL, FA vs RFEF, etc). "global" (FIFA) and "league" don't — there's
// only ever one org in those groups, so a sub-header would just repeat the
// section title.
const GROUP_ORDER: { level: string; title: string; subGroup: boolean }[] = [
  { level: "global", title: "FIFA", subGroup: false },
  { level: "confederation", title: "Confederations", subGroup: true },
  { level: "association", title: "National associations", subGroup: true },
  { level: "league", title: "Leagues", subGroup: false },
];

function TournamentRow({ t, org }: { t: Tournament; org: Organization }) {
  return (
    <li className="border-b border-paper-line">
      <Link
        href={`/organizations/${org.id}/tournaments/${t.id}`}
        className="group flex items-baseline justify-between gap-6 py-5 hover:bg-paper-surface transition-colors px-2 -mx-2"
      >
        <div className="flex items-baseline gap-3">
          <InitialsBadge name={t.name} size="md" />
          <div>
            <div className="font-display text-2xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
              {t.name}
            </div>
            <div className="text-sm text-ink/50 mt-0.5">{t.frequency}</div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs uppercase tracking-wide text-turtle-green">
            {t.scope} · {t.gender}
          </div>
          <div className="text-xs text-ink/40 mt-0.5">since {t.founded}</div>
        </div>
      </Link>
    </li>
  );
}

export default function TournamentsPage() {
  const tournaments = getAllTournaments();

  return (
    <div>
      <h1 className="font-display text-5xl uppercase tracking-tight mb-10">
        Tournaments
      </h1>

      {GROUP_ORDER.map(({ level, title, subGroup }) => {
        const group = tournaments.filter(
          (t) => getOrganization(t.organizationId)?.level === level
        );
        if (group.length === 0) return null;

        if (!subGroup) {
          const sectionOrg = getOrganization(group[0].organizationId)!;
          return (
            <div key={level} className="mb-10">
              <h2 className="font-display text-lg uppercase tracking-tight mb-3 flex items-center gap-2">
                <OrgMark orgId={sectionOrg.id} orgName={sectionOrg.name} size="sm" />
                {title}
              </h2>
              <ul className="border-t border-paper-line">
                {group.map((t) => (
                  <TournamentRow key={t.id} t={t} org={getOrganization(t.organizationId)!} />
                ))}
              </ul>
            </div>
          );
        }

        // Sub-group by owning org, preserving first-appearance order.
        const byOrg: { org: Organization; tournaments: Tournament[] }[] = [];
        for (const t of group) {
          const org = getOrganization(t.organizationId)!;
          let entry = byOrg.find((b) => b.org.id === org.id);
          if (!entry) {
            entry = { org, tournaments: [] };
            byOrg.push(entry);
          }
          entry.tournaments.push(t);
        }

        return (
          <div key={level} className="mb-10">
            <h2 className="text-xs uppercase tracking-wide text-turtle-green mb-3">
              {title}
            </h2>
            {byOrg.map(({ org, tournaments: orgTournaments }) => (
              <div key={org.id} className="mb-6 last:mb-0">
                <h3 className="font-display text-lg uppercase tracking-tight mb-1 flex items-center gap-2">
                  {level === "confederation" && (
                    <OrgMark orgId={org.id} orgName={org.name} size="sm" />
                  )}
                  {level === "association" && org.country && (
                    <span className="text-sm text-ink/50 normal-case font-body tracking-normal">
                      <NameWithFlag name={org.country} isCountry size="sm" />
                    </span>
                  )}
                  {org.name}
                </h3>
                <ul className="border-t border-paper-line">
                  {orgTournaments.map((t) => (
                    <TournamentRow key={t.id} t={t} org={org} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
