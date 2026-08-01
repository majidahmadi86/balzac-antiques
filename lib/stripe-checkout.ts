// Builds a Stripe Checkout session for an order that ALREADY exists.
//
// The order is written and the pieces are reserved before this runs, so a
// Stripe outage can never lose a sale: the buyer simply lands on the normal
// confirmation page and the gallery invoices them, which is the behaviour the
// site had before Stripe was wired in.
//
// Prices come from the order rows (which the checkout action wrote from the
// database), never from the browser. Shipping is already collected by our own
// form, so Stripe is asked only for payment.

import { db } from "@/lib/db";
import { getStripe, siteUrl } from "@/lib/stripe";

type OrderItemRow = { titleEn: string; priceEur: unknown };

export async function createPaymentSession(orderId: string): Promise<string | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const order = await db.order.findUnique({
    where: { id: orderId },
    select: {
      id: true,
      status: true,
      customer: { select: { email: true } },
      items: { select: { titleEn: true, priceEur: true } },
    },
  });
  if (!order || order.status !== "pending" || order.items.length === 0) return null;

  const reference = order.id.slice(-8).toUpperCase();
  const base = siteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: order.id,
    customer_email: order.customer.email,
    line_items: order.items.map((i: OrderItemRow) => ({
      quantity: 1,
      price_data: {
        currency: "eur",
        // Stripe works in minor units. Prices are Decimal(10,2) in MySQL, so
        // the string round-trip avoids any float drift before rounding.
        unit_amount: Math.round(Number(String(i.priceEur)) * 100),
        product_data: { name: i.titleEn },
      },
    })),
    // metadata is what the webhook trusts; client_reference_id is a readable
    // duplicate for the Stripe dashboard.
    metadata: { orderId: order.id, reference },
    payment_intent_data: {
      description: `Balzac Antiques order ${reference}`,
      metadata: { orderId: order.id },
    },
    success_url: `${base}/checkout/confirmation/${order.id}?paid=1`,
    cancel_url: `${base}/checkout/confirmation/${order.id}?cancelled=1`,
  });

  if (!session.url) return null;

  await db.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
  return session.url;
}
