import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import { db } from "@/lib/db";
import { T, Price } from "@/components/Prefs";

export const metadata: Metadata = {
  title: "Order Received · Balzac Antiques",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: { id: string } }) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) return notFound();

  return (
    <main>
      <Header />
      <ClearCartOnMount />
      <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-gold"><T k="conf.eyebrow" /></p>
        <h1 className="mt-2 font-display text-[32px] leading-tight text-ink"><T k="conf.title" /></h1>
        <div className="mt-4 h-px w-10 bg-gold" />
        <p className="mt-5 text-[15px] leading-relaxed text-ink/80"><T k="conf.next" /></p>
        <p className="mt-2 text-[12px] text-ink/55">
          <T k="conf.number" /> <span className="tracking-[0.08em]">{order.id.slice(-8).toUpperCase()}</span>
        </p>

        <div className="mt-8 border border-hairline bg-parchment p-6">
          <h2 className="font-display text-[17px] text-ink"><T k="conf.items" /></h2>
          <ul className="mt-3 divide-y divide-hairline border-y border-hairline">
            {order.items.map((i: { id: number; titleEn: string; priceEur: unknown }) => (
              <li key={i.id} className="flex items-center justify-between gap-4 py-3 text-[14px] text-ink">
                <span>{i.titleEn}</span>
                <Price eur={Number(String(i.priceEur))} />
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.18em] text-ink/70"><T k="cart.subtotal" /></span>
            <span className="font-display text-[19px] text-ink"><Price eur={Number(String(order.totalEur))} /></span>
          </div>

          <h2 className="mt-6 font-display text-[17px] text-ink"><T k="conf.shipTo" /></h2>
          <p className="mt-2 text-[14px] leading-relaxed text-ink">
            {order.shipName}
            <br />
            {order.shipLine1}
            {order.shipLine2 ? <><br />{order.shipLine2}</> : null}
            <br />
            {order.shipPostcode} {order.shipCity}
            <br />
            {order.shipCountry}
          </p>
        </div>

        <Link href="/collection" className="mt-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
          <T k="conf.continue" /> <span aria-hidden>&rarr;</span>
        </Link>
      </div>
      <Footer />
    </main>
  );
}
