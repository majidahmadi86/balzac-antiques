import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "../../lib/session";
import AdminHeader from "../../components/admin/AdminHeader";

export const metadata: Metadata = {
  title: "Dashboard · Balzac Antiques Admin",
  robots: { index: false, follow: false },
};

// Session-dependent page: must render per-request, never be statically cached
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  // Middleware already guards this route; this is defense in depth only.
  const email = session?.email ?? "";

  const sections = [
    { title: "Products", note: "Add, edit and publish pieces in English and French.", status: "Live", href: "/admin/products" },
    { title: "Images", note: "Upload photos from your phone. They are optimised automatically.", status: "Coming next", href: null },
    { title: "Site Content", note: "Featured pieces and the auction banner.", status: "Planned", href: null },
  ] as const;

  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <AdminHeader email={email} />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-serif text-[26px] text-[#1F1B16]">Dashboard</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6B6154]">
          Welcome. Catalogue management tools will appear here as they are completed.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => {
            const card = (
              <div
                className={`h-full border border-[#E4DCCB] bg-white/70 p-6 ${
                  s.href ? "transition-colors hover:border-[#B99A5B]" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-[17px] text-[#1F1B16]">{s.title}</h2>
                  <span className="text-[9px] tracking-[0.22em] uppercase text-[#B99A5B]">{s.status}</span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[#6B6154]">{s.note}</p>
              </div>
            );
            return s.href ? (
              <Link key={s.title} href={s.href} className="block">
                {card}
              </Link>
            ) : (
              <div key={s.title}>{card}</div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
