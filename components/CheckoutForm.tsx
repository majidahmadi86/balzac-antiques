"use client";

// The checkout form. Cart contents live client-side, so this component reads
// them from the CartProvider and submits the slugs; the server re-prices and
// re-checks everything, trusting nothing from the client but the selection.
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/Cart";
import { usePrefs, Bi, Price } from "@/components/Prefs";
import AddressFields from "@/components/account/AddressFields";
import { placeOrder } from "@/app/checkout/actions";

export type SavedAddress = {
  id: number;
  line1: string;
  line2: string | null;
  city: string;
  postcode: string;
  country: string;
  isDefault: boolean;
};

export default function CheckoutForm({
  customer,
  addresses,
  err,
  errPiece,
}: {
  customer: { name: string; email: string } | null;
  addresses: SavedAddress[];
  err?: string;
  errPiece?: string;
}) {
  const { items, count, ready, remove } = useCart();
  const { t } = usePrefs();
  const defaultChoice = addresses.length > 0 ? String(addresses.find((a) => a.isDefault)?.id ?? addresses[0].id) : "new";
  const [addrChoice, setAddrChoice] = useState<string>(defaultChoice);

  if (!ready) return null;

  if (count === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="font-display text-[28px] text-ink">{t("checkout.title")}</h1>
        <div className="mx-auto mt-4 h-px w-10 bg-gold" />
        <p className="mt-6 text-[15px] text-ink/70">{t("cart.empty")}</p>
        <Link href="/collection" className="mt-6 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] text-gold-dark hover:text-gold">
          {t("cart.browse")} <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.priceEur, 0);
  const unavailable = err === "unavailable" ? items.find((i) => i.slug === errPiece) : undefined;

  const inputCls =
    "w-full border border-hairline bg-cream px-4 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-gold";
  const labelCls = "mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-ink/60";
  const alertCls = "mt-5 border border-gold/40 bg-[#F4E9D4] px-4 py-3 text-[13px] leading-relaxed text-[#6B5326]";

  return (
    <div>
      <h1 className="font-display text-[30px] text-ink">{t("checkout.title")}</h1>
      <div className="mt-3 h-px w-10 bg-gold" />

      {err === "unavailable" ? (
        <div className={alertCls} role="alert">
          <p>
            {t("checkout.errUnavailable")}
            {unavailable ? <> <strong><Bi en={unavailable.titleEn} fr={unavailable.titleFr} /></strong></> : null}
          </p>
          {unavailable ? (
            <button type="button" onClick={() => remove(unavailable.slug)} className="mt-2 text-[11px] uppercase tracking-[0.16em] underline underline-offset-4">
              {t("checkout.removeAndContinue")}
            </button>
          ) : null}
        </div>
      ) : null}
      {err === "email" ? (
        <p className={alertCls} role="alert">
          {t("checkout.errEmail")}{" "}
          <Link href="/login?next=/checkout" className="underline underline-offset-4">{t("auth.signInLink")}</Link>
        </p>
      ) : null}
      {err === "fields" ? <p className={alertCls} role="alert">{t("addr.err")}</p> : null}
      {err === "password" ? <p className={alertCls} role="alert">{t("auth.errPassword")}</p> : null}

      <form action={placeOrder} className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <input type="hidden" name="slugs" value={JSON.stringify(items.map((i) => i.slug))} />

        <div>
          {/* ------------------------------------------------ details ---- */}
          <h2 className="font-display text-[19px] text-ink">{t("checkout.yourDetails")}</h2>
          <div className="mt-4 grid gap-4">
            {customer ? (
              <p className="border border-hairline bg-parchment px-4 py-3 text-[14px] text-ink">
                {customer.name} <span className="text-ink/55">· {customer.email}</span>
              </p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={labelCls}>{t("auth.name")}</span>
                    <input name="name" required maxLength={120} autoComplete="name" className={inputCls} />
                  </label>
                  <label className="block">
                    <span className={labelCls}>{t("auth.email")}</span>
                    <input type="email" name="email" required maxLength={254} autoComplete="email" className={inputCls} />
                  </label>
                </div>
              </>
            )}
            <label className="block sm:max-w-[calc(50%-0.5rem)]">
              <span className={labelCls}>{t("checkout.phone")}</span>
              <input name="phone" maxLength={40} autoComplete="tel" className={inputCls} />
            </label>
          </div>

          {/* ------------------------------------------------ address ---- */}
          <h2 className="mt-9 font-display text-[19px] text-ink">{t("checkout.shippingAddress")}</h2>
          {customer && addresses.length > 0 ? (
            <div className="mt-4 grid gap-3">
              {addresses.map((a) => (
                <label key={a.id} className={`flex cursor-pointer items-start gap-3 border px-4 py-3 text-[14px] transition-colors ${addrChoice === String(a.id) ? "border-gold bg-parchment" : "border-hairline bg-cream"}`}>
                  <input
                    type="radio"
                    name="addressId"
                    value={a.id}
                    checked={addrChoice === String(a.id)}
                    onChange={() => setAddrChoice(String(a.id))}
                    className="mt-1 accent-[#B99A5B]"
                  />
                  <span className="leading-relaxed text-ink">
                    {a.line1}{a.line2 ? <>, {a.line2}</> : null}, {a.postcode} {a.city}, {a.country}
                    {a.isDefault ? <span className="ml-2 text-[9px] uppercase tracking-[0.18em] text-gold-dark">{t("addr.default")}</span> : null}
                  </span>
                </label>
              ))}
              <label className={`flex cursor-pointer items-center gap-3 border px-4 py-3 text-[14px] transition-colors ${addrChoice === "new" ? "border-gold bg-parchment" : "border-hairline bg-cream"}`}>
                <input
                  type="radio"
                  name="addressId"
                  value="new"
                  checked={addrChoice === "new"}
                  onChange={() => setAddrChoice("new")}
                  className="accent-[#B99A5B]"
                />
                <span className="text-ink">{t("checkout.useDifferent")}</span>
              </label>
              {addrChoice === "new" ? (
                <div className="mt-2">
                  <AddressFields />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-4">
              <AddressFields />
            </div>
          )}

          {/* ---------------------------------------- optional account --- */}
          {!customer ? (
            <div className="mt-9">
              <h2 className="font-display text-[19px] text-ink">{t("checkout.passwordTitle")}</h2>
              <label className="mt-4 block sm:max-w-[calc(50%-0.5rem)]">
                <span className={labelCls}>{t("auth.password")}</span>
                <input type="password" name="password" minLength={8} autoComplete="new-password" className={inputCls} />
                <span className="mt-1.5 block text-[11px] text-ink/50">{t("checkout.passwordHint")}</span>
              </label>
            </div>
          ) : null}
        </div>

        {/* -------------------------------------------------- summary ---- */}
        <aside className="h-max border border-hairline bg-parchment p-6">
          <h2 className="font-display text-[18px] text-ink">{t("checkout.summary")}</h2>
          <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
            {items.map((i) => (
              <li key={i.slug} className="flex items-center gap-3 py-3">
                <span className="relative h-14 w-11 shrink-0 overflow-hidden bg-cream">
                  {i.image ? (
                    <Image src={i.image} alt={i.titleEn} fill sizes="44px" className="object-cover" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1 text-[13px] leading-snug text-ink">
                  <Bi en={i.titleEn} fr={i.titleFr} />
                </span>
                <span className="text-[13px] text-ink"><Price eur={i.priceEur} /></span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-[0.18em] text-ink/70">{t("cart.subtotal")}</span>
            <span className="font-display text-[20px] text-ink"><Price eur={subtotal} /></span>
          </div>
          <p className="mt-3 text-[12px] leading-relaxed text-ink/60">{t("checkout.reserveNote")}</p>
          <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 bg-gold py-3.5 text-[12px] uppercase tracking-[0.2em] text-cream transition-colors hover:bg-gold-dark">
            {t("checkout.placeOrder")} <span aria-hidden>&rarr;</span>
          </button>
        </aside>
      </form>
    </div>
  );
}
