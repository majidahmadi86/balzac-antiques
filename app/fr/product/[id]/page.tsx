import type { Metadata } from "next";
import Page from "@/app/product/[id]/page";
import { getProductBySlug, getPublishedSlugs } from "@/lib/catalogue";
import { altsFr } from "@/lib/locale-routes";

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.id);
  if (!product) return { title: "Introuvable · Balzac Antiques" };
  // Falls back to the English field until the French one is filled in admin.
  const title = product.titleFr ?? product.titleEn;
  const description = product.descriptionFr ?? product.descriptionEn;
  return {
    title: `${title} · Balzac Antiques`,
    description: description.slice(0, 155),
    alternates: altsFr(`/product/${params.id}`),
  };
}

export default Page;
