import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { categories, auction } from "@/lib/data";
import { T } from "@/components/Prefs";

export default function HomePage() {
  return (
    <main>
      <Header />

      {/* ---------------------------------------------------------------- */}
      {/* HERO — first screen, no scroll. No text baked into the image:    */}
      {/* that was the bug causing the mobile overlap Mike flagged.        */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative flex min-h-[520px] items-center overflow-hidden sm:min-h-[600px]">
        <Image
          src="/images/hero-desk.svg"
          alt="Gold watch resting on antique leather-bound books"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-cream/20 sm:to-transparent" />

        <div className="relative z-10 px-6 py-16 sm:px-10">
          <h1 className="max-w-md font-display text-[38px] leading-[1.08] text-ink sm:text-[52px]">
            <T k="hero.title" />
          </h1>
          <div className="my-5 h-px w-14 bg-gold" />
          <p className="max-w-xs text-[13px] tracking-[0.14em] text-gold">
            <T k="hero.subtitle" />
          </p>
          <Link href="/collection" className="btn-outline mt-8">
            <T k="hero.cta" />
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* FEATURED CATEGORIES — directly after the hero, per Mike's note.  */}
      {/* Rendered from the categories array (lib/data.ts) — already      */}
      {/* data-driven, ready to swap for a DB fetch once the admin panel  */}
      {/* exists, no template changes needed then.                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-content px-5 py-14 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow"><T k="feat.eyebrow" /></p>
          <h2 className="mt-2 font-display text-[30px] text-ink sm:text-[36px]">
            <T k="feat.title" />
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 text-left sm:grid-cols-4 sm:gap-x-6">
          {categories
            .filter((c) => c.featured)
            .map((cat, i) => (
              <Reveal key={cat.slug} delay={i * 80}>
                <Link
                  href={`/collection/${cat.slug}`}
                  className="group block aspect-[3/4] overflow-hidden bg-parchment shadow-sm transition-shadow duration-300 hover:shadow-lg"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={cat.image}
                      alt={cat.label}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  </div>
                </Link>
                <p className="mt-3 text-[14px] uppercase tracking-[0.06em] text-ink">
                  {cat.label}
                </p>
                <Link
                  href={`/collection/${cat.slug}`}
                  className="link-view-all mt-1 inline-block"
                >
                  <T k="nav.viewAll" /> &rarr;
                </Link>
              </Reveal>
            ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* AUCTION BANNER — data-driven from the `auction` object in       */}
      {/* lib/data.ts, same swap-in-a-DB-later shape as categories.       */}
      {/* ---------------------------------------------------------------- */}
      <section className="grid grid-cols-1 bg-parchment sm:grid-cols-2">
        <div className="relative aspect-[4/3] sm:aspect-[4/3.4]">
          <Image
            src={auction.image}
            alt={auction.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            loading="lazy"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center gap-3 px-6 py-10 sm:px-10">
          <p className="eyebrow">{auction.eyebrow}</p>
          <h3 className="font-display text-[26px] leading-tight text-ink sm:text-[30px]">
            {auction.title}
          </h3>
          <div className="my-1 h-px w-10 bg-gold" />
          <p className="text-[13px] tracking-[0.1em] text-ink">
            {auction.city.toUpperCase()}
            <br />
            {auction.date.toUpperCase()}
          </p>
          <Link href={auction.href} className="btn-outline mt-4 w-fit">
            <T k="auction.viewLots" />
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* BRAND STORY — moved below the fold, after Featured/Auction, so  */}
      {/* it doesn't push Exceptional Pieces off the first screen.        */}
      {/* ---------------------------------------------------------------- */}
      <Reveal>
        <section className="mx-auto max-w-content px-6 py-16 text-center sm:px-10">
          <p className="font-display text-[22px] italic leading-relaxed text-ink sm:text-[26px]">
            <T k="story.quote" />
          </p>
          <div className="mx-auto my-5 h-px w-10 bg-gold" />
          <p className="mx-auto max-w-[52ch] text-[14px] leading-relaxed text-ink/70">
            <T k="story.body" />
          </p>
        </section>
      </Reveal>

      <Footer />
    </main>
  );
}
