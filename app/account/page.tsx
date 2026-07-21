import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { CUSTOMER_COOKIE, verifyCustomerSessionToken } from "@/lib/customer-session";
import { logout } from "@/app/login/actions";
import { T } from "@/components/Prefs";

export const metadata: Metadata = {
  title: "My Account · Balzac Antiques",
  robots: { index: false, follow: false },
};

// Session-dependent: render per request, never statically cache.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const session = await verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE)?.value);
  // Layout already guarded this route; this is defense in depth only.
  const customer = session
    ? await db.customer.findUnique({ where: { id: session.sub }, select: { name: true } })
    : null;
  const name = customer?.name ?? "";
  const addressCount = session
    ? await db.address.count({ where: { customerId: session.sub } })
    : 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-hairline pb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold"><T k="account.welcome" /></p>
          <h1 className="mt-1 font-display text-[30px] text-ink">{name}</h1>
        </div>
        <form action={logout}>
          <button type="submit" className="text-[11px] uppercase tracking-[0.2em] text-ink/60 transition-colors hover:text-gold-dark">
            <T k="account.signOut" />
          </button>
        </form>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <section className="border border-hairline bg-parchment p-7">
          <h2 className="font-display text-[18px] text-ink"><T k="account.ordersTitle" /></h2>
          <div className="mt-3 h-px w-8 bg-gold" />
          <p className="mt-4 text-[14px] text-ink/80"><T k="account.ordersEmpty" /></p>
          <p className="mt-1 text-[13px] text-ink/55"><T k="account.ordersNote" /></p>
          <Link href="/collection" className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
            <T k="account.browse" /> <span aria-hidden>&rarr;</span>
          </Link>
        </section>

        <section className="border border-hairline bg-parchment p-7">
          <h2 className="font-display text-[18px] text-ink"><T k="account.addressesTitle" /></h2>
          <div className="mt-3 h-px w-8 bg-gold" />
          {addressCount > 0 ? (
            <p className="mt-4 text-[14px] text-ink/80"><T k="addr.onFile" /></p>
          ) : (
            <p className="mt-4 text-[14px] text-ink/80"><T k="account.addressesEmpty" /></p>
          )}
          <Link href="/account/addresses" className="mt-5 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
            <T k={addressCount > 0 ? "addr.manage" : "addr.add"} /> <span aria-hidden>&rarr;</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
