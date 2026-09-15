import Link from "next/link";
import { getAllCompetitions, getOrganization, type Competition, type Organization } from "@/lib/data";
import { OrgMark } from "@/components/OrgMark";
import { CompetitionMark } from "@/components/CompetitionMark";
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

function CompetitionRow({ c, org }: { c: Competition; org: Organization }) {
  return (
    <li className="border-b border-paper-line">
      <Link
        href={`/organizations/${org.id}/competitions/${c.id}`}
        className="group flex items-center justify-between gap-6 py-5 hover:bg-paper-surface transition-colors px-2 -mx-2"
      >
        <div className="flex items-center gap-3">
          <CompetitionMark competitionId={c.id} competitionName={c.name} size="md" />
          <div>
            <div className="font-display text-2xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
              {c.name}
            </div>
            <div className="text-sm text-ink/50 mt-0.5">{c.frequency}</div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-xs uppercase tracking-wide text-turtle-green">
            {c.scope} · {c.gender}
          </div>
          <div className="text-xs text-ink/40 mt-0.5">since {c.founded}</div>
        </div>
      </Link>
    </li>
  );
}

export default function CompetitionsPage() {
  const competitions = getAllCompetitions();

  return (
    <div>
      <h1 className="font-display text-5xl uppercase tracking-tight mb-10">
        Competitions
      </h1>

      {GROUP_ORDER.map(({ level, title, subGroup }) => {
        const group = competitions.filter(
          (c) => getOrganization(c.organizationId)?.level === level
        );
        if (group.length === 0) return null;

        if (!subGroup) {
          const sectionOrg = getOrganization(group[0].organizationId)!;
          return (
            <div key={level} className="mb-10">
              <h2 className="font-display text-lg uppercase tracking-tight mb-5 flex items-center gap-2">
                <OrgMark orgId={sectionOrg.id} orgName={sectionOrg.name} size="sm" />
                {title}
              </h2>
              <ul className="border-t border-paper-line">
                {group.map((c) => (
                  <CompetitionRow key={c.id} c={c} org={getOrganization(c.organizationId)!} />
                ))}
              </ul>
            </div>
          );
        }

        // Sub-group by owning org, preserving first-appearance order.
        const byOrg: { org: Organization; competitions: Competition[] }[] = [];
        for (const c of group) {
          const org = getOrganization(c.organizationId)!;
          let entry = byOrg.find((b) => b.org.id === org.id);
          if (!entry) {
            entry = { org, competitions: [] };
            byOrg.push(entry);
          }
          entry.competitions.push(c);
        }

        return (
          <div key={level} className="mb-10">
            <h2 className="text-xs uppercase tracking-wide text-turtle-green mb-3">
              {title}
            </h2>
            {byOrg.map(({ org, competitions: orgCompetitions }) => (
              <div key={org.id} className="mb-6 last:mb-0">
                <h3 className="font-display text-lg uppercase tracking-tight mb-5 flex items-center gap-2">
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
                  {orgCompetitions.map((c) => (
                    <CompetitionRow key={c.id} c={c} org={org} />
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
