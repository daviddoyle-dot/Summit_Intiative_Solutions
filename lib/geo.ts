// The site is only meant for visitors in the United States. Vercel adds the visitor's country
// to every request as `x-vercel-ip-country`; anything else gets turned away at the door.
const ALLOWED_COUNTRIES = new Set(["US", "PR", "GU", "VI", "AS", "MP"]);

export function isCountryAllowed(country: string | null | undefined): boolean {
  // No header means we can't tell (local development, an internal request), so let it through.
  if (!country) return true;
  return ALLOWED_COUNTRIES.has(country.trim().toUpperCase());
}
