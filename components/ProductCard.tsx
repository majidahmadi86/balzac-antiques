import Link from "next/link";
import Image from "next/image";
import { formatPrice, categoryBySlug, type Product } from "@/lib/data";

export default function ProductCard({ product }: { product: Product }) {
  const category = categoryBySlug(product.category);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-parchment shadow-sm transition-shadow duration-300 group-hover:shadow-lg">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>

      {product.eyebrow ? (
        <p className="mt-3 text-[11px] tracking-[0.14em] uppercase text-gold">
          {product.eyebrow}
        </p>
      ) : null}

      <h3 className="mt-1 font-display text-[16px] leading-snug text-ink">
        {product.title}
      </h3>

      <p className="mt-1 text-[12px] text-ink/55">
        {[category?.label, product.year].filter(Boolean).join(" · ")}
      </p>

      <p className="mt-2 text-[14px] text-ink">{formatPrice(product.priceEur)}</p>
    </Link>
  );
}
