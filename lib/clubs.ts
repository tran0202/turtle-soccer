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
