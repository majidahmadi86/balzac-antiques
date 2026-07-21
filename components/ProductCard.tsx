import Link from "next/link";
import Image from "next/image";
import { type CatalogueCard } from "@/lib/catalogue";
import { Bi, Price, T } from "@/components/Prefs";
import AddToCartButton from "@/components/AddToCartButton";

export default function ProductCard({ product }: { product: CatalogueCard }) {
  return (
    <div className="flex flex-col">
      <Link href={`/product/${product.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-parchment shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.titleEn}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center border border-hairline">
              <span className="text-[9px] tracking-[0.22em] text-ink/40">PHOTOGRAPHY PENDING</span>
            </div>
          )}

          {product.status !== "available" ? (
            <>
              <span className="absolute inset-0 bg-cream/45" aria-hidden />
              <span className="absolute left-0 top-3 bg-ink px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-cream">
                <T k={product.status === "sold" ? "prod.sold" : "prod.reserved"} />
              </span>
            </>
          ) : null}
        </div>

        {product.eyebrow ? (
          <p className="mt-3 text-[11px] tracking-[0.14em] uppercase text-gold">{product.eyebrow}</p>
        ) : null}

        <h3 className="mt-1 font-display text-[16px] leading-snug text-ink">
          <Bi en={product.titleEn} fr={product.titleFr} />
        </h3>

        <p className="mt-1 text-[12px] text-ink/55">
          <Bi en={product.categoryLabelEn} fr={product.categoryLabelFr} />
          {product.year ? <> · {product.year}</> : null}
        </p>

        <p className="mt-2 text-[14px] text-ink"><Price eur={product.priceEur} /></p>
      </Link>

      {product.status === "available" ? (
        <div className="mt-3">
          <AddToCartButton
            compact
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
        </div>
      ) : null}
    </div>
  );
}
