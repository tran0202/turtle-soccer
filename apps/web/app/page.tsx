import Link from "next/link";
import { getEdition, getOrganization, getCompetition } from "@turtle-soccer/core";
import { FlagGroup } from "@/components/Flag";
import { NameWithFlag } from "@/components/NameWithFlag";

export default async function HomePage() {
  const edition = (await getEdition("world-cup-2026"))!;
  const competition = (await getCompetition(edition.competitionId))!;
  const org = (await getOrganization(competition.organizationId))!;

  return (
    <div>
      <h1 className="font-display text-5xl uppercase tracking-tight mb-2">
        Welcome
      </h1>
      <p className="text-ink/60 mb-10 max-w-md">
        A record of soccer organizations, their competitions, and every
        edition played.
      </p>

      <Link
        href={`/organizations/${org.id}/competitions/${competition.id}/editions/${edition.id}`}
        className="group relative block overflow-hidden rounded-lg shadow-[3px_3px_6px_rgba(23,26,33,0.08)] bg-turtle-blue text-paper"
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
          <div className="text-sm uppercase tracking-widest text-paper/60 mb-3">
            Featured edition
          </div>
          <div className="font-display text-4xl uppercase tracking-tight flex items-center flex-wrap gap-3">
            <span>{competition.name}</span>
            <FlagGroup
              codes={edition.hosts.map((h) => h.code)}
              label={edition.hosts.map((h) => h.name).join(" / ")}
              size="xl"
            />
            <span>{edition.label}</span>
          </div>
          <div className="mt-4 text-paper/80">
            Champion:{" "}
            <span className="font-semibold text-paper">
              <NameWithFlag
                name={edition.champion}
                isCountry={competition.scope === "national"}
                size="lg"
              />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
