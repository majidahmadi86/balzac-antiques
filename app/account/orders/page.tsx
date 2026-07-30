import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CUSTOMER_COOKIE, verifyCustomerSessionToken } from "@/lib/customer-session";
import OrderStatusChip from "@/components/OrderStatusChip";
import { T, Price } from "@/components/Prefs";

export const metadata: Metadata = {
  title: "My Orders · Balzac Antiques",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {
  const cookieStore = await cookies();
  const session = await verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE)?.value);
  if (!session) redirect("/login?next=/account/orders");

  const orders = await db.order.findMany({
    where: { customerId: session.sub },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <Link href="/account" className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] text-gold hover:text-gold-dark">
        <span aria-hidden>&larr;</span> <T k="addr.backToAccount" />
      </Link>

      <h1 className="mt-4 font-display text-[30px] text-ink"><T k="orders.title" /></h1>
      <div className="mt-3 h-px w-10 bg-gold" />

      {orders.length === 0 ? (
        <>
          <p className="mt-6 text-[14px] text-ink/70"><T k="account.ordersEmpty" /></p>
          <Link href="/collection" className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
            <T k="account.browse" /> <span aria-hidden>&rarr;</span>
          </Link>
        </>
      ) : (
        <ul className="mt-6 grid gap-5">
          {orders.map((o: {
            id: string; createdAt: Date; status: string; totalEur: unknown;
            items: { id: number; titleEn: string; priceEur: unknown }[];
          }) => (
            <li key={o.id} className="border border-hairline bg-parchment p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[13px] tracking-[0.08em] text-ink">
                  <T k="conf.number" /> {o.id.slice(-8).toUpperCase()}
                </span>
                <OrderStatusChip status={o.status} />
              </div>
              <p className="mt-1 text-[12px] text-ink/55">{o.createdAt.toISOString().slice(0, 10)}</p>

              <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
                {o.items.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-4 py-2.5 text-[14px] text-ink">
                    <span>{i.titleEn}</span>
                    <Price eur={Number(String(i.priceEur))} />
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink/70"><T k="orders.total" /></span>
                <span className="font-display text-[18px] text-ink"><Price eur={Number(String(o.totalEur))} /></span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
