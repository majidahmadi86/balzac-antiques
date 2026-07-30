// Shared frame for the legal pages. Content is bilingual inline (EN/FR pairs)
// rather than dictionary keys, since these are long-form documents.
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bi } from "@/components/Prefs";

export type LegalSection = {
  hEn: string;
  hFr: string;
  pEn: string[];
  pFr: string[]; // same length as pEn; paragraphs are paired by index
};

export default function LegalPage({
  titleEn,
  titleFr,
  sections,
}: {
  titleEn: string;
  titleFr: string;
  sections: LegalSection[];
}) {
  return (
    <main>
      <Header />
      <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
        <h1 className="font-display text-[32px] leading-tight text-ink">
          <Bi en={titleEn} fr={titleFr} />
        </h1>
        <div className="mt-4 h-px w-10 bg-gold" />
        {sections.map((s, i) => (
          <section key={i} className="mt-9">
            <h2 className="font-display text-[19px] text-ink">
              <Bi en={s.hEn} fr={s.hFr} />
            </h2>
            {s.pEn.map((_, j) => (
              <p key={j} className="mt-3 text-[14.5px] leading-relaxed text-ink/80">
                <Bi en={s.pEn[j]} fr={s.pFr[j] ?? s.pEn[j]} />
              </p>
            ))}
          </section>
        ))}
      </div>
      <Footer />
    </main>
  );
}
