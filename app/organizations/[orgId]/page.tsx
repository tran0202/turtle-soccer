import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllOrgIds,
  getOrganization,
  getBreadcrumbAncestors,
  getChildOrganizations,
  getCompetitionsByOrg,
} from "@/lib/data";
import { OrgMark } from "@/components/OrgMark";
import { CompetitionMark } from "@/components/CompetitionMark";
import { NameWithFlag } from "@/components/NameWithFlag";
import { Breadcrumb } from "@/components/Breadcrumb";

export function generateStaticParams() {
  return getAllOrgIds().map((orgId) => ({ orgId }));
}

const LEVEL_LABELS: Record<string, string> = {
  global: "Global governing body",
  confederation: "Confederation",
  association: "National association",
  league: "League",
};

export default function OrganizationPage({
  params,
}: {
  params: { orgId: string };
}) {
  const org = getOrganization(params.orgId);
  if (!org) return notFound();
  const competitions = getCompetitionsByOrg(org.id);
  const children = getChildOrganizations(org.id);
  const ancestors = getBreadcrumbAncestors(org.id);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Organizations", href: "/organizations" },
          ...ancestors.map((a, i) => ({
            label: a.name,
            href: i < ancestors.length - 1 ? `/organizations/${a.id}` : undefined,
          })),
        ]}
      />

      <div className="flex items-start gap-3 mt-4 mb-10">
        <OrgMark orgId={org.id} orgName={org.name} size="lg" />
        <div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h1 className="font-display text-5xl uppercase tracking-tight">
              {org.name}
            </h1>
            <span className="text-sm text-ink/50">
              {org.fullName}
              {org.country && (
                <>
                  {" "}
                  &middot; <NameWithFlag name={org.country} isCountry size="sm" />
                </>
              )}
            </span>
          </div>
          <p className="text-ink/60 max-w-lg mt-2">{org.description}</p>
        </div>
      </div>

      {children.length > 0 && (
        <>
          <h2 className="text-xs uppercase tracking-wide text-turtle-green mb-3">
            Members
          </h2>
          <ul className="border-t border-paper-line mb-10">
            {children.map((child) => (
              <li key={child.id} className="border-b border-paper-line">
                <Link
                  href={`/organizations/${child.id}`}
                  className="group flex items-center justify-between gap-6 py-4 hover:bg-paper-surface transition-colors px-2 -mx-2"
                >
                  <div className="flex items-center gap-3">
                    <OrgMark orgId={child.id} orgName={child.name} size="sm" />
                    <div>
                      <div className="font-display text-xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
                        {child.name}
                      </div>
                      <div className="text-sm text-ink/50 mt-0.5">
                        {child.country ? (
                          <NameWithFlag
                            name={child.country}
                            isCountry
                            size="sm"
                          />
                        ) : (
                          child.fullName
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-turtle-green shrink-0">
                    {LEVEL_LABELS[child.level]}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {competitions.length > 0 && (
        <>
          <h2 className="text-xs uppercase tracking-wide text-turtle-green mb-3">
            Competitions
          </h2>
          <ul className="border-t border-paper-line">
            {competitions.map((t) => (
              <li key={t.id} className="border-b border-paper-line">
                <Link
                  href={`/organizations/${org.id}/competitions/${t.id}`}
                  className="group flex items-center justify-between gap-6 py-5 hover:bg-paper-surface transition-colors px-2 -mx-2"
                >
                  <div className="flex items-center gap-3">
                    <CompetitionMark competitionId={t.id} competitionName={t.name} size="md" />
                    <div>
                      <div className="font-display text-2xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
                        {t.name}
                      </div>
                      <div className="text-sm text-ink/50 mt-0.5">
                        {t.frequency}
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs uppercase tracking-wide text-turtle-green">
                      {t.scope} · {t.gender}
                    </div>
                    <div className="text-xs text-ink/40 mt-0.5">
                      since {t.founded}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}

      {children.length === 0 && competitions.length === 0 && (
        <p className="text-ink/40 text-sm">Nothing on record here yet.</p>
      )}
    </div>
  );
}
