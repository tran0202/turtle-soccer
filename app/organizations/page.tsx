import Link from "next/link";
import { getRootOrganizations, getChildOrganizations } from "@/lib/data";
import { OrgMark } from "@/components/OrgMark";
import { NameWithFlag } from "@/components/NameWithFlag";

function OrgRow({
  org,
  card = false,
}: {
  org: ReturnType<typeof getRootOrganizations>[number];
  card?: boolean;
}) {
  const childCount = getChildOrganizations(org.id).length;
  const childLabel =
    org.level === "global"
      ? "confederation"
      : org.level === "confederation"
      ? "national association"
      : "member";

  const scopeAndCount = (
    <>
      <div className="text-sm uppercase tracking-wide text-turtle-green">
        {org.scope === "both" ? "national · club" : org.scope}
      </div>
      <div className="text-sm text-ink/40 mt-0.5">
        {childCount > 0
          ? `${childCount} ${childLabel}${childCount === 1 ? "" : "s"}`
          : `est. ${org.founded}`}
      </div>
    </>
  );

  return (
    <Link
      href={`/organizations/${org.id}`}
      className={
        card
          ? "group flex sm:items-center sm:justify-between gap-6 p-4 hover:bg-paper-surface transition-colors rounded-lg"
          : "group flex sm:items-center sm:justify-between gap-6 py-5 hover:bg-paper-surface transition-colors px-2 -mx-2"
      }
    >
      <div className="flex items-center gap-3 w-full">
        <OrgMark orgId={org.id} orgName={org.name} size="md" />
        <div>
          <div className="font-display text-3xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
            {org.name}
          </div>
          <div className="text-base text-ink/50 mt-0.5">
            {org.fullName}
            {org.country && (
              <>
                {" "}
                &middot; <NameWithFlag name={org.country} isCountry size="sm" />
              </>
            )}
          </div>
          <div className="mt-2 sm:hidden">{scopeAndCount}</div>
        </div>
      </div>
      <div className="hidden sm:block sm:text-right shrink-0">
        {scopeAndCount}
      </div>
    </Link>
  );
}

export default function OrganizationsPage() {
  const organizations = getRootOrganizations();

  return (
    <div>
      <h1 className="font-display text-6xl uppercase tracking-tight mb-10">
        Organizations
      </h1>

      <div className="flex flex-col gap-4">
        {organizations.map((org) => {
          const confederations = getChildOrganizations(org.id);
          return (
            <div key={org.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]">
                  <OrgRow org={org} card />
                </div>
              </div>

              {confederations.length > 0 && (
                <div>
                  <div className="text-sm uppercase tracking-wide text-turtle-green mb-3">
                    Confederations
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {confederations.map((conf) => (
                      <li
                        key={conf.id}
                        className="border border-paper-line rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)]"
                      >
                        <OrgRow org={conf} card />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
