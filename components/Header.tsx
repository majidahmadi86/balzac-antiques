"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { categories } from "@/lib/data";

// IA (rebuilt):
//   Desktop  Collection ▾ | Acquisitions | About | Contact  [LOGO]  Account
//   Mobile   ☰ (real drawer)                                [LOGO]  Account
//
// Previously all 8 categories sat inline around the logo, leaving nowhere for
// About / Acquisitions / Contact (footer-only), and the mobile hamburger was
// a decorative SVG with no handler — there was NO mobile navigation at all.
// Categories now live in a Collection dropdown (desktop) / accordion (drawer).

const pages = [
  { href: "/sell", label: "Acquisitions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ cartCount }: { cartCount?: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [drawerCollectionOpen, setDrawerCollectionOpen] = useState(false);
  const pathname = usePathname();

  // Close everything on navigation — otherwise the drawer stays open over the
  // new page after a link tap.
  useEffect(() => {
    setMenuOpen(false);
    setCollectionOpen(false);
    setDrawerCollectionOpen(false);
  }, [pathname]);

  // Lock body scroll behind the open drawer.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Escape closes the drawer / dropdown.
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
      <div className="mx-auto grid max-w-content grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 sm:px-8 md:px-10">
        {/* ---------------------------- LEFT ---------------------------- */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 text-ink md:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>

          <nav className="hidden items-center gap-6 md:flex">
            {/* Collection dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCollectionOpen(true)}
              onMouseLeave={() => setCollectionOpen(false)}
            >
              <button
                type="button"
                aria-expanded={collectionOpen}
                aria-haspopup="true"
                onClick={() => setCollectionOpen((v) => !v)}
                className="flex items-center gap-1.5 whitespace-nowrap py-2 text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:text-gold"
              >
                Collection
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 12 12"
                  fill="none"
                  className={`transition-transform ${collectionOpen ? "rotate-180" : ""}`}
                  aria-hidden
                >
                  <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {collectionOpen ? (
                <div className="absolute left-0 top-full w-56 border border-hairline bg-cream py-2 shadow-lg">
                  <Link
                    href="/collection"
                    className="block px-4 py-2 text-[12px] tracking-[0.14em] uppercase text-gold hover:bg-parchment"
                  >
                    All Pieces
                  </Link>
                  <div className="my-1 h-px bg-hairline" />
                  {categories.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/collection/${c.slug}`}
                      className="block px-4 py-2 text-[13px] text-ink/85 hover:bg-parchment hover:text-ink"
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            {pages.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="whitespace-nowrap text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:text-gold"
              >
                {p.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* --------------------------- CENTER --------------------------- */}
        <Link href="/" className="flex flex-col items-center justify-self-center leading-none">
          <span className="font-display text-[26px] tracking-[0.22em] text-ink md:text-[30px]">
            BALZAC
          </span>
          <span className="mt-1.5 flex items-center gap-2 text-[10px] tracking-[0.42em] text-gold">
            <span className="h-px w-4 bg-gold" />
            ANTIQUES
            <span className="h-px w-4 bg-gold" />
          </span>
        </Link>

        {/* ---------------------------- RIGHT --------------------------- */}
        {/* Reserved for the EN/FR language toggle (contract scope, next pass).
            The account icon that used to sit here linked to /account, which
            does not exist — a dead link, so it is gone until there is an
            actual account system behind it. */}
        <div className="flex items-center justify-end gap-5">
          {cartCount ? (
            <Link href="/cart" aria-label="View cart" className="relative p-1 text-ink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] text-cream">
                {cartCount}
              </span>
            </Link>
          ) : null}
        </div>
      </div>

      {/* ------------------------ MOBILE DRAWER ------------------------ */}
      {menuOpen ? (
        <div
          className="fixed inset-0 top-[73px] z-40 bg-ink/20 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      ) : null}

      <div
        id="mobile-drawer"
        className={`fixed inset-x-0 top-[73px] z-40 overflow-y-auto border-b border-hairline bg-cream transition-[max-height] duration-300 ease-out md:hidden ${
          menuOpen ? "max-h-[calc(100vh-73px)]" : "max-h-0 overflow-hidden border-b-0"
        }`}
      >
        <nav className="px-5 py-4">
          {/* Collection accordion */}
          <button
            type="button"
            aria-expanded={drawerCollectionOpen}
            onClick={() => setDrawerCollectionOpen((v) => !v)}
            className="flex w-full items-center justify-between border-b border-hairline py-3.5 text-[13px] tracking-[0.14em] uppercase text-ink"
          >
            Collection
            <span className={`text-gold transition-transform ${drawerCollectionOpen ? "rotate-45" : ""}`}>
              +
            </span>
          </button>

          {drawerCollectionOpen ? (
            <div className="border-b border-hairline bg-parchment/40">
              <Link
                href="/collection"
                className="block px-3 py-2.5 text-[13px] tracking-[0.12em] uppercase text-gold"
              >
                All Pieces
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/collection/${c.slug}`}
                  className="block px-3 py-2.5 text-[14px] text-ink/85"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          ) : null}

          {pages.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="block border-b border-hairline py-3.5 text-[13px] tracking-[0.14em] uppercase text-ink"
            >
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
