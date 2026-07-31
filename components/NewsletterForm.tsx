"use client";

import { useState } from "react";
import { usePrefs } from "@/components/Prefs";
import { subscribeNewsletter } from "@/lib/message-actions";

export default function NewsletterForm() {
  const { t } = usePrefs();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (state === "done") {
    return <p className="mt-4 text-[13px] leading-relaxed text-gold-dark">{t("footer.newsThanks")}</p>;
  }

  return (
    <>
      <form
        className="mt-4 flex border-b border-ink/30 pb-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setState("sending");
          try {
            const res = await subscribeNewsletter(email);
            setState(res.ok ? "done" : "error");
          } catch {
            setState("error");
          }
        }}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("footer.email")}
          className="w-full bg-transparent text-[13px] text-ink placeholder:text-ink/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          aria-label={t("footer.join")}
          className="shrink-0 text-[12px] tracking-[0.14em] uppercase text-gold transition-colors hover:text-gold-dark disabled:opacity-50"
        >
          {t("footer.join")} &rarr;
        </button>
      </form>
      {state === "error" ? (
        <p className="mt-2 text-[12px] text-[#8A3C3C]">{t("footer.newsErr")}</p>
      ) : null}
    </>
  );
}
