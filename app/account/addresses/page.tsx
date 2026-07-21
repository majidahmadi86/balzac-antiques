import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CUSTOMER_COOKIE, verifyCustomerSessionToken } from "@/lib/customer-session";
import { createAddress, deleteAddress, setDefaultAddress } from "./actions";
import AddressFields from "@/components/account/AddressFields";
import { T } from "@/components/Prefs";

export const metadata: Metadata = {
  title: "Addresses · Balzac Antiques",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AddressesPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; deleted?: string; err?: string }>;
}) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const session = await verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE)?.value);
  if (!session) redirect("/login?next=/account/addresses");

  const addresses = await db.address.findMany({
    where: { customerId: session.sub },
    orderBy: [{ isDefault: "desc" }, { id: "desc" }],
  });

  return (
    <div>
      <Link href="/account" className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] text-gold hover:text-gold-dark">
        <span aria-hidden>&larr;</span> <T k="addr.backToAccount" />
      </Link>

      <h1 className="mt-4 font-display text-[30px] text-ink"><T k="addr.title" /></h1>
      <div className="mt-3 h-px w-10 bg-gold" />

      {sp?.saved === "1" ? (
        <p className="mt-6 border border-gold/40 bg-[#F4E9D4] px-4 py-3 text-[13px] text-[#6B5326]"><T k="addr.saved" /></p>
      ) : null}
      {sp?.deleted === "1" ? (
        <p className="mt-6 border border-gold/40 bg-[#F4E9D4] px-4 py-3 text-[13px] text-[#6B5326]"><T k="addr.deleted" /></p>
      ) : null}

      {addresses.length === 0 ? (
        <p className="mt-6 text-[14px] text-ink/70"><T k="addr.none" /></p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="border border-hairline bg-parchment p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="text-[14px] leading-relaxed text-ink">
                  <p>{a.line1}</p>
                  {a.line2 ? <p>{a.line2}</p> : null}
                  <p>{a.postcode} {a.city}</p>
                  <p>{a.country}</p>
                </div>
                {a.isDefault ? (
                  <span className="shrink-0 border border-gold/50 bg-cream px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] text-gold-dark">
                    <T k="addr.default" />
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.16em]">
                <Link href={`/account/addresses/${a.id}`} className="text-gold-dark hover:text-gold"><T k="addr.edit" /></Link>
                {!a.isDefault ? (
                  <form action={setDefaultAddress}>
                    <input type="hidden" name="id" value={a.id} />
                    <button type="submit" className="text-ink/60 hover:text-gold-dark"><T k="addr.setDefault" /></button>
                  </form>
                ) : null}
                <form action={deleteAddress}>
                  <input type="hidden" name="id" value={a.id} />
                  <button type="submit" className="text-ink/50 hover:text-[#8A3C3C]"><T k="addr.delete" /></button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 border-t border-hairline pt-8">
        <h2 className="font-display text-[20px] text-ink"><T k="addr.add" /></h2>
        {sp?.err === "fields" ? (
          <p className="mt-4 border border-gold/40 bg-[#F4E9D4] px-4 py-3 text-[13px] text-[#6B5326]"><T k="addr.err" /></p>
        ) : null}
        <form action={createAddress} className="mt-5 max-w-lg">
          <AddressFields />
          <label className="mt-4 flex items-center gap-2 text-[13px] text-ink/80">
            <input type="checkbox" name="makeDefault" className="h-4 w-4 accent-[#B99A5B]" />
            <T k="addr.makeDefault" />
          </label>
          <button type="submit" className="mt-6 bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-cream transition-colors hover:bg-gold-dark">
            <T k="addr.save" />
          </button>
        </form>
      </div>
    </div>
  );
}
