import Link from "next/link";
import { getAllCompetitions, getOrganization, type Competition, type Organization } from "@/lib/data";
import { OrgMark } from "@/components/OrgMark";
import { CompetitionMark } from "@/components/CompetitionMark";

// This page covers the marquee tier only — FIFA and confederation-level
// competitions. National-association competitions (a country's domestic
// league and cup) live on that association's own org page instead: with 8+
// associations and growing, listing every domestic league here too would
// make this page unbounded in length for comparatively little benefit, since
// anyone looking for "Spain's league" is more likely to browse organizations
// (FIFA > UEFA > RFEF) than scroll a flat competitions list.
const GROUP_ORDER: { level: string; title: string; subGroup: boolean }[] = [
  { level: "global", title: "FIFA", subGroup: false },
  { level: "confederation", title: "Confederations", subGroup: true },
];

function CompetitionRow({ c, org }: { c: Competition; org: Organization }) {
  const scopeAndYear = (
    <>
      <div className="text-sm uppercase tracking-wide text-turtle-green">
        {c.scope} · {c.gender}
      </div>
      <div className="text-sm text-ink/40 mt-0.5">since {c.founded}</div>
    </>
  );

  return (
    <li className="border-b border-paper-line">
      <Link
        href={`/organizations/${org.id}/competitions/${c.id}`}
        className="group flex sm:items-center sm:justify-between gap-6 py-5 hover:bg-paper-surface transition-colors pl-24 pr-2 -mx-2"
      >
        <div className="flex items-center gap-3">
          <CompetitionMark competitionId={c.id} competitionName={c.name} size="md" />
          <div>
            <div className="font-display text-3xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
              {c.name}
            </div>
            <div className="text-base text-ink/50 mt-0.5">{c.frequency}</div>
            <div className="mt-2 sm:hidden">{scopeAndYear}</div>
          </div>
        </div>
        <div className="hidden sm:block sm:text-right shrink-0">
          {scopeAndYear}
        </div>
      </Link>
    </li>
  );
}

export default function CompetitionsPage() {
  const competitions = getAllCompetitions();

  return (
    <div>
      <h1 className="font-display text-6xl uppercase tracking-tight mb-2">
        Competitions
      </h1>
      <p className="text-ink/60 mb-10 max-w-lg">
        FIFA and confederation-level competitions. Looking for a national
        association&apos;s domestic league or cup?{" "}
        <Link href="/organizations" className="text-turtle-blue hover:text-turtle-green transition-colors">
          Browse organizations
        </Link>{" "}
        instead.
      </p>

      {GROUP_ORDER.map(({ level, title, subGroup }) => {
        const group = competitions.filter(
          (c) => getOrganization(c.organizationId)?.level === level
        );
        if (group.length === 0) return null;

        if (!subGroup) {
          const sectionOrg = getOrganization(group[0].organizationId)!;
          return (
            <div key={level} className="mb-10">
              <h2 className="font-display text-3xl uppercase tracking-tight mb-5 flex items-center gap-2">
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
            <h2 className="font-display text-3xl uppercase tracking-tight mb-5 flex items-center gap-2">
              {title}
            </h2>
            {byOrg.map(({ org, competitions: orgCompetitions }) => (
              <div key={org.id} className="mb-6 last:mb-0">
                <h3 className="font-display text-3xl uppercase tracking-tight mb-5 flex items-center gap-2">
                  <OrgMark orgId={org.id} orgName={org.name} size="sm" />
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
