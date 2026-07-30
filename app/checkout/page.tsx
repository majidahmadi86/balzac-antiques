import type { Metadata } from "next";
import { cookies } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm, { type SavedAddress } from "@/components/CheckoutForm";
import { db } from "@/lib/db";
import { CUSTOMER_COOKIE, verifyCustomerSessionToken } from "@/lib/customer-session";

export const metadata: Metadata = {
  title: "Checkout · Balzac Antiques",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ err?: string; piece?: string }>;
}) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const session = await verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE)?.value);

  let customer: { name: string; email: string } | null = null;
  let addresses: SavedAddress[] = [];
  if (session) {
    const row = await db.customer.findUnique({
      where: { id: session.sub },
      select: { name: true, email: true, addresses: { orderBy: [{ isDefault: "desc" }, { id: "desc" }] } },
    });
    if (row) {
      customer = { name: row.name, email: row.email };
      addresses = row.addresses.map((a: SavedAddress) => ({
        id: a.id,
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        postcode: a.postcode,
        country: a.country,
        isDefault: a.isDefault,
      }));
    }
  }

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-content px-5 py-10 sm:px-8">
        <CheckoutForm customer={customer} addresses={addresses} err={sp?.err} errPiece={sp?.piece} />
      </div>
      <Footer />
    </main>
  );
}
