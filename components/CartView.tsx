"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/Cart";
import { usePrefs, Bi, Price } from "@/components/Prefs";

export default function CartView() {
  const { items, remove, count, ready } = useCart();
  const { t } = usePrefs();

  if (!ready) return null; // wait for localStorage so we never flash an empty cart

  if (count === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-[28px] text-ink">{t("cart.title")}</h1>
        <div className="mx-auto mt-4 h-px w-10 bg-gold" />
        <p className="mt-6 text-[15px] text-ink/70">{t("cart.empty")}</p>
        <Link href="/collection" className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
          {t("cart.browse")} <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.priceEur, 0);

  return (
    <div>
      <h1 className="font-display text-[30px] text-ink">{t("cart.title")}</h1>
      <div className="mt-3 h-px w-10 bg-gold" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-hairline border-y border-hairline">
          {items.map((i) => (
            <li key={i.slug} className="flex gap-4 py-5">
              <Link href={`/product/${i.slug}`} className="relative h-24 w-20 shrink-0 overflow-hidden bg-parchment">
                {i.image ? (
                  <Image src={i.image} alt={i.titleEn} fill sizes="80px" className="object-cover" />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[8px] tracking-[0.18em] text-ink/40">BALZAC</span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/product/${i.slug}`} className="font-display text-[17px] leading-snug text-ink hover:text-gold-dark">
                  <Bi en={i.titleEn} fr={i.titleFr} />
                </Link>
                <p className="mt-1 text-[12px] text-ink/55">
                  <Bi en={i.categoryLabelEn} fr={i.categoryLabelFr} />
                </p>
                <button onClick={() => remove(i.slug)} className="mt-3 text-[11px] uppercase tracking-[0.16em] text-ink/50 hover:text-[#8A3C3C]">
                  {t("cart.remove")}
                </button>
              </div>
              <div className="text-right text-[15px] text-ink">
                <Price eur={i.priceEur} />
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-max border border-hairline bg-parchment p-6">
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.18em] text-ink/70">{t("cart.subtotal")}</span>
            <span className="font-display text-[22px] text-ink"><Price eur={subtotal} /></span>
          </div>
          <p className="mt-2 text-[12px] text-ink/55">{t("cart.shippingNote")}</p>
          <Link href="/checkout" className="mt-5 flex w-full items-center justify-center gap-2 bg-gold py-3.5 text-[12px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold-dark">
            {t("cart.checkout")} <span aria-hidden>&rarr;</span>
          </Link>
          <Link href="/collection" className="mt-3 block text-center text-[11px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
            {t("cart.continue")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
