import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/lib/data";
import { getPublishedProducts } from "@/lib/catalogue";
import { T } from "@/components/Prefs";

export const metadata: Metadata = {
  title: "The Collection — Balzac Antiques",
  description:
    "Rare books, fine watches, artworks, vinyl records, iconic design and remarkable objects, curated by Balzac Antiques.",
};

export default async function CollectionPage() {
  const products = await getPublishedProducts();
  return (
    <main>
      <Header />

      <PageHeader
        eyebrow={<T k="coll.eyebrow" />}
        title={<T k="coll.title" />}
        lead={<T k="coll.lead" />}
      />

      {/* Category filter rail — plain links, so each category stays a real,
          crawlable, shareable URL rather than client-side filter state. */}
      <nav className="mx-auto max-w-content px-6 pb-10 sm:px-10">
        <ul className="flex flex-wrap justify-center gap-2">
          <li>
            <span className="block border border-gold bg-gold/10 px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-gold-dark">
              <T k="coll.all" />
            </span>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collection/${c.slug}`}
                className="block border border-hairline px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-ink/70 transition-colors hover:border-gold hover:text-gold-dark"
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="mx-auto max-w-content px-5 pb-16 sm:px-8">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
