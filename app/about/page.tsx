import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "About — Balzac Antiques",
  description:
    "Balzac Antiques is a curated destination for rare and timeless objects, sourced across Europe and Asia.",
};

export default function AboutPage() {
  return (
    <main>
      <Header />

      <PageHeader
        eyebrow="About Us"
        title="Rare Objects. Timeless Stories."
        lead="Balzac Antiques is a curated destination for rare and timeless objects."
      />

      <section className="mx-auto max-w-[62ch] space-y-6 px-6 pb-14 text-[15px] leading-[1.85] text-ink/80 sm:px-10">
        <p>
          Our collection includes rare books, vintage vinyl records, fine
          watches, artworks, iconic design pieces, decorative objects, and
          carefully selected collectibles. Every item is chosen for its
          authenticity, quality, rarity, and lasting appeal.
        </p>
        <p>
          We believe that great objects carry history, craftsmanship, and
          character. Whether you are an experienced collector or simply looking
          for something unique, we are committed to offering carefully sourced
          pieces that deserve to be appreciated for generations to come.
        </p>
        <p>
          Sourcing across Europe and Asia, Balzac Antiques is built on a passion
          for quality, authenticity, and thoughtful curation.
        </p>
      </section>

      {/* Closing tagline — client's own wording, kept verbatim */}
      <section className="bg-parchment px-6 py-14 text-center sm:px-10">
        <p className="font-display text-[22px] italic leading-relaxed text-ink sm:text-[26px]">
          Balzac Antiques — Rare Objects. Timeless Stories.
        </p>
        <div className="mx-auto my-6 h-px w-10 bg-gold" />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/collection" className="btn-outline">
            Browse the Collection
            <span aria-hidden>&rarr;</span>
          </Link>
          <Link href="/contact" className="link-view-all">
            Contact Us &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
