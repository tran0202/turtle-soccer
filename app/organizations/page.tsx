import Link from "next/link";
import { getRootOrganizations, getChildOrganizations } from "@/lib/data";
import { OrgMark } from "@/components/OrgMark";
import { NameWithFlag } from "@/components/NameWithFlag";

function OrgRow({ org }: { org: ReturnType<typeof getRootOrganizations>[number] }) {
  const childCount = getChildOrganizations(org.id).length;
  return (
    <Link
      href={`/organizations/${org.id}`}
      className="group flex items-baseline justify-between gap-6 py-5 hover:bg-paper-surface transition-colors px-2 -mx-2"
    >
      <div className="flex items-center gap-3">
        <OrgMark orgId={org.id} orgName={org.name} size="md" />
        <div>
          <div className="font-display text-2xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
            {org.name}
          </div>
          <div className="text-sm text-ink/50 mt-0.5">
            {org.fullName}
            {org.country && (
              <>
                {" "}
                &middot; <NameWithFlag name={org.country} isCountry size="sm" />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-xs uppercase tracking-wide text-turtle-green">
          {org.scope === "both" ? "national · club" : org.scope}
        </div>
        <div className="text-xs text-ink/40 mt-0.5">
          {childCount > 0 ? `${childCount} members` : `est. ${org.founded}`}
        </div>
      </div>
    </Link>
  );
}

export default function OrganizationsPage() {
  const organizations = getRootOrganizations();

  return (
    <div>
      <h1 className="font-display text-5xl uppercase tracking-tight mb-10">
        Organizations
      </h1>

      <ul className="border-t border-paper-line">
        {organizations.map((org) => {
          const confederations = getChildOrganizations(org.id);
          return (
            <li key={org.id} className="border-b border-paper-line">
              <OrgRow org={org} />

              {confederations.length > 0 && (
                <div className="pb-4">
                  <div className="text-xs uppercase tracking-wide text-turtle-green mb-1 px-2">
                    Confederations
                  </div>
                  <ul>
                    {confederations.map((conf) => (
                      <li key={conf.id}>
                        <OrgRow org={conf} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
