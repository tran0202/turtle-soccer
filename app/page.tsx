import Link from "next/link";
import { getOrganizations } from "@/lib/data";

export default function HomePage() {
  const organizations = getOrganizations();

  return (
    <div>
      <h1 className="font-display text-5xl uppercase tracking-tight mb-2">
        Organizations
      </h1>
      <p className="text-ink/60 mb-10 max-w-md">
        Every governing body in this archive, from global federations down to
        a single domestic league.
      </p>

      <ul className="border-t border-paper-line">
        {organizations.map((org) => (
          <li key={org.id} className="border-b border-paper-line">
            <Link
              href={`/organizations/${org.id}`}
              className="group flex items-baseline justify-between gap-6 py-5 hover:bg-paper-surface transition-colors px-2 -mx-2"
            >
              <div>
                <div className="font-display text-2xl uppercase tracking-tight group-hover:text-turtle-blue transition-colors">
                  {org.name}
                </div>
                <div className="text-sm text-ink/50 mt-0.5">
                  {org.fullName}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs uppercase tracking-wide text-turtle-green">
                  {org.scope}
                </div>
                <div className="text-xs text-ink/40 mt-0.5">
                  est. {org.founded}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
