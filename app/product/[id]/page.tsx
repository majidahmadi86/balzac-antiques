import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  products,
  productById,
  categoryBySlug,
} from "@/lib/data";
import { T, Price } from "@/components/Prefs";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const product = productById(params.id);
  if (!product) return { title: "Not found — Balzac Antiques" };
  return {
    title: `${product.title} — Balzac Antiques`,
    description: product.description.slice(0, 155),
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = productById(params.id);
  if (!product) return notFound();

  const category = categoryBySlug(product.category);

  return (
    <main>
      <Header />

      <div className="mx-auto max-w-content px-5 py-5 sm:px-8">
        <Link
          href={category ? `/collection/${category.slug}` : "/collection"}
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] text-gold hover:text-gold-dark"
        >
          <span aria-hidden>&larr;</span>
          <T k="prod.backTo" /> {category ? category.label : "Collection"}
        </Link>

        <div className="mt-5 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {/* --------------------------- Gallery --------------------------- */}
          <div>
            <div className="relative aspect-square overflow-hidden bg-parchment">
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            {product.images.length > 1 ? (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {product.images.slice(1).map((src, i) => (
                  <div
                    key={src}
                    className="relative aspect-square overflow-hidden bg-parchment shadow-sm transition-shadow hover:shadow-md"
                  >
                    <Image
                      src={src}
                      alt={`${product.title} — view ${i + 2}`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 33vw, 16vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* ---------------------------- Info ----------------------------- */}
          <div>
            {product.eyebrow ? <p className="eyebrow">{product.eyebrow}</p> : null}
            <h1 className="mt-1 font-display text-[30px] leading-tight text-ink sm:text-[34px]">
              {product.title}
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
              {product.description}
            </p>

            {/* Specs render from a flexible label/value list, so a record, a
                print and a watch each describe themselves properly. */}
            <div className="mt-6 divide-y divide-hairline border-y border-hairline text-[13px]">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 py-2.5">
                  <span className="shrink-0 tracking-[0.1em] text-gold">
                    {s.label.toUpperCase()}
                  </span>
                  <span className="text-right text-ink">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-parchment p-5">
              <p className="font-display text-[26px] text-ink">
                <Price eur={product.priceEur} />
              </p>
              <p className="mt-1 text-[12px] text-ink/70">
                <T k="prod.shipping" />
              </p>

              {/* NOTE: button set is still pending the client's decision
                  (Add to Cart/Buy Now vs. Buy Now/Ask a Question/Sell with Us).
                  Enquiry link is real and works today; checkout wiring lands
                  with Stripe once the button decision is confirmed. */}
              <Link
                href="/contact"
                className="mt-4 flex w-full items-center justify-center gap-2 bg-gold py-3.5 text-[13px] tracking-widest2 uppercase text-cream transition-colors hover:bg-gold-dark"
              >
                <T k="prod.enquire" />
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
