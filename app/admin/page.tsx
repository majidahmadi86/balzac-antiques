import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "../../lib/session";
import { logout } from "./login/actions";

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
    { title: "Products", note: "Add, edit and publish pieces in English and French.", status: "Coming next" },
    { title: "Images", note: "Upload photos from your phone. They are optimised automatically.", status: "Coming next" },
    { title: "Site Content", note: "Featured pieces and the auction banner.", status: "Planned" },
  ];

  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <header className="border-b border-[#E4DCCB] bg-white/60">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-serif text-[19px] tracking-[0.26em] text-[#1F1B16] -mr-[0.26em]">BALZAC</p>
            <p className="text-[9px] tracking-[0.4em] text-[#8A7A5C] -mr-[0.4em]">ADMIN</p>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden text-[12px] tracking-[0.06em] text-[#6B6154] sm:inline">{email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="border border-[#D8CFBB] bg-white px-4 py-2 text-[10px] tracking-[0.24em] uppercase text-[#1F1B16] transition-colors hover:border-[#B99A5B]"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-serif text-[26px] text-[#1F1B16]">Dashboard</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6B6154]">
          Welcome. Catalogue management tools will appear here as they are completed.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <div key={s.title} className="border border-[#E4DCCB] bg-white/70 p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[17px] text-[#1F1B16]">{s.title}</h2>
                <span className="text-[9px] tracking-[0.22em] uppercase text-[#B99A5B]">{s.status}</span>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#6B6154]">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
