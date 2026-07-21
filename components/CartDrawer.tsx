"use client";

// Slide-out cart, mounted once globally. Opens the instant something is added
// (Cart.add flips drawerOpen), and from the header cart icon. The full /cart
// page stays as a fallback for deep links.
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useCart } from "@/components/Cart";
import { usePrefs, Bi, Price } from "@/components/Prefs";

export default function CartDrawer() {
  const { items, remove, count, drawerOpen, closeDrawer } = useCart();
  const { t } = usePrefs();

  // Lock body scroll and close on Escape while open.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    if (drawerOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen, closeDrawer]);

  const subtotal = items.reduce((sum, i) => sum + i.priceEur, 0);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/25 backdrop-blur-[2px] transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeDrawer}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
        className={`fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col bg-cream shadow-[-18px_0_45px_-20px_rgba(43,36,32,0.4)] transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-hairline px-6 py-5">
          <h2 className="font-display text-[20px] tracking-[0.04em] text-ink">{t("cart.title")}</h2>
          <button type="button" onClick={closeDrawer} aria-label={t("cart.close")} className="p-1 text-ink/60 transition-colors hover:text-ink">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {count === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" className="text-hairline" aria-hidden>
              <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <p className="mt-4 text-[14px] text-ink/60">{t("cart.empty")}</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-hairline overflow-y-auto px-6">
              {items.map((i) => (
                <li key={i.slug} className="flex gap-4 py-5">
                  <Link href={`/product/${i.slug}`} onClick={closeDrawer} className="relative h-20 w-16 shrink-0 overflow-hidden bg-parchment">
                    {i.image ? (
                      <Image src={i.image} alt={i.titleEn} fill sizes="64px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[7px] tracking-[0.16em] text-ink/40">BALZAC</span>
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/product/${i.slug}`} onClick={closeDrawer} className="font-display text-[15px] leading-snug text-ink hover:text-gold-dark">
                      <Bi en={i.titleEn} fr={i.titleFr} />
                    </Link>
                    <p className="mt-0.5 text-[11px] text-ink/55"><Bi en={i.categoryLabelEn} fr={i.categoryLabelFr} /></p>
                    <button type="button" onClick={() => remove(i.slug)} className="mt-2 text-[10px] uppercase tracking-[0.16em] text-ink/45 hover:text-[#8A3C3C]">
                      {t("cart.remove")}
                    </button>
                  </div>
                  <div className="text-right text-[14px] text-ink"><Price eur={i.priceEur} /></div>
                </li>
              ))}
            </ul>

            <div className="border-t border-hairline px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] uppercase tracking-[0.18em] text-ink/70">{t("cart.subtotal")}</span>
                <span className="font-display text-[20px] text-ink"><Price eur={subtotal} /></span>
              </div>
              <p className="mt-1 text-[12px] text-ink/55">{t("cart.shippingNote")}</p>
              <Link href="/checkout" onClick={closeDrawer} className="mt-4 flex w-full items-center justify-center gap-2 bg-gold py-3.5 text-[12px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold-dark">
                {t("cart.checkout")} <span aria-hidden>&rarr;</span>
              </Link>
              <button type="button" onClick={closeDrawer} className="mt-3 block w-full text-center text-[11px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
                {t("cart.continue")}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
