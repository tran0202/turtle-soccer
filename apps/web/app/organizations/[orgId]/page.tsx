import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllOrgIds,
  getOrganization,
  getBreadcrumbAncestors,
  getChildOrganizations,
  getCompetitionsByOrg,
} from "@turtle-soccer/core";
import { OrgMark } from "@/components/OrgMark";
import { CompetitionMark } from "@/components/CompetitionMark";
import { NameWithFlag } from "@/components/NameWithFlag";
import { Breadcrumb } from "@/components/Breadcrumb";

export async function generateStaticParams() {
  return (await getAllOrgIds()).map((orgId) => ({ orgId }));
}

export default async function OrganizationPage({
  params,
}: {
  params: { orgId: string };
}) {
  const org = await getOrganization(params.orgId);
  if (!org) return notFound();
  const competitions = await getCompetitionsByOrg(org.id);
  const children = await getChildOrganizations(org.id);
  const ancestors = await getBreadcrumbAncestors(org.id);
  // Pre-resolved per child before rendering, since the JSX below maps over
  // `children` synchronously (an async callback inside .map() wouldn't
  // resolve the way that render expects).
  const childAssociationCounts = await Promise.all(
    children.map(async (child) =>
      org.level === "global" ? (await getChildOrganizations(child.id)).length : null
    )
  );

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

      <div className="flex flex-col sm:flex-row sm:items-start gap-3 mt-4 mb-10">
        <div className="self-center sm:self-auto">
          <OrgMark orgId={org.id} orgName={org.name} size="lg" />
        </div>
        <div>
          <h1 className="font-display text-6xl uppercase tracking-tight">
            {org.name}
          </h1>
          <div className="text-base text-ink/50 mt-1">
            {org.fullName}
            {org.country && (
              <>
                {" "}
                &middot; <NameWithFlag name={org.country} isCountry size="sm" />
              </>
            )}
          </div>
          <p className="text-ink/60 max-w-lg mt-2">{org.description}</p>
          {org.confederationHistory && (
            <p className="text-sm text-ink/40 mt-2">
              {org.confederationHistory}
            </p>
          )}
          {org.fifaAffiliation && (
            <p className="text-sm text-ink/40 mt-2">{org.fifaAffiliation}</p>
          )}
        </div>
      </div>

      {(() => {
        const membersSection = children.length > 0 && (
          <>
            <h2 className="text-sm uppercase tracking-wide text-turtle-green mb-3">
              {(() => {
                if (org.level === "global") return "Confederations";
                if (org.level !== "confederation") return "Members";
                const associateCount = children.filter(
                  (c) => c.confederationStatus === "associate"
                ).length;
                const fullCount = children.length - associateCount;
                return associateCount > 0
                  ? `National Associations (${fullCount} full, ${associateCount} associate)`
                  : `National Associations (${children.length})`;
              })()}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {children.map((child, i) => {
                const associationCount = childAssociationCounts[i];
                return (
                  <li key={child.id} className="border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
                    <Link
                      href={`/organizations/${child.id}`}
                      className="group flex items-center gap-3 p-4 hover:bg-paper-surface transition-colors h-full rounded-lg"
                    >
                      <OrgMark orgId={child.id} orgName={child.name} size="card" />
                      <div>
                        <div className="font-display text-3xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
                          {child.name}
                        </div>
                        <div className="text-base text-ink/50 mt-0.5">
                          {associationCount !== null
                            ? `${associationCount} national association${associationCount === 1 ? "" : "s"}`
                            : child.country ? (
                            <NameWithFlag
                              name={child.country}
                              isCountry
                              size="sm"
                            />
                          ) : (
                            child.fullName
                          )}
                        </div>
                        {child.confederationHistory && (
                          <div className="text-xs text-ink/30 mt-0.5">
                            {child.confederationHistory}
                          </div>
                        )}
                        {child.fifaAffiliation && (
                          <div className="text-xs text-ink/30 mt-0.5">
                            {child.fifaAffiliation}
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        );

        const competitionsSection = competitions.length > 0 && (
          <>
            <h2 className="text-sm uppercase tracking-wide text-turtle-green mb-3">
              Competitions
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {competitions.map((t) => (
                <li key={t.id} className="border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
                  <Link
                    href={`/organizations/${org.id}/competitions/${t.id}`}
                    className="group flex items-center gap-4 p-4 hover:bg-paper-surface transition-colors h-full rounded-lg"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <CompetitionMark competitionId={t.id} competitionName={t.name} size="card" />
                      <div>
                        <div className="font-display text-3xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
                          {t.name}
                        </div>
                        <div className="text-base text-ink/50 mt-0.5">
                          {t.frequency}
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        );

        // Competitions come first everywhere — they're the actual focus of
        // the archive, while the association/confederation lists are more
        // of a directory and are often quite long.
        return (
          <>
            {competitionsSection}
            {membersSection}
          </>
        );
      })()}

      {children.length === 0 && competitions.length === 0 && (
        <p className="text-ink/40 text-base">Nothing on record here yet.</p>
      )}
    </div>
  );
}
