"use client";

import { useCart, type CartItem } from "@/components/Cart";
import { usePrefs } from "@/components/Prefs";

export default function AddToCartButton({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { has, add, ready, openDrawer } = useCart();
  const { t } = usePrefs();
  const inCart = ready && has(item.slug);

  // Compact form for product cards: one small button that adds (opening the
  // drawer) or, if already in, opens the drawer to review.
  if (compact) {
    return (
      <button
        type="button"
        onClick={() => (inCart ? openDrawer() : add(item))}
        className={`w-full border py-2.5 text-[11px] uppercase tracking-[0.18em] transition-colors ${
          inCart
            ? "border-gold/50 bg-cream text-gold-dark"
            : "border-ink bg-transparent text-ink hover:bg-ink hover:text-cream"
        }`}
      >
        {inCart ? t("cart.inCart") : t("cart.add")}
      </button>
    );
  }

  // Full form for the product page.
  if (inCart) {
    return (
      <div className="mt-4">
        <p className="flex w-full items-center justify-center gap-2 border border-gold/50 bg-cream py-3.5 text-[12px] uppercase tracking-[0.2em] text-gold-dark">
          <span aria-hidden>&#10003;</span> {t("cart.inCart")}
        </p>
        <button type="button" onClick={openDrawer} className="mt-3 block w-full text-center text-[11px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
          {t("cart.view")} &rarr;
        </button>
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
