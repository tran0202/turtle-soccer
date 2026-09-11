import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllOrgIds,
  getOrganization,
  getTournamentsByOrg,
} from "@/lib/data";
import { InitialsBadge } from "@/components/InitialsBadge";
import { OrgMark } from "@/components/OrgMark";
import { NameWithFlag } from "@/components/NameWithFlag";
import { Breadcrumb } from "@/components/Breadcrumb";

export function generateStaticParams() {
  return getAllOrgIds().map((orgId) => ({ orgId }));
}

export default function OrganizationPage({
  params,
}: {
  params: { orgId: string };
}) {
  const org = getOrganization(params.orgId);
  if (!org) return notFound();
  const tournaments = getTournamentsByOrg(org.id);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Organizations", href: "/organizations" },
          { label: org.name },
        ]}
      />

      <div className="flex items-center gap-3 mt-4 mb-2">
        <OrgMark orgId={org.id} orgName={org.name} size="lg" />
        <h1 className="font-display text-5xl uppercase tracking-tight">
          {org.name}
        </h1>
      </div>
      <div className="mb-10">
        <p className="text-ink/60 max-w-lg">{org.description}</p>
        {org.country && (
          <p className="text-sm text-ink/50 mt-2">
            <NameWithFlag name={org.country} isCountry size="sm" />
          </p>
        )}
      </div>

      <h2 className="text-xs uppercase tracking-wide text-turtle-green mb-3">
        Tournaments
      </h2>
      <ul className="border-t border-paper-line">
        {tournaments.map((t) => (
          <li key={t.id} className="border-b border-paper-line">
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
    </div>
  );
}
