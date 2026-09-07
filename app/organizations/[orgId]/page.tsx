import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllOrgIds,
  getOrganization,
  getTournamentsByOrg,
} from "@/lib/data";

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
      <Link
        href="/"
        className="text-sm text-ink/50 hover:text-turtle-blue transition-colors"
      >
        ← Organizations
      </Link>

      <h1 className="font-display text-5xl uppercase tracking-tight mt-4 mb-2">
        {org.name}
      </h1>
      <p className="text-ink/60 mb-10 max-w-lg">{org.description}</p>

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
              <div>
                <div className="font-display text-2xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
                  {t.name}
                </div>
                <div className="text-sm text-ink/50 mt-0.5">
                  {t.frequency}
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
