import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CUSTOMER_COOKIE, verifyCustomerSessionToken } from "@/lib/customer-session";

// The account area has no middleware entry (middleware guards /admin only).
// This server-side guard runs before any child renders, so a logged-out
// visitor is redirected with no flash of protected content.
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE)?.value);
  if (!session) redirect("/login?next=/account");

  return (
    <>
      <Header />
      <div className="mx-auto max-w-content px-5 py-12 sm:px-8">{children}</div>
      <Footer />
    </>
  );
}
