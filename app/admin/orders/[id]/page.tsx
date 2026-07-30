import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/session";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/OrderStatusBadge";
import { db } from "@/lib/db";
import { setOrderStatus } from "../actions";

export const metadata: Metadata = {
  title: "Order · Balzac Antiques Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// Which buttons each status offers, and how they are labelled for Zac.
const ACTIONS: Record<string, { next: string; label: string; solid?: boolean }[]> = {
  pending: [
    { next: "paid", label: "Mark Paid", solid: true },
    { next: "cancelled", label: "Cancel Order" },
  ],
  paid: [
    { next: "shipped", label: "Mark Shipped", solid: true },
    { next: "cancelled", label: "Cancel Order" },
  ],
  shipped: [{ next: "delivered", label: "Mark Delivered", solid: true }],
};

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  const email = session?.email ?? "";

  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      customer: { select: { name: true, email: true } },
      items: true,
    },
  });
  if (!order) return notFound();

  const actions = ACTIONS[order.status] ?? [];

  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <AdminHeader email={email} />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/admin/orders" className="text-[11px] uppercase tracking-[0.2em] text-[#9A8F7D] hover:text-[#1F1B16]">
          &larr; All orders
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-serif text-[26px] text-[#1F1B16]">
            Order {order.id.slice(-8).toUpperCase()}
          </h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-[13px] text-[#9A8F7D]">
          Placed {order.createdAt.toISOString().slice(0, 10)} at {order.createdAt.toISOString().slice(11, 16)} UTC
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <section className="border border-[#E4DCCB] bg-white/70 p-6">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#9A8F7D]">Buyer</h2>
            <p className="mt-3 text-[15px] text-[#1F1B16]">{order.customer.name}</p>
            <p className="mt-1 text-[13px] text-[#6B6154]">
              <a href={`mailto:${order.customer.email}`} className="underline underline-offset-2 hover:text-[#1F1B16]">
                {order.customer.email}
              </a>
            </p>
            {order.shipPhone ? <p className="mt-1 text-[13px] text-[#6B6154]">{order.shipPhone}</p> : null}
          </section>

          <section className="border border-[#E4DCCB] bg-white/70 p-6">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#9A8F7D]">Delivery Address</h2>
            <p className="mt-3 text-[14px] leading-relaxed text-[#1F1B16]">
              {order.shipName}
              <br />
              {order.shipLine1}
              {order.shipLine2 ? <><br />{order.shipLine2}</> : null}
              <br />
              {order.shipPostcode} {order.shipCity}
              <br />
              {order.shipCountry}
            </p>
          </section>
        </div>

        <section className="mt-5 border border-[#E4DCCB] bg-white/70 p-6">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#9A8F7D]">Pieces</h2>
          <ul className="mt-3 divide-y divide-[#EFE9DA] border-y border-[#EFE9DA]">
            {order.items.map((i: { id: number; titleEn: string; priceEur: unknown; productId: string | null }) => (
              <li key={i.id} className="flex items-center justify-between gap-4 py-3 text-[14px] text-[#1F1B16]">
                <span>
                  {i.titleEn}
                  {i.productId === null ? (
                    <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-[#9A8F7D]">(piece since removed)</span>
                  ) : null}
                </span>
                <span>{Number(String(i.priceEur)).toLocaleString("en-CH")} EUR</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between text-[#1F1B16]">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#9A8F7D]">Total</span>
            <span className="font-serif text-[20px]">{Number(String(order.totalEur)).toLocaleString("en-CH")} EUR</span>
          </div>
        </section>

        {actions.length > 0 ? (
          <section className="mt-8 border border-[#E4DCCB] bg-white/70 p-6">
            <h2 className="text-[10px] uppercase tracking-[0.22em] text-[#9A8F7D]">Actions</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-[#6B6154]">
              Mark Paid once the money has arrived; the pieces become Sold on the site automatically.
              Cancelling releases the pieces for sale again.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {actions.map((a) => (
                <form key={a.next} action={setOrderStatus}>
                  <input type="hidden" name="id" value={order.id} />
                  <input type="hidden" name="next" value={a.next} />
                  <button
                    type="submit"
                    className={
                      a.solid
                        ? "bg-[#1F1B16] px-5 py-2.5 text-[10px] uppercase tracking-[0.24em] text-[#F7F3EA] transition-colors hover:bg-[#3A322A]"
                        : "border border-[#C0736A]/50 bg-white px-5 py-2.5 text-[10px] uppercase tracking-[0.24em] text-[#8A3C3C] transition-colors hover:border-[#8A3C3C]"
                    }
                  >
                    {a.label}
                  </button>
                </form>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
