import Link from "next/link";
import { categories } from "@/lib/data";

export default function Header({ cartCount }: { cartCount?: number }) {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-cream/95 backdrop-blur">
      <div className="mx-auto grid max-w-content grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 sm:px-8 md:px-10">
        <div className="flex items-center gap-6">
          <button aria-label="Open menu" className="p-1 text-ink md:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <nav className="hidden items-center gap-6 md:flex">
            {categories.slice(0, 4).map((c) => (
              <Link key={c.slug} href={`/collection/${c.slug}`} className="whitespace-nowrap text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:text-gold">
                {c.label}
              </Link>
            ))}
          </nav>
        </div>

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

        <div className="flex items-center justify-end gap-6">
          <nav className="hidden items-center gap-6 md:flex">
            {categories.slice(4, 8).map((c) => (
              <Link key={c.slug} href={`/collection/${c.slug}`} className="whitespace-nowrap text-[12px] tracking-[0.14em] uppercase text-ink transition-colors hover:text-gold">
                {c.label}
              </Link>
            ))}
          </nav>

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
          ) : (
            <Link href="/account" aria-label="Account" className="p-1 text-ink">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4.5 20c1.5-3.5 5-5 7.5-5s6 1.5 7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
