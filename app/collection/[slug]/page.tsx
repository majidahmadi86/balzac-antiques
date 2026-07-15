import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { categories, categoryBySlug, productsByCategory } from "@/lib/data";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const category = categoryBySlug(params.slug);
  if (!category) return { title: "Not found — Balzac Antiques" };
  return {
    title: `${category.label} — Balzac Antiques`,
    description: `${category.label} curated by Balzac Antiques. Rare objects, chosen for authenticity, quality and lasting appeal.`,
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categoryBySlug(params.slug);
  if (!category) return notFound();

  const items = productsByCategory(category.slug);

  return (
    <main>
      <Header />

      <PageHeader eyebrow="The Collection" title={category.label} />

      <nav className="mx-auto max-w-content px-6 pb-10 sm:px-10">
        <ul className="flex flex-wrap justify-center gap-2">
          <li>
            <Link
              href="/collection"
              className="block border border-hairline px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-ink/70 transition-colors hover:border-gold hover:text-gold-dark"
            >
              All
            </Link>
          </li>
          {categories.map((c) => {
            const active = c.slug === category.slug;
            return (
              <li key={c.slug}>
                {active ? (
                  <span className="block border border-gold bg-gold/10 px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-gold-dark">
                    {c.label}
                  </span>
                ) : (
                  <Link
                    href={`/collection/${c.slug}`}
                    className="block border border-hairline px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-ink/70 transition-colors hover:border-gold hover:text-gold-dark"
                  >
                    {c.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <section className="mx-auto max-w-content px-5 pb-16 sm:px-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          // Real empty state — 4 of 8 categories have no stock yet, and a
          // blank page would read as broken.
          <div className="mx-auto max-w-[46ch] border border-hairline bg-parchment/40 px-6 py-14 text-center">
            <p className="font-display text-[20px] italic text-ink">
              No pieces currently listed in {category.label}.
            </p>
            <div className="mx-auto my-5 h-px w-10 bg-gold" />
            <p className="text-[14px] leading-relaxed text-ink/70">
              New acquisitions are added regularly. If you are looking for
              something particular, we are happy to source it for you.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-outline">
                Make an Enquiry
                <span aria-hidden>&rarr;</span>
              </Link>
              <Link href="/collection" className="link-view-all self-center">
                View All Pieces &rarr;
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
