import type { Metadata } from "next";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Admin Sign In · Balzac Antiques",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const hasError = sp?.error === "1";
  const next = typeof sp?.next === "string" ? sp.next : "/admin";

  return (
    <main className="min-h-screen bg-[#F7F3EA] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-serif text-[28px] tracking-[0.3em] text-[#1F1B16] -mr-[0.3em]">BALZAC</p>
          <p className="mt-1 text-[10px] tracking-[0.45em] text-[#8A7A5C] -mr-[0.45em]">ANTIQUES</p>
          <div className="mx-auto mt-6 h-px w-10 bg-gradient-to-r from-transparent via-[#B99A5B] to-transparent" />
          <p className="mt-5 text-[11px] tracking-[0.28em] uppercase text-[#6B6154]">Private Administration</p>
        </div>

        <form action={login} className="bg-white/70 border border-[#E4DCCB] px-8 py-9 shadow-[0_1px_2px_rgba(31,27,22,0.04),0_12px_32px_rgba(31,27,22,0.06)]">
          <input type="hidden" name="next" value={next} />

          {hasError && (
            <p
              role="alert"
              className="mb-6 border border-[#C9A35C]/40 bg-[#F4E9D4] px-4 py-3 text-[13px] leading-relaxed text-[#6B5326]"
            >
              Incorrect email or password. Please try again.
            </p>
          )}

          <label className="block">
            <span className="block text-[10px] tracking-[0.24em] uppercase text-[#6B6154] mb-2">Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              autoFocus
              className="w-full border border-[#D8CFBB] bg-white px-4 py-3 text-[15px] text-[#1F1B16] outline-none transition-colors focus:border-[#B99A5B]"
            />
          </label>

          <label className="mt-5 block">
            <span className="block text-[10px] tracking-[0.24em] uppercase text-[#6B6154] mb-2">Password</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full border border-[#D8CFBB] bg-white px-4 py-3 text-[15px] text-[#1F1B16] outline-none transition-colors focus:border-[#B99A5B]"
            />
          </label>

          <button
            type="submit"
            className="mt-8 w-full bg-[#1F1B16] px-4 py-3.5 text-[11px] tracking-[0.28em] uppercase text-[#F7F3EA] transition-colors hover:bg-[#3A322A]"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] tracking-[0.18em] text-[#9A8F7D]">
          Balzac Antiques · Administration
        </p>
      </div>
    </main>
  );
}
