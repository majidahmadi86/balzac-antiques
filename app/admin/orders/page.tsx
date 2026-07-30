import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/session";
import AdminHeader from "@/components/admin/AdminHeader";
import { db } from "@/lib/db";
import StatusBadge from "@/components/admin/OrderStatusBadge";

export const metadata: Metadata = {
  title: "Orders · Balzac Antiques Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  const email = session?.email ?? "";

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      customer: { select: { name: true, email: true } },
      items: { select: { id: true } },
    },
  });

  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <AdminHeader email={email} />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-serif text-[26px] text-[#1F1B16]">Orders</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6B6154]">
          Newest first. Open an order to see the buyer, the pieces and the delivery address, and to move it along:
          mark it paid once the money has arrived, then shipped, then delivered. Marking an order paid also marks
          its pieces as sold on the site; cancelling releases them for sale again.
        </p>

        {orders.length === 0 ? (
          <p className="mt-10 border border-[#E4DCCB] bg-white/70 px-6 py-8 text-[14px] text-[#6B6154]">
            No orders yet. When a customer places an order it will appear here.
          </p>
        ) : (
          <div className="mt-8 overflow-x-auto border border-[#E4DCCB] bg-white/70">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E4DCCB] text-[10px] uppercase tracking-[0.18em] text-[#9A8F7D]">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Reference</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Pieces</th>
                  <th className="px-4 py-3">Total (EUR)</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {orders.map((o: {
                  id: string; createdAt: Date; totalEur: unknown; status: string;
                  customer: { name: string; email: string }; items: { id: number }[];
                }) => (
                  <tr key={o.id} className="border-b border-[#EFE9DA] text-[#1F1B16]">
                    <td className="whitespace-nowrap px-4 py-3">{o.createdAt.toISOString().slice(0, 10)}</td>
                    <td className="px-4 py-3 tracking-[0.06em]">{o.id.slice(-8).toUpperCase()}</td>
                    <td className="px-4 py-3">
                      {o.customer.name}
                      <span className="block text-[11px] text-[#9A8F7D]">{o.customer.email}</span>
                    </td>
                    <td className="px-4 py-3">{o.items.length}</td>
                    <td className="px-4 py-3">{Number(String(o.totalEur)).toLocaleString("en-CH")}</td>
                    <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="border border-[#D8CFBB] bg-white px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-[#1F1B16] transition-colors hover:border-[#B99A5B]"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
