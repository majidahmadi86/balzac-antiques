import type { Metadata } from "next";
import Page from "@/app/collection/[slug]/page";
import { categories, categoryBySlug } from "@/lib/data";
import { altsFr } from "@/lib/locale-routes";

// Category names are stored in English only, so the French titles come from
// this small map. Anything missing falls back to the English label.
const LABEL_FR: Record<string, string> = {
  books: "Livres",
  art: "Art",
  watches: "Montres",
  music: "Musique",
  furniture: "Mobilier",
  design: "Design",
  objects: "Objets",
  curiosities: "Curiosités",
};

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const category = categoryBySlug(params.slug);
  if (!category) return { title: "Introuvable · Balzac Antiques" };
  const label = LABEL_FR[category.slug] ?? category.label;
  return {
    title: `${label} · Balzac Antiques`,
    description: `${label} : une sélection de Balzac Antiques. Des objets rares, choisis pour leur authenticité, leur qualité et leur intérêt durable.`,
    alternates: altsFr(`/collection/${params.slug}`),
  };
}

export default Page;
