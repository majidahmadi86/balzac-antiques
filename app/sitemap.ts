import type { MetadataRoute } from "next";
import { categories } from "@/lib/data";
import { getPublishedSlugs } from "@/lib/catalogue";
import { LOCALIZED_ROOTS, toFr } from "@/lib/locale-routes";

const SITE = "https://balzacantiques.ch";

// Every indexable page is listed twice, once per language, each entry
// declaring both alternates so search engines pair them correctly.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPublishedSlugs();
  const paths = [
    ...LOCALIZED_ROOTS,
    ...categories.map((c) => `/collection/${c.slug}`),
    ...slugs.map((s) => `/product/${s}`),
  ];

  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const p of paths) {
    const fr = toFr(p);
    if (!fr) continue;
    const languages = { en: `${SITE}${p}`, fr: `${SITE}${fr}` };
    entries.push({
      url: `${SITE}${p}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: p === "/" ? 1 : 0.7,
      alternates: { languages },
    });
    entries.push({
      url: `${SITE}${fr}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: p === "/" ? 1 : 0.7,
      alternates: { languages },
    });
  }

  return entries;
}
