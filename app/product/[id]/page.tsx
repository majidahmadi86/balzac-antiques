import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductBySlug, getPublishedSlugs } from "@/lib/catalogue";
import ProductGallery from "@/components/ProductGallery";
import { T, Bi, Price } from "@/components/Prefs";
import AddToCartButton from "@/components/AddToCartButton";

// Slugs known at build time are prerendered; products created later in the
// admin panel render on first request (dynamicParams default) and are then
// cached until the next admin mutation revalidates the site.
export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.id);
  if (!product) return { title: "Not found — Balzac Antiques" };
  return {
    title: `${product.titleEn} — Balzac Antiques`,
    description: product.descriptionEn.slice(0, 155),
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductBySlug(params.id);
  if (!product) return notFound();

  return (
    <main>
      <Header />

      <div className="mx-auto max-w-content px-5 py-5 sm:px-8">
        <Link
          href={`/collection/${product.categorySlug}`}
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] text-gold hover:text-gold-dark"
        >
          <span aria-hidden>&larr;</span>
          <T k="prod.backTo" /> <Bi en={product.categoryLabelEn} fr={product.categoryLabelFr} />
        </Link>

        <div className="mt-5 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {/* --------------------------- Gallery --------------------------- */}
          <ProductGallery images={product.images} title={product.titleEn} />

          {/* ---------------------------- Info ----------------------------- */}
          <div>
            {product.eyebrow ? <p className="eyebrow">{product.eyebrow}</p> : null}
            <h1 className="mt-1 font-display text-[30px] leading-tight text-ink sm:text-[34px]">
              <Bi en={product.titleEn} fr={product.titleFr} />
            </h1>
            <div className="my-4 h-px w-10 bg-gold" />
            {product.origin || product.year ? (
              <p className="text-[13px] tracking-[0.1em] text-gold">
                {product.origin ? product.origin.toUpperCase() : null}
                {product.origin && product.year ? <br /> : null}
                {product.year ? product.year.toUpperCase() : null}
              </p>
            ) : null}

            <p className="mt-5 text-[15px] leading-relaxed text-ink/90">
              <Bi en={product.descriptionEn} fr={product.descriptionFr} />
            </p>

            {/* Specs render from the flexible label/value list the admin panel
                edits; condition and dimensions (client's brief) append as rows
                when filled in, in the same visual language. */}
            {product.specs.length > 0 || product.condition || product.dimensions ? (
              <div className="mt-6 divide-y divide-hairline border-y border-hairline text-[13px]">
                {product.specs.map((s) => (
                  <div key={s.labelEn} className="flex justify-between gap-6 py-2.5">
                    <span className="shrink-0 uppercase tracking-[0.1em] text-gold">
                      <Bi en={s.labelEn} fr={s.labelFr} />
                    </span>
                    <span className="text-right text-ink"><Bi en={s.valueEn} fr={s.valueFr} /></span>
                  </div>
                ))}
                {product.condition ? (
                  <div className="flex justify-between gap-6 py-2.5">
                    <span className="shrink-0 uppercase tracking-[0.1em] text-gold"><T k="prod.condition" /></span>
                    <span className="text-right text-ink">{product.condition}</span>
                  </div>
                ) : null}
                {product.dimensions ? (
                  <div className="flex justify-between gap-6 py-2.5">
                    <span className="shrink-0 uppercase tracking-[0.1em] text-gold"><T k="prod.dimensions" /></span>
                    <span className="text-right text-ink">{product.dimensions}</span>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6 bg-parchment p-5">
              <p className="font-display text-[26px] text-ink">
                <Price eur={product.priceEur} />
              </p>
              <p className="mt-1 text-[12px] text-ink/70">
                <T k="prod.shipping" />
              </p>

              {/* Available pieces get Add to Cart. Sold and reserved pieces
                  show their status here instead of a purchase action. */}
              {product.status === "sold" ? (
                <div className="mt-4 border border-hairline bg-cream px-4 py-3.5 text-center">
                  <p className="text-[12px] uppercase tracking-[0.22em] text-ink"><T k="prod.sold" /></p>
                  <p className="mt-1 text-[13px] text-ink/65"><T k="prod.soldNote" /></p>
                </div>
              ) : product.status === "reserved" ? (
                <div className="mt-4 border border-hairline bg-cream px-4 py-3.5 text-center">
                  <p className="text-[12px] uppercase tracking-[0.22em] text-ink"><T k="prod.reserved" /></p>
                  <p className="mt-1 text-[13px] text-ink/65"><T k="prod.reservedNote" /></p>
                </div>
              ) : (
                <AddToCartButton
                  item={{
                    slug: product.slug,
                    titleEn: product.titleEn,
                    titleFr: product.titleFr,
                    priceEur: product.priceEur,
                    image: product.image,
                    categorySlug: product.categorySlug,
                    categoryLabelEn: product.categoryLabelEn,
                    categoryLabelFr: product.categoryLabelFr,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
