import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import { T } from "@/components/Prefs";

export const metadata: Metadata = {
  title: "Contact — Balzac Antiques",
  description:
    "Enquiries regarding our collection, sourcing requests, or private acquisitions.",
};

// Contact channels — single source of truth for this page. When the admin
// panel lands, these become editable fields rather than hardcoded values.
const channels = [
  {
    key: "contact.email",
    value: "info@balzacantiques.ch",
    href: "mailto:info@balzacantiques.ch",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5.5" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="m3.5 7 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "contact.ch",
    value: "+41 76 829 56 28",
    href: "tel:+41768295628",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "contact.asia",
    value: "+66 94 893 7373",
    href: "tel:+66948937373",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ContactPage() {
  return (
    <main>
      <Header />

      <PageHeader
        eyebrow={<T k="contact.eyebrow" />}
        title={<T k="contact.title" />}
        lead={<T k="contact.lead" />}
      />

      <section className="mx-auto max-w-content px-6 pb-16 sm:px-10">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.key}
              href={c.href}
              className="group flex flex-col items-center gap-3 border border-hairline bg-parchment/50 px-5 py-8 text-center transition-colors hover:border-gold"
            >
              <span className="text-gold">{c.icon}</span>
              <span className="text-[11px] tracking-[0.18em] uppercase text-gold">
                <T k={c.key} />
              </span>
              <span className="text-[15px] text-ink transition-colors group-hover:text-gold-dark">
                {c.value}
              </span>
            </a>
          ))}
        </div>

        <p className="mt-12 text-center text-[15px] italic text-ink/70">
          <T k="contact.forward" />
        </p>
      </section>

      <Footer />
    </main>
  );
}
