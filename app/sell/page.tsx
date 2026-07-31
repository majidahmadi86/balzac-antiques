import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { T } from "@/components/Prefs";
import { submitSell } from "@/lib/message-actions";

export const metadata: Metadata = {
  title: "Acquisitions · Balzac Antiques",
  description:
    "Balzac Antiques is actively seeking rare books, works of art, vintage watches, vinyl records, iconic design, decorative arts, and quality collectibles.",
};

const seeking = ["sell.i1","sell.i2","sell.i3","sell.i4","sell.i5","sell.i6","sell.i7"];

export default async function SellPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; err?: string }>;
}) {
  const sp = await searchParams;

  return (
    <main>
      <Header />

      <PageHeader
        eyebrow={<T k="sell.eyebrow" />}
        title={<T k="sell.title" />}
        lead={<T k="sell.lead" />}
      />

      <section className="mx-auto max-w-content px-6 pb-14 sm:px-10">
        <ul className="mx-auto flex max-w-2xl flex-wrap justify-center gap-2.5">
          {seeking.map((item) => (
            <li
              key={item}
              className="border border-hairline px-4 py-2 text-[12px] tracking-[0.1em] uppercase text-ink/80"
            >
              <T k={item} />
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-12 max-w-[58ch] space-y-5 text-center text-[15px] leading-[1.85] text-ink/80">
          <p>
            <T k="sell.p1" />
          </p>
          <p className="text-ink">
            <T k="sell.p2" />
          </p>
        </div>

        {sp?.sent === "1" ? (
          <p role="status" className="mx-auto mt-10 max-w-xl border border-gold/40 bg-[#F4E9D4] px-5 py-4 text-center text-[14px] leading-relaxed text-[#6B5326]">
            <T k="sell.sent" />
          </p>
        ) : (
          <div className="mx-auto mt-12 max-w-xl border-t border-hairline pt-10">
            <h2 className="text-center font-display text-[22px] text-ink">
              <T k="sell.formTitle" />
            </h2>
            <div className="mx-auto mt-3 h-px w-8 bg-gold" />

            {sp?.err === "1" ? (
              <p role="alert" className="mt-6 border border-gold/40 bg-[#F4E9D4] px-4 py-3 text-[13px] text-[#6B5326]">
                <T k="contact.err" />
              </p>
            ) : null}

            <form action={submitSell} className="mt-6 grid gap-4">
              <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-ink/60"><T k="contact.name" /></span>
                  <input name="name" required maxLength={120} autoComplete="name" className="w-full border border-hairline bg-cream px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-gold" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-ink/60"><T k="auth.email" /></span>
                  <input type="email" name="email" required maxLength={254} autoComplete="email" className="w-full border border-hairline bg-cream px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-gold" />
                </label>
              </div>
              <label className="block sm:max-w-[calc(50%-0.5rem)]">
                <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-ink/60"><T k="checkout.phone" /></span>
                <input name="phone" maxLength={40} autoComplete="tel" className="w-full border border-hairline bg-cream px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-gold" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-ink/60"><T k="sell.details" /></span>
                <textarea name="body" required rows={7} maxLength={5000} placeholder="" className="w-full border border-hairline bg-cream px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-gold resize-y" />
                <span className="mt-1.5 block text-[11px] leading-relaxed text-ink/50"><T k="sell.detailsHint" /></span>
              </label>
              <button type="submit" className="mt-2 bg-gold px-6 py-3.5 text-[12px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold-dark">
                <T k="sell.send" />
              </button>
            </form>
            <p className="mt-5 text-center text-[13px] leading-relaxed text-ink/60">
              <T k="sell.photosNote" />
            </p>
          </div>
        )}

        <p className="mt-6 text-center text-[13px] text-ink/60">
          <T k="sell.orWrite" />{" "}
          <a
            href="mailto:info@balzacantiques.ch"
            className="text-gold hover:text-gold-dark"
          >
            info@balzacantiques.ch
          </a>
        </p>
      </section>

      <Footer />
    </main>
  );
}
