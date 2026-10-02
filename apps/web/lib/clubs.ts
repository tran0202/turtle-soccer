// Maps club names used in champion/runnerUp/thirdPlace/fourthPlace/
// semifinalists for club-scope competitions to their home country's FIFA
// 3-letter code. Add an entry here whenever a new club shows up in the
// data. (Separate from lib/countries.ts, which maps country *names* like
// "Argentina" to codes — this maps club names, which aren't countries.)
//
// A few names below are disambiguated with a suffix (e.g. "Liverpool
// (Montevideo)") because a same-named or similarly-named club from a different
// country already has an entry — the edition data must use these exact
// disambiguated strings, not the plain club name, for those specific clubs.
const CLUB_COUNTRY_CODES: Record<string, string> = {
  Arsenal: "ENG",
  "Aston Villa": "ENG",
  "Atlético Junior": "COL",
  "Atlético Madrid": "ESP",
  "Atlético Mineiro": "BRA",
  Barcelona: "ESP",
  "Bayer Leverkusen": "GER",
  "Bayern Munich": "GER",
  "Boca Juniors": "ARG",
  "Borussia Dortmund": "GER",
  Brest: "FRA",
  Chelsea: "ENG",
  "Defensor Sporting": "URU",
  "Deportivo Independiente Medellín": "COL",
  Flamengo: "BRA",
  Fluminense: "BRA",
  Girona: "ESP",
  "Grêmio": "BRA",
  Internacional: "BRA",
  "Lanús": "ARG",
  Lille: "FRA",
  Liverpool: "ENG",
  "Liverpool (Montevideo)": "URU",
  "Manchester City": "ENG",
  Monaco: "MON",
  Nacional: "URU",
  Palmeiras: "BRA",
  "Paris Saint-Germain": "FRA",
  "Peñarol": "URU",
  "RB Leipzig": "GER",
  "Real Madrid": "ESP",
  "River Plate": "ARG",
  "San Lorenzo": "ARG",
  "Talleres (Córdoba)": "ARG",
  "VfB Stuttgart": "GER",
};

export function getClubCountryCode(name: string): string | undefined {
  return CLUB_COUNTRY_CODES[name];
}

// Short 3-letter codes for compact display (e.g. mobile edition-table rows),
// parallel to how country names resolve to FIFA codes. Unlike countries,
// clubs have no single official 3-letter standard — some of these are
// genuinely how the club is commonly abbreviated (PSG, BVB, DIM, RMA), others
// are a reasonable initials-based code made up for this purpose since no
// widely-recognized one exists. Add an entry here alongside
// CLUB_COUNTRY_CODES whenever a new club shows up in the data, checking for
// collisions with existing codes.
const CLUB_CODES: Record<string, string> = {
  Arsenal: "ARS",
  "Aston Villa": "AVL",
  "Atlético Junior": "JUN",
  "Atlético Madrid": "ATM",
  "Atlético Mineiro": "CAM",
  Barcelona: "BAR",
  "Bayer Leverkusen": "LEV",
  "Bayern Munich": "BAY",
  "Boca Juniors": "BOC",
  "Borussia Dortmund": "BVB",
  Brest: "BRE",
  Chelsea: "CHE",
  "Defensor Sporting": "DEF",
  "Deportivo Independiente Medellín": "DIM",
  Flamengo: "FLA",
  Fluminense: "FLU",
  Girona: "GIR",
  "Grêmio": "GRE",
  Internacional: "INT",
  "Lanús": "LAN",
  Lille: "LIL",
  Liverpool: "LIV",
  "Liverpool (Montevideo)": "LIM",
  "Manchester City": "MCI",
  Monaco: "MON",
  Nacional: "NAC",
  Palmeiras: "PAL",
  "Paris Saint-Germain": "PSG",
  "Peñarol": "PEN",
  "RB Leipzig": "RBL",
  "Real Madrid": "RMA",
  "River Plate": "RIV",
  "San Lorenzo": "SLO",
  "Talleres (Córdoba)": "TAL",
  "VfB Stuttgart": "VFB",
};

export function getClubCode(name: string): string | undefined {
  return CLUB_CODES[name];
}
