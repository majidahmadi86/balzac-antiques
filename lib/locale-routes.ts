// Route-level bilingual mapping. English lives at the root, French under /fr.
//
// Only pages worth indexing are mirrored. Cart, checkout, account, login and
// admin stay single-locale and follow the visitor's stored preference, since
// they are all noindex and have no SEO value in either language.

export const LOCALIZED_ROOTS: readonly string[] = [
  "/",
  "/collection",
  "/about",
  "/contact",
  "/sell",
  "/terms",
  "/privacy",
  "/shipping",
  "/returns",
];

// Dynamic families that also exist in both languages.
const DYNAMIC_PREFIXES = ["/collection/", "/product/"];

export function isLocalized(enPath: string): boolean {
  if (LOCALIZED_ROOTS.includes(enPath)) return true;
  return DYNAMIC_PREFIXES.some((p) => enPath.startsWith(p));
}

/** English path to French path, or null when the page has no French twin. */
export function toFr(enPath: string): string | null {
  if (!isLocalized(enPath)) return null;
  return enPath === "/" ? "/fr" : `/fr${enPath}`;
}

/** French path back to its English original, or null when not a /fr URL. */
export function toEn(frPath: string): string | null {
  if (frPath === "/fr") return "/";
  if (frPath.startsWith("/fr/")) return frPath.slice(3);
  return null;
}

type Alts = {
  canonical: string;
  languages?: Record<string, string>;
};

/** Canonical + hreflang for an ENGLISH page, given its own path. */
export function alts(enPath: string): Alts {
  const fr = toFr(enPath);
  return {
    canonical: enPath,
    languages: fr ? { en: enPath, fr, "x-default": enPath } : undefined,
  };
}

/** Canonical + hreflang for the FRENCH twin of an English path. */
export function altsFr(enPath: string): Alts {
  const fr = toFr(enPath);
  return {
    canonical: fr ?? enPath,
    languages: fr ? { en: enPath, fr, "x-default": enPath } : undefined,
  };
}
