"use client";

// Site-wide user preferences: locale (EN/FR) + display currency (EUR/USD/CHF).
// Persisted to localStorage; initial server render is EN/EUR and hydrates to
// the stored choice. EUR is the SETTLEMENT currency — USD/CHF are display
// conversions at indicative rates. Replace RATES with admin-managed or live
// FX before any non-EUR amount is ever shown at a checkout step.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { dict, type Locale } from "@/lib/i18n";

export type Currency = "EUR" | "USD" | "CHF";
export const CURRENCIES: Currency[] = ["EUR", "USD", "CHF"];

const RATES: Record<Currency, number> = { EUR: 1, USD: 1.08, CHF: 0.93 };

type Prefs = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  t: (key: string) => string;
};

const Ctx = createContext<Prefs>({
  locale: "en",
  setLocale: () => {},
  currency: "EUR",
  setCurrency: () => {},
  t: (k) => dict.en[k] ?? k,
});

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [currency, setCurrencyState] = useState<Currency>("EUR");

  useEffect(() => {
    const l = window.localStorage.getItem("balzac-locale");
    if (l === "fr" || l === "en") setLocaleState(l);
    const c = window.localStorage.getItem("balzac-currency");
    if (c === "USD" || c === "CHF" || c === "EUR") setCurrencyState(c);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    window.localStorage.setItem("balzac-locale", l);
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    window.localStorage.setItem("balzac-currency", c);
  }, []);

  const t = useCallback(
    (key: string) => dict[locale][key] ?? dict.en[key] ?? key,
    [locale]
  );

  return (
    <Ctx.Provider value={{ locale, setLocale, currency, setCurrency, t }}>
      {children}
    </Ctx.Provider>
  );
}

export const usePrefs = () => useContext(Ctx);

// Inline translated string — usable inside server components.
// Optional c replaces "{c}" (e.g. category names in empty states).
export function T({ k, c }: { k: string; c?: string }) {
  const { t } = usePrefs();
  const s = t(k);
  return <>{c ? s.replace("{c}", c) : s}</>;
}

// Bilingual DATA field (product titles, descriptions, specs from the admin
// panel). Shows the French value when the visitor chose FR and the client has
// filled it in; falls back to English otherwise — per the schema contract.
export function Bi({ en, fr }: { en: string; fr?: string | null }) {
  const { locale } = usePrefs();
  return <>{locale === "fr" && fr ? fr : en}</>;
}

// Price display in the visitor's chosen currency. EUR shows exact (with cents
// when priced that way); USD/CHF are indicative conversions rounded to whole
// units — cents on a converted estimate would imply false precision.
export function Price({ eur, className }: { eur: number; className?: string }) {
  const { currency } = usePrefs();
  const localeFor: Record<Currency, string> = {
    EUR: "en-IE",
    USD: "en-US",
    CHF: "de-CH",
  };
  const hasCents = currency === "EUR" && eur % 1 !== 0;
  const value = currency === "EUR" ? eur : Math.round(eur * RATES[currency]);
  const formatted = new Intl.NumberFormat(localeFor[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(value);
  return <span className={className}>{formatted}</span>;
}
