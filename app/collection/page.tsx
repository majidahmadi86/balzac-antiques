import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/lib/data";

export const metadata: Metadata = {
  title: "The Collection — Balzac Antiques",
  description:
    "Rare books, fine watches, artworks, vinyl records, iconic design and remarkable objects, curated by Balzac Antiques.",
};

export default function CollectionPage() {
  return (
    <main>
      <Header />

      <PageHeader
        eyebrow="The Collection"
        title="All Pieces"
        lead="Every item is chosen for its authenticity, quality, rarity, and lasting appeal."
      />

      {/* Category filter rail — plain links, so each category stays a real,
          crawlable, shareable URL rather than client-side filter state. */}
      <nav className="mx-auto max-w-content px-6 pb-10 sm:px-10">
        <ul className="flex flex-wrap justify-center gap-2">
          <li>
            <span className="block border border-gold bg-gold/10 px-4 py-2 text-[11px] tracking-[0.14em] uppercase text-gold-dark">
              All
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
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
