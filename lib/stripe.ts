// Stripe server client.
//
// Deliberately lazy and fail-soft, mirroring lib/email.ts: if STRIPE_SECRET_KEY
// is absent the site keeps the reserve-and-invoice checkout exactly as it works
// today. Nothing breaks before the keys exist, and nothing breaks if they are
// later removed. The key is read on every call so a pm2 restart with a new .env
// takes effect without a code change.

import Stripe from "stripe";

let client: Stripe | null = null;
let clientKey = "";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client || clientKey !== key) {
    // No apiVersion pin: the SDK sends its own default, which is the version
    // its TypeScript types were generated against.
    client = new Stripe(key);
    clientKey = key;
  }
  return client;
}

export function stripeEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// True while the site is wired to TEST keys. The checkout and confirmation
// pages say so plainly, so a test deployment can never be mistaken for a live
// one and live buyers are never silently unable to pay.
export function stripeTestMode(): boolean {
  return (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_");
}

// Absolute base for Stripe return URLs. Stripe requires absolute URLs and the
// server action has no reliable origin behind the nginx proxy, so this is an
// explicit setting with the production domain as the fallback.
export function siteUrl(): string {
  return (process.env.SITE_URL || "https://balzacantiques.ch").replace(/\/+$/, "");
}
