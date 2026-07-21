import type { Metadata } from "next";
import Link from "next/link";
import { login } from "./actions";
import { T } from "@/components/Prefs";

export const metadata: Metadata = {
  title: "Sign In · Balzac Antiques",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const sp = await searchParams;
  const hasError = sp?.error === "1";
  const next = typeof sp?.next === "string" && sp.next.startsWith("/") ? sp.next : "/account";

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mx-auto flex w-max flex-col items-center leading-none">
          <span className="-mr-[0.3em] font-display text-[28px] tracking-[0.3em] text-ink">BALZAC</span>
          <span className="mt-1.5 flex w-full items-center text-[10.5px] tracking-[0.45em] text-gold">
            <span className="h-px flex-1 bg-gold/60" />
            <span className="mx-2 translate-x-[0.225em]">ANTIQUES</span>
            <span className="h-px flex-1 bg-gold/60" />
          </span>
        </Link>

        <div className="mx-auto mt-8 h-px w-10 bg-gradient-to-r from-transparent via-gold to-transparent" />
        <h1 className="mt-6 text-center font-display text-[24px] text-ink">
          <T k="auth.loginTitle" />
        </h1>
        <p className="mt-2 text-center text-[13px] leading-relaxed text-ink/65">
          <T k="auth.loginSubtitle" />
        </p>

        <form action={login} className="mt-8 border border-hairline bg-parchment px-8 py-9">
          <input type="hidden" name="next" value={next} />

          {hasError ? (
            <p role="alert" className="mb-6 border border-gold/40 bg-[#F4E9D4] px-4 py-3 text-[13px] leading-relaxed text-[#6B5326]">
              <T k="auth.loginError" />
            </p>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-ink/60"><T k="auth.email" /></span>
            <input type="email" name="email" required autoComplete="username" autoFocus
              className="w-full border border-hairline bg-cream px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-gold" />
          </label>

          <label className="mt-5 block">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-ink/60"><T k="auth.password" /></span>
            <input type="password" name="password" required autoComplete="current-password"
              className="w-full border border-hairline bg-cream px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-gold" />
          </label>

          <button type="submit"
            className="mt-8 w-full bg-ink px-4 py-3.5 text-[11px] uppercase tracking-[0.28em] text-cream transition-colors hover:bg-gold-dark">
            <T k="auth.signInCta" />
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] text-ink/65">
          <T k="auth.noAccount" />{" "}
          <Link href="/register" className="text-gold-dark underline-offset-4 hover:underline">
            <T k="auth.createOne" />
          </Link>
        </p>
      </div>
    </main>
  );
}
