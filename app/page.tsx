import Link from "next/link";
import { getEdition, getOrganization, getTournament } from "@/lib/data";
import { FlagGroup } from "@/components/Flag";
import { NameWithFlag } from "@/components/NameWithFlag";

export default function HomePage() {
  const edition = getEdition("world-cup-2022")!;
  const tournament = getTournament(edition.tournamentId)!;
  const org = getOrganization(tournament.organizationId)!;

  return (
    <div>
      <h1 className="font-display text-4xl uppercase tracking-tight mb-2">
        Welcome
      </h1>
      <p className="text-ink/60 mb-10 max-w-md">
        A record of soccer organizations, their tournaments, and every
        edition played.
      </p>

      <Link
        href={`/organizations/${org.id}/tournaments/${tournament.id}/editions/${edition.id}`}
        className="group relative block overflow-hidden rounded-none bg-turtle-blue text-paper"
      >
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.12]"
          viewBox="0 0 400 200"
          preserveAspectRatio="xMaxYMid slice"
          aria-hidden="true"
        >
          <circle cx="330" cy="100" r="90" fill="none" stroke="white" strokeWidth="2" />
          <path
            d="M330 22 L367 52 L353 96 L307 96 L293 52 Z"
            fill="none"
            stroke="white"
            strokeWidth="2"
          />
          <path
            d="M330 22 L293 52 M330 22 L367 52 M293 52 L280 100 M367 52 L380 100 M307 96 L280 100 M353 96 L380 100 M307 96 L353 96"
            stroke="white"
            strokeWidth="2"
          />
        </svg>

        <div className="relative p-8 sm:p-10">
          <div className="text-xs uppercase tracking-widest text-paper/60 mb-3">
            Featured edition
          </div>
          <div className="font-display text-3xl sm:text-4xl uppercase tracking-tight">
            {tournament.name}
          </div>
          <div className="font-display text-2xl sm:text-3xl uppercase tracking-tight text-turtle-green flex items-center gap-2">
            <span>{edition.label}</span>
            <span aria-hidden="true">&middot;</span>
            <FlagGroup codes={edition.hostCodes} label={edition.host} />
          </div>
          <div className="mt-4 text-paper/80">
            Champion:{" "}
            <span className="font-semibold text-paper">
              <NameWithFlag
                name={edition.champion}
                isCountry={tournament.scope === "national"}
                size="sm"
              />
            </span>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-wide text-paper group-hover:text-turtle-green transition-colors">
            View edition
            <span aria-hidden="true">&rarr;</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
