"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/data";

// DESIGN PASS
// Desktop dropdown: boutique "panel" — gold top rule, generous padding,
// two-column serif category list, animated (fade + 8px rise). Stays mounted
// so the transition actually plays; closes on a short grace timer so the
// pointer can travel from trigger to panel without it snapping shut.
// Mobile drawer: full-height, serif display links with staggered reveal,
// hairline rules, brand tagline + contact at the foot.

const pages = [
  { href: "/sell", label: "Acquisitions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ cartCount }: { cartCount?: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [drawerCollectionOpen, setDrawerCollectionOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const openPanel = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCollectionOpen(true);
  };
  const closePanelSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setCollectionOpen(false), 160);
  };

  useEffect(() => {
    setMenuOpen(false);
    setCollectionOpen(false);
    setDrawerCollectionOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setCollectionOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-cream/95 backdrop-blur">
      <div className="mx-auto grid max-w-content grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 sm:px-8 md:px-10 md:py-5">
        {/* ---------------------------- LEFT ---------------------------- */}
        <div className="flex items-center gap-7">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 text-ink md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              ) : (
                <path d="M3 7h18M3 12h12M3 17h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              )}
            </svg>
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            {/* Collection panel trigger */}
            <div className="relative" onMouseEnter={openPanel} onMouseLeave={closePanelSoon}>
              <button
                type="button"
                aria-expanded={collectionOpen}
                aria-haspopup="true"
                onClick={() => (collectionOpen ? setCollectionOpen(false) : openPanel())}
                className={`group relative flex items-center gap-2 whitespace-nowrap py-2 text-[11.5px] tracking-[0.22em] uppercase transition-colors ${
                  collectionOpen ? "text-gold-dark" : "text-ink hover:text-gold-dark"
                }`}
              >
                Collection
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`text-gold transition-transform duration-300 ${collectionOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  className={`absolute -bottom-px left-0 h-px bg-gold transition-all duration-300 ${
                    collectionOpen ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>

              {/* Panel — always mounted so the fade/rise transition plays */}
              <div
                className={`absolute -left-8 top-full w-[440px] transition-all duration-300 ease-out ${
                  collectionOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-2 opacity-0"
                }`}
              >
                <div className="mt-4 border border-hairline bg-cream shadow-[0_18px_45px_-18px_rgba(43,36,32,0.35)]">
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
                  <div className="px-9 pb-8 pt-7">
                    <div className="flex items-baseline justify-between border-b border-hairline pb-4">
                      <span className="text-[10.5px] tracking-[0.28em] uppercase text-gold">
                        The Collection
                      </span>
                      <Link
                        href="/collection"
                        className="text-[11px] tracking-[0.16em] uppercase text-ink/70 transition-colors hover:text-gold-dark"
                      >
                        View All &rarr;
                      </Link>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-x-10">
                      {categories.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/collection/${c.slug}`}
                          className="group/item flex items-center justify-between border-b border-hairline/60 py-3"
                        >
                          <span className="font-display text-[16px] text-ink/85 transition-colors group-hover/item:text-ink">
                            {c.label}
                          </span>
                          <span
                            className="text-gold opacity-0 transition-all duration-300 group-hover/item:translate-x-0.5 group-hover/item:opacity-100"
                            aria-hidden
                          >
                            &rarr;
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {pages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="group relative whitespace-nowrap py-2 text-[11.5px] tracking-[0.22em] uppercase text-ink transition-colors hover:text-gold-dark"
              >
                {p.label}
                <span className="absolute -bottom-px left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>
        </div>

        {/* --------------------------- CENTER --------------------------- */}
        <Link href="/" className="group flex flex-col items-center justify-self-center leading-none">
          <span className="font-display text-[25px] tracking-[0.3em] text-ink transition-colors md:text-[31px]">
            BALZAC
          </span>
          <span className="mt-2 flex items-center gap-2.5 text-[9px] tracking-[0.52em] text-gold md:text-[9.5px]">
            <span className="h-px w-5 bg-gold/70 transition-all duration-500 group-hover:w-7 md:w-7" />
            <span className="translate-x-[0.26em]">ANTIQUES</span>
            <span className="h-px w-5 bg-gold/70 transition-all duration-500 group-hover:w-7 md:w-7" />
          </span>
        </Link>

        {/* ---------------------------- RIGHT --------------------------- */}
        {/* Reserved for the EN/FR language toggle (contract scope, next pass). */}
        <div className="flex items-center justify-end gap-5">
          {cartCount ? (
            <Link href="/cart" aria-label="View cart" className="relative p-1 text-ink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-cream">
                {cartCount}
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* ------------------------ MOBILE DRAWER ------------------------ */}
      <div
        className={`fixed inset-0 top-[69px] z-40 bg-ink/25 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />

      <div
        id="mobile-drawer"
        className={`fixed inset-x-0 top-[69px] z-40 overflow-y-auto bg-cream transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          menuOpen ? "max-h-[calc(100vh-69px)] border-b border-hairline" : "max-h-0 overflow-hidden"
        }`}
      >
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
        <nav className="px-7 pb-10 pt-6">
          <p
            className={`text-[10px] tracking-[0.32em] uppercase text-gold transition-all duration-500 ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? "80ms" : "0ms" }}
          >
            Menu
          </p>

          {/* Collection accordion */}
          <div
            className={`transition-all duration-500 ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? "140ms" : "0ms" }}
          >
            <button
              type="button"
              aria-expanded={drawerCollectionOpen}
              onClick={() => setDrawerCollectionOpen((v) => !v)}
              className="flex w-full items-center justify-between border-b border-hairline py-4"
            >
              <span className="font-display text-[22px] text-ink">Collection</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className={`text-gold transition-transform duration-300 ${drawerCollectionOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                drawerCollectionOpen ? "max-h-[560px]" : "max-h-0"
              }`}
            >
              <div className="border-b border-hairline py-2 pl-4">
                <Link href="/collection" className="block py-2.5 text-[12px] tracking-[0.2em] uppercase text-gold">
                  All Pieces &rarr;
                </Link>
                {categories.map((c) => (
                  <Link key={c.slug} href={`/collection/${c.slug}`} className="block py-2.5 text-[15px] text-ink/80">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {pages.map((p, i) => (
            <div
              key={p.href}
              className={`transition-all duration-500 ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: menuOpen ? `${200 + i * 60}ms` : "0ms" }}
            >
              <Link href={p.href} className="block border-b border-hairline py-4 font-display text-[22px] text-ink">
                {p.label}
              </Link>
            </div>
          ))}

          {/* Drawer foot: brand line + contact */}
          <div
            className={`mt-9 transition-all duration-500 ${
              menuOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: menuOpen ? "420ms" : "0ms" }}
          >
            <p className="font-display text-[14px] italic text-ink/60">
              Rare Objects. Timeless Stories.
            </p>
            <a
              href="mailto:info@balzacantiques.ch"
              className="mt-2 block text-[12px] tracking-[0.08em] text-gold"
            >
              info@balzacantiques.ch
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
