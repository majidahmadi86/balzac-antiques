import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/session";
import AdminHeader from "@/components/admin/AdminHeader";
import { changePassword } from "./actions";

export const metadata: Metadata = {
  title: "Account · Balzac Antiques Admin",
  robots: { index: false, follow: false },
};

// Session-dependent: render per request, never statically cache.
export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  current: "Your current password is not correct.",
  short: "The new password must be at least 10 characters.",
  match: "The new password and its confirmation do not match.",
  same: "The new password must be different from your current one.",
};

export default async function AdminAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  const email = session?.email ?? "";
  const errorMsg = sp?.error && sp.error in ERRORS ? ERRORS[sp.error] : null;

  const inputCls =
    "w-full border border-[#D8CFBB] bg-white px-4 py-3 text-[15px] text-[#1F1B16] outline-none transition-colors focus:border-[#B99A5B]";
  const labelCls = "mb-2 block text-[10px] tracking-[0.24em] uppercase text-[#6B6154]";

  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <AdminHeader email={email} />

      <div className="mx-auto max-w-lg px-6 py-12">
        <h1 className="font-serif text-[26px] text-[#1F1B16]">Account</h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6B6154]">
          Change the password for {email || "your admin account"}.
        </p>

        {sp?.updated === "1" ? (
          <p className="mt-6 border border-[#5B7A5B]/40 bg-[#EAF0E6] px-4 py-3 text-[13px] text-[#3E5A3E]">
            Your password has been updated.
          </p>
        ) : null}
        {errorMsg ? (
          <p className="mt-6 border border-[#C08A6A]/40 bg-[#FBF4EF] px-4 py-3 text-[13px] text-[#8A5A3C]">{errorMsg}</p>
        ) : null}

        <form action={changePassword} className="mt-8 border border-[#E4DCCB] bg-white/70 px-7 py-8">
          <label className="block">
            <span className={labelCls}>Current password</span>
            <input type="password" name="current" required autoComplete="current-password" className={inputCls} />
          </label>
          <label className="mt-5 block">
            <span className={labelCls}>New password</span>
            <input type="password" name="newPassword" required minLength={10} autoComplete="new-password" className={inputCls} />
            <span className="mt-1.5 block text-[11px] text-[#9A8F7D]">At least 10 characters.</span>
          </label>
          <label className="mt-5 block">
            <span className={labelCls}>Confirm new password</span>
            <input type="password" name="confirm" required minLength={10} autoComplete="new-password" className={inputCls} />
          </label>
          <button
            type="submit"
            className="mt-8 w-full bg-[#1F1B16] px-4 py-3.5 text-[11px] tracking-[0.28em] uppercase text-[#F7F3EA] transition-colors hover:bg-[#3A322A]"
          >
            Update Password
          </button>
        </form>
      </div>
    </main>
  );
}
