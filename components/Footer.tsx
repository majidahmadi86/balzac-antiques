import Link from "next/link";
import TrustBadges from "./TrustBadges";
import { categories } from "@/lib/data";

const social = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-cream">
      <TrustBadges />

      <div className="mx-auto grid max-w-content grid-cols-2 gap-10 px-5 py-14 sm:px-8 md:grid-cols-4 md:px-10">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-[22px] tracking-[0.18em] text-ink">
            BALZAC
          </p>
          <p className="mt-3 max-w-[26ch] text-[13px] leading-relaxed text-ink/70">
            Curated rare books, fine watches, and remarkable objects, sourced
            and authenticated in Bangkok for collectors worldwide.
          </p>
          <div className="mt-4 flex gap-4">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-[11px] tracking-[0.14em] uppercase text-gold hover:text-gold-dark"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-gold">
            Collections
          </p>
          <ul className="mt-4 space-y-2.5">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/collection/${c.slug}`}
                  className="text-[13px] text-ink/80 hover:text-ink"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] uppercase text-gold">
            Balzac
          </p>
          <ul className="mt-4 space-y-2.5">
            {[
              ["Our Story", "/about"],
              ["Upcoming Auctions", "/auctions"],
              ["Sell With Us", "/sell"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={label}>
                <Link href={href} className="text-[13px] text-ink/80 hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <p className="text-[11px] tracking-[0.18em] uppercase text-gold">
            Stay Informed
          </p>
          <p className="mt-4 text-[13px] leading-relaxed text-ink/70">
            New acquisitions and upcoming auctions, occasionally.
          </p>
          <form className="mt-4 flex border-b border-ink/30 pb-2">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="shrink-0 text-[12px] tracking-[0.14em] uppercase text-gold hover:text-gold-dark"
            >
              Join &rarr;
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-hairline px-5 py-5 text-center text-[11px] tracking-[0.06em] text-ink/50 sm:px-8">
        &copy; {new Date().getFullYear()} Balzac Antiques. All rights reserved.
      </div>
    </footer>
  );
}
