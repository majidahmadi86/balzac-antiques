"use client";

import Link from "next/link";
import { useCart, type CartItem } from "@/components/Cart";
import { usePrefs } from "@/components/Prefs";

export default function AddToCartButton({ item }: { item: CartItem }) {
  const { has, add, ready } = useCart();
  const { t } = usePrefs();
  const inCart = ready && has(item.slug);

  if (inCart) {
    return (
      <div className="mt-4">
        <p className="flex w-full items-center justify-center gap-2 border border-gold/50 bg-cream py-3.5 text-[12px] uppercase tracking-[0.2em] text-gold-dark">
          <span aria-hidden>&#10003;</span> {t("cart.inCart")}
        </p>
        <Link href="/cart" className="mt-3 block text-center text-[11px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
          {t("cart.view")} &rarr;
        </Link>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add(item)}
      className="mt-4 flex w-full items-center justify-center gap-2 bg-gold py-3.5 text-[13px] tracking-widest2 uppercase text-cream transition-colors hover:bg-gold-dark"
    >
      {t("cart.add")} <span aria-hidden>&rarr;</span>
    </button>
  );
}
