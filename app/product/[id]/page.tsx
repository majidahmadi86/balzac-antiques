import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { products } from "@/lib/data";

const specRows = (p: (typeof products)[number]) => [
  ["Brand", p.brand],
  ["Model", p.model],
  ["Reference", p.reference],
  ["Year", p.year],
  ["Case Material", p.caseMaterial],
  ["Movement", p.movement],
  ["Case Size", p.caseSize],
  ["Condition", p.condition],
  ["Box / Papers", p.boxPapers],
];

const accordions = [
  { title: "Description", key: "description" },
  { title: "Shipping & Returns", key: "shipping" },
  { title: "Authenticity Guarantee", key: "authenticity" },
] as const;

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  if (!product) return notFound();

  return (
    <main>
      <Header cartCount={1} />

      <div className="mx-auto max-w-content px-5 py-5 sm:px-8">
        <Link
          href="/collection"
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] text-gold"
        >
          <span aria-hidden>&larr;</span> Back to Collection
        </Link>

        <div className="mt-5 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {/* --------------------------- Gallery --------------------------- */}
          <div>
            <div className="relative aspect-square overflow-hidden bg-parchment">
              <Image src={product.images[0]} alt={product.title} fill priority sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {product.images.slice(1).map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden bg-parchment shadow-sm transition-shadow hover:shadow-md">
                  <Image src={src} alt="" fill loading="lazy" sizes="(max-width: 640px) 33vw, 16vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* --------------------------- Info ------------------------------ */}
          <div>
            <p className="eyebrow">{product.brand}</p>
            <h1 className="mt-1 font-display text-[30px] leading-tight text-ink sm:text-[34px]">
              {product.title}
            </h1>
            <div className="my-4 h-px w-10 bg-gold" />
            <p className="text-[13px] tracking-[0.1em] text-gold">
              {product.location.toUpperCase()}
              <br />
              {product.year.toUpperCase()}
            </p>

            <p className="mt-5 text-[15px] leading-relaxed text-ink/90">
              {product.description}
            </p>

            <div className="mt-6 divide-y divide-hairline border-y border-hairline text-[13px]">
              {specRows(product).map(([label, value]) => (
                <div key={label} className="flex justify-between py-2.5">
                  <span className="tracking-[0.1em] text-gold">
                    {label.toUpperCase()}
                  </span>
                  <span className="text-ink">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-parchment p-5">
              <p className="font-display text-[26px] text-ink">
                {product.currency} {product.price}
              </p>
              <p className="mt-1 text-[12px] text-ink/70">
                Worldwide shipping available
              </p>

              <button className="mt-4 flex w-full items-center justify-center gap-2 bg-gold py-3.5 text-[13px] tracking-widest2 uppercase text-cream transition-colors hover:bg-gold-dark">
                Add to Cart
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              <button className="mt-2.5 w-full bg-charcoal py-3.5 text-[13px] tracking-widest2 uppercase text-cream transition-opacity hover:opacity-90">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content divide-y divide-hairline px-5 pb-10 sm:px-8">
        {accordions.map((a) => (
          <details key={a.key} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-[13px] tracking-[0.1em] text-ink">
              {a.title.toUpperCase()}
              <span className="text-gold transition-transform group-open:rotate-45">+</span>
            </summary>
            <div className="mt-3 text-[14px] leading-relaxed text-ink/80">
              {a.key === "description" && product.description}
              {a.key === "shipping" && (
                <>
                  Fully insured worldwide shipping, tracked door to door. Return
                  window of 14 days from delivery for items not as described.
                </>
              )}
              {a.key === "authenticity" && (
                <>
                  Every piece is inspected and authenticated by our specialists
                  before listing, backed by Balzac Antiques&apos; authenticity
                  guarantee.
                </>
              )}
            </div>
          </details>
        ))}
      </div>

      <Footer />
    </main>
  );
}

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}
