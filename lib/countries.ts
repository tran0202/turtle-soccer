// Maps the country names used in our data (org.country, and champion/runnerUp/
// thirdPlace for national-scope tournaments) to flag-icons country codes.
// Add an entry here whenever a new country name shows up in the data.
const COUNTRY_CODES: Record<string, string> = {
  Argentina: "ar",
  Belgium: "be",
  Colombia: "co",
  Croatia: "hr",
  England: "gb-eng",
  France: "fr",
  Spain: "es",
  Sweden: "se",
  Uruguay: "uy",
};

export function getCountryCode(name: string): string | undefined {
  return COUNTRY_CODES[name];
}
