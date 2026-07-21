import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CUSTOMER_COOKIE, verifyCustomerSessionToken } from "@/lib/customer-session";
import { updateAddress, deleteAddress } from "../actions";
import AddressFields from "@/components/account/AddressFields";
import { T } from "@/components/Prefs";

export const metadata: Metadata = {
  title: "Edit address · Balzac Antiques",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditAddressPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Promise<{ err?: string }>;
}) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const session = await verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE)?.value);
  if (!session) redirect("/login?next=/account/addresses");

  const id = Number.parseInt(params.id, 10);
  const address = Number.isInteger(id)
    ? await db.address.findFirst({ where: { id, customerId: session.sub } })
    : null;
  if (!address) return notFound();

  return (
    <div>
      <Link href="/account/addresses" className="inline-flex items-center gap-2 text-[12px] tracking-[0.12em] text-gold hover:text-gold-dark">
        <span aria-hidden>&larr;</span> <T k="addr.backToAddresses" />
      </Link>

      <h1 className="mt-4 font-display text-[30px] text-ink"><T k="addr.editTitle" /></h1>
      <div className="mt-3 h-px w-10 bg-gold" />

      {sp?.err === "fields" ? (
        <p className="mt-6 border border-gold/40 bg-[#F4E9D4] px-4 py-3 text-[13px] text-[#6B5326]"><T k="addr.err" /></p>
      ) : null}

      <form action={updateAddress} className="mt-6 max-w-lg">
        <input type="hidden" name="id" value={address.id} />
        <AddressFields
          d={{
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            postcode: address.postcode,
            country: address.country,
          }}
        />
        {!address.isDefault ? (
          <label className="mt-4 flex items-center gap-2 text-[13px] text-ink/80">
            <input type="checkbox" name="makeDefault" className="h-4 w-4 accent-[#B99A5B]" />
            <T k="addr.makeDefault" />
          </label>
        ) : (
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-gold-dark"><T k="addr.default" /></p>
        )}
        <button type="submit" className="mt-6 bg-ink px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-cream transition-colors hover:bg-gold-dark">
          <T k="addr.saveChanges" />
        </button>
      </form>

      <form action={deleteAddress} className="mt-6">
        <input type="hidden" name="id" value={address.id} />
        <button type="submit" className="text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-[#8A3C3C]">
          <T k="addr.delete" />
        </button>
      </form>
    </div>
  );
}
