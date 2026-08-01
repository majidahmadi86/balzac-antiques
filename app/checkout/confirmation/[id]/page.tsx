import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import { db } from "@/lib/db";
import { T, Price } from "@/components/Prefs";
import { getStripe, stripeEnabled, stripeTestMode } from "@/lib/stripe";
import { settleOrderPaid } from "@/lib/order-payment";
import { resumePayment } from "./actions";

export const metadata: Metadata = {
  title: "Order Received \u00b7 Balzac Antiques",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type OrderView = {
  id: string;
  status: string;
  totalEur: unknown;
  stripeSessionId: string | null;
  shipName: string;
  shipLine1: string;
  shipLine2: string | null;
  shipCity: string;
  shipPostcode: string;
  shipCountry: string;
  items: { id: number; titleEn: string; priceEur: unknown }[];
};

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { paid?: string; cancelled?: string; payerr?: string };
}) {
  let order: OrderView | null = await db.order.findUnique({
    where: { id: params.id },
    include: { items: true },
  });
  if (!order) return notFound();

  // Safety net. The webhook is the authoritative record, but a buyer can land
  // here a fraction of a second before it arrives, or before the webhook has
  // been configured at all. Asking Stripe directly means the page never shows
  // "awaiting payment" for an order that is genuinely paid. The settle call is
  // idempotent, so this and the webhook cannot double-apply.
  if (searchParams?.paid === "1" && order.status === "pending" && order.stripeSessionId) {
    const stripe = getStripe();
    if (stripe) {
      try {
        const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
        if (session.payment_status === "paid") {
          await settleOrderPaid(order.id, session.id);
          order = await db.order.findUnique({ where: { id: params.id }, include: { items: true } });
        }
      } catch {
        // leave the order as it is; the webhook will settle it
      }
    }
  }
  if (!order) return notFound();

  const isPaid = order.status === "paid" || order.status === "shipped" || order.status === "delivered";
  const awaitingCard = stripeEnabled() && order.status === "pending";

  return (
    <main>
      <Header />
      <ClearCartOnMount />
      <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8">
        {stripeTestMode() ? (
          <p className="mb-6 border border-gold/40 bg-gold/10 px-4 py-3 text-[12px] leading-relaxed text-ink/75">
            <T k="pay.testMode" />
          </p>
        ) : null}

        <p className="text-[11px] uppercase tracking-[0.24em] text-gold">
          <T k={isPaid ? "conf.paidEyebrow" : "conf.eyebrow"} />
        </p>
        <h1 className="mt-2 font-display text-[32px] leading-tight text-ink">
          <T k={isPaid ? "conf.paidTitle" : awaitingCard ? "conf.awaitTitle" : "conf.title"} />
        </h1>
        <div className="mt-4 h-px w-10 bg-gold" />
        <p className="mt-5 text-[15px] leading-relaxed text-ink/80">
          <T k={isPaid ? "conf.paidNext" : awaitingCard ? "conf.awaitNext" : "conf.next"} />
        </p>
        <p className="mt-2 text-[12px] text-ink/55">
          <T k="conf.number" /> <span className="tracking-[0.08em]">{order.id.slice(-8).toUpperCase()}</span>
        </p>

        {awaitingCard ? (
          <form action={resumePayment} className="mt-6">
            <input type="hidden" name="orderId" value={order.id} />
            {searchParams?.payerr === "1" ? (
              <p className="mb-3 text-[12px] text-ink/70"><T k="conf.payError" /></p>
            ) : null}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 bg-gold py-3.5 text-[12px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold-dark sm:w-auto sm:px-10"
            >
              <T k="conf.payNow" /> <span aria-hidden>&rarr;</span>
            </button>
          </form>
        ) : null}

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
