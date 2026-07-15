import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { T } from "@/components/Prefs";

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
        eyebrow={<T k="about.eyebrow" />}
        title={<T k="about.title" />}
        lead={<T k="about.lead" />}
      />

      <section className="mx-auto max-w-[62ch] space-y-6 px-6 pb-14 text-[15px] leading-[1.85] text-ink/80 sm:px-10">
        <p>
          <T k="about.p1" />
        </p>
        <p>
          <T k="about.p2" />
        </p>
        <p>
          <T k="about.p3" />
        </p>
      </section>

      {/* Closing tagline — client's own wording, kept verbatim */}
      <section className="bg-parchment px-6 py-14 text-center sm:px-10">
        <p className="font-display text-[22px] italic leading-relaxed text-ink sm:text-[26px]">
          <T k="about.tagline" />
        </p>
        <div className="mx-auto my-6 h-px w-10 bg-gold" />
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/collection" className="btn-outline">
            <T k="about.browse" />
            <span aria-hidden>&rarr;</span>
          </Link>
          <Link href="/contact" className="link-view-all">
            <T k="about.contact" /> &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
