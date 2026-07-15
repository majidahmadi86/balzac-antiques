// Server-side catalogue reads for the PUBLIC site (Step D: pages moved off the
// hardcoded lib/data.ts product array onto the database the admin panel edits).
// Only published products ever leave this module. Pages stay statically
// generated; every admin mutation calls revalidatePath("/", "layout") so
// changes are live for visitors instantly.
//
// Categories (the fixed 8 from the client's brief) intentionally still come
// from lib/data.ts — they are navigation scaffolding, not admin-managed
// content, and the Header/Footer are client components that cannot query
// the database.

import { db } from "./db";

export type CatalogueSpec = {
  labelEn: string;
  labelFr: string | null;
  valueEn: string;
  valueFr: string | null;
};

export type CatalogueCard = {
  slug: string;
  eyebrow: string | null;
  titleEn: string;
  titleFr: string | null;
  year: string | null;
  priceEur: number;
  image: string | null; // cover photo path, null when no photos yet
  categorySlug: string;
  categoryLabelEn: string;
  categoryLabelFr: string | null;
};

export type CatalogueProduct = CatalogueCard & {
  descriptionEn: string;
  descriptionFr: string | null;
  origin: string | null;
  condition: string | null;
  dimensions: string | null;
  images: string[];
  specs: CatalogueSpec[];
};

type ProductWithRels = {
  slug: string;
  eyebrow: string | null;
  titleEn: string;
  titleFr: string | null;
  descriptionEn: string;
  descriptionFr: string | null;
  origin: string | null;
  year: string | null;
  condition: string | null;
  dimensions: string | null;
  priceEur: unknown;
  published: boolean;
  category: { slug: string; labelEn: string; labelFr: string | null };
  images: { path: string }[];
  specs?: CatalogueSpec[];
};

function toCard(p: ProductWithRels): CatalogueCard {
  return {
    slug: p.slug,
    eyebrow: p.eyebrow,
    titleEn: p.titleEn,
    titleFr: p.titleFr,
    year: p.year,
    priceEur: Number(String(p.priceEur)),
    image: p.images[0]?.path ?? null,
    categorySlug: p.category.slug,
    categoryLabelEn: p.category.labelEn,
    categoryLabelFr: p.category.labelFr,
  };
}

const cardInclude = {
  category: { select: { slug: true, labelEn: true, labelFr: true } },
  images: { orderBy: { sortOrder: "asc" as const }, take: 1, select: { path: true } },
};

export async function getPublishedProducts(): Promise<CatalogueCard[]> {
  const rows = await db.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: cardInclude,
  });
  return rows.map((r: ProductWithRels) => toCard(r));
}

export async function getProductsByCategorySlug(slug: string): Promise<CatalogueCard[]> {
  const rows = await db.product.findMany({
    where: { published: true, category: { slug } },
    orderBy: { createdAt: "desc" },
    include: cardInclude,
  });
  return rows.map((r: ProductWithRels) => toCard(r));
}

export async function getProductBySlug(slug: string): Promise<CatalogueProduct | null> {
  const p = await db.product.findUnique({
    where: { slug },
    include: {
      category: { select: { slug: true, labelEn: true, labelFr: true } },
      images: { orderBy: { sortOrder: "asc" }, select: { path: true } },
      specs: {
        orderBy: { sortOrder: "asc" },
        select: { labelEn: true, labelFr: true, valueEn: true, valueFr: true },
      },
    },
  });
  if (!p || !p.published) return null;
  return {
    ...toCard(p),
    image: p.images[0]?.path ?? null,
    descriptionEn: p.descriptionEn,
    descriptionFr: p.descriptionFr,
    origin: p.origin,
    condition: p.condition,
    dimensions: p.dimensions,
    images: p.images.map((i: { path: string }) => i.path),
    specs: p.specs ?? [],
  };
}

export async function getPublishedSlugs(): Promise<string[]> {
  const rows = await db.product.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return rows.map((r: { slug: string }) => r.slug);
}

export type HeroSlide = {
  slug: string;
  eyebrow: string | null;
  titleEn: string;
  titleFr: string | null;
  image: string;
};

// Up to 5 published products marked "Hero" in the admin panel, for the
// homepage slideshow. A hero needs a photo — products without one are
// skipped rather than rendering an empty frame.
export async function getHeroProducts(): Promise<HeroSlide[]> {
  const rows = await db.product.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { path: true } },
    },
  });
  return rows
    .filter((r: { images: { path: string }[] }) => r.images.length > 0)
    .slice(0, 5)
    .map((r: { slug: string; eyebrow: string | null; titleEn: string; titleFr: string | null; images: { path: string }[] }) => ({
      slug: r.slug,
      eyebrow: r.eyebrow,
      titleEn: r.titleEn,
      titleFr: r.titleFr,
      image: r.images[0].path,
    }));
}

// Cover photo per category for the homepage "Exceptional Pieces" grid: the
// newest published product WITH a photo in each category. Fully automatic —
// the client curates this simply by managing products; empty categories fall
// back to the styled placeholder asset.
export async function getCategoryCovers(): Promise<Record<string, string>> {
  const rows = await db.product.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { slug: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1, select: { path: true } },
    },
  });
  const covers: Record<string, string> = {};
  for (const r of rows as { category: { slug: string }; images: { path: string }[] }[]) {
    if (r.images[0] && !(r.category.slug in covers)) covers[r.category.slug] = r.images[0].path;
  }
  return covers;
}
