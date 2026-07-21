"use client";

// Homepage hero as a slow crossfade through the admin-chosen hero products
// (max 5). Keeps the brand hero's composition: full-bleed photo, cream
// gradient, left-aligned serif headline. Falls back gracefully: one slide
// renders as a static hero (no dots, no timer), and app/page.tsx only mounts
// this at all when hero products exist.

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { type HeroSlide } from "@/lib/catalogue";
import { T, Bi } from "@/components/Prefs";
import { useCart } from "@/components/Cart";

const SLIDE_MS = 6000;

export default function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), SLIDE_MS);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  return (
    <section
      className="relative flex min-h-[520px] items-center overflow-hidden sm:min-h-[600px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Selected pieces"
    >
      {slides.map((s, i) => (
        <div
          key={s.slug}
          aria-hidden={i !== active}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${i === active ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={s.image}
            alt={s.titleEn}
            fill
            priority={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/80 to-cream/20 sm:to-transparent" />

      <div className="relative z-10 px-6 py-16 sm:px-10">
        {slides.map((s, i) => (
          <div
            key={s.slug}
            className={`transition-opacity duration-700 ${i === active ? "opacity-100" : "pointer-events-none absolute inset-x-6 top-16 opacity-0 sm:inset-x-10"}`}
            aria-hidden={i !== active}
          >
            {s.eyebrow ? (
              <p className="text-[12px] tracking-[0.22em] uppercase text-gold">{s.eyebrow}</p>
            ) : null}
            <h1 className="mt-2 max-w-md font-display text-[38px] leading-[1.08] text-ink sm:text-[52px]">
              <Bi en={s.titleEn} fr={s.titleFr} />
            </h1>
            <div className="my-5 h-px w-14 bg-gold" />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {s.status === "available" ? (
                <button
                  type="button"
                  onClick={() =>
                    add({
                      slug: s.slug,
                      titleEn: s.titleEn,
                      titleFr: s.titleFr,
                      priceEur: s.priceEur,
                      image: s.image,
                      categorySlug: s.categorySlug,
                      categoryLabelEn: s.categoryLabelEn,
                      categoryLabelFr: s.categoryLabelFr,
                    })
                  }
                  className="inline-flex items-center gap-2 bg-gold px-7 py-3 text-[13px] tracking-widest2 uppercase text-cream transition-colors hover:bg-gold-dark"
                >
                  <T k="cart.add" />
                  <span aria-hidden>&rarr;</span>
                </button>
              ) : null}
              <Link href={`/product/${s.slug}`} className="btn-outline">
                <T k="hero.viewPiece" />
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 ? (
        <div className="absolute bottom-6 left-6 z-10 flex gap-2.5 sm:left-10">
          {slides.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show ${s.titleEn}`}
              aria-current={i === active}
              className={`h-[3px] w-8 transition-colors duration-300 ${i === active ? "bg-gold" : "bg-ink/20 hover:bg-ink/40"}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
