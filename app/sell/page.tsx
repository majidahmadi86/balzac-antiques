import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = {
  title: "Acquisitions — Balzac Antiques",
  description:
    "Balzac Antiques is actively seeking rare books, works of art, vintage watches, vinyl records, iconic design, decorative arts, and quality collectibles.",
};

const seeking = [
  "Rare books",
  "Works of art",
  "Vintage watches",
  "Vinyl records",
  "Iconic design",
  "Decorative arts",
  "Quality collectibles",
];

const MAILTO =
  "mailto:info@balzacantiques.ch" +
  "?subject=" +
  encodeURIComponent("Item offered for acquisition") +
  "&body=" +
  encodeURIComponent(
    [
      "Please describe the item (or collection) you would like to offer, and attach photographs to this email.",
      "",
      "Item / collection:",
      "Approximate age or period:",
      "Condition:",
      "Provenance or history (if known):",
      "Asking price (if any):",
      "",
      "Your name:",
      "Best contact number:",
    ].join("\n")
  );

export default function SellPage() {
  return (
    <main>
      <Header />

      <PageHeader
        eyebrow="Sell With Us"
        title="Acquisitions"
        lead="Balzac Antiques is actively seeking rare books, works of art, vintage watches, vinyl records, iconic design, decorative arts, and quality collectibles."
      />

      <section className="mx-auto max-w-content px-6 pb-14 sm:px-10">
        <ul className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2.5">
          {seeking.map((item) => (
            <li key={item} className="border border-hairline px-4 py-2 text-[12px] tracking-[0.1em] uppercase text-ink/80">
              {item}
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-12 max-w-[58ch] space-y-5 text-center text-[15px] leading-[1.85] text-ink/80">
          <p>
            If you wish to offer an item or an entire collection, please send us
            photographs and a brief description.
          </p>
          <p className="text-ink">
            All enquiries are handled in complete confidence.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <a href={MAILTO} className="btn-outline">
            Submit an Item
            <span aria-hidden>&rarr;</span>
          </a>
        </div>

        <p className="mt-6 text-center text-[13px] text-ink/60">
          Or write to us directly at{" "}
          <a href="mailto:info@balzacantiques.ch" className="text-gold hover:text-gold-dark">
            info@balzacantiques.ch
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
