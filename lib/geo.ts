// The site is open to visitors in the United States, Canada, Australia, New Zealand and Europe. Vercel adds the
// visitor's country to every request as `x-vercel-ip-country`; anything else gets turned away.
const NORTH_AMERICA_AND_AUSTRALIA = ["US", "PR", "GU", "VI", "AS", "MP", "CA", "AU", "NZ"];

// Europe, leaving out Russia and Belarus.
const EUROPE = [
  "AD", "AL", "AT", "AX", "BA", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FO",
  "FR", "GB", "GG", "GI", "GR", "HR", "HU", "IE", "IM", "IS", "IT", "JE", "LI", "LT", "LU", "LV",
  "MC", "MD", "ME", "MK", "MT", "NL", "NO", "PL", "PT", "RO", "RS", "SE", "SI", "SJ", "SK", "SM",
  "UA", "VA", "XK",
];

const ALLOWED_COUNTRIES = new Set([...NORTH_AMERICA_AND_AUSTRALIA, ...EUROPE]);

export function isCountryAllowed(country: string | null | undefined): boolean {
  // No header means we can't tell (local development, an internal request), so let it through.
  if (!country) return true;
  return ALLOWED_COUNTRIES.has(country.trim().toUpperCase());
}
