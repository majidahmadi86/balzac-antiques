// Stripe webhook endpoint: POST https://balzacantiques.ch/api/stripe/webhook
//
// This is the authoritative record of payment. The buyer's browser returning
// to the confirmation page is a convenience; this runs even if they close the
// tab the instant they pay.
//
// Security: the raw request body is verified against the STRIPE_WEBHOOK_SECRET
// signature before a single byte of it is trusted. An unsigned or mis-signed
// request is rejected with 400 and does nothing.

import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { settleOrderPaid, releaseOrderUnpaid } from "@/lib/order-payment";

export const runtime = "nodejs"; // signature verification needs the Node crypto path
export const dynamic = "force-dynamic";

function orderIdOf(session: Stripe.Checkout.Session): string {
  return session.metadata?.orderId || session.client_reference_id || "";
}

export async function POST(req: Request): Promise<NextResponse> {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return new NextResponse("stripe not configured", { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("missing signature", { status: 400 });

  // Must be the RAW body. Parsing it first would break the signature.
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, signature, secret);
  } catch {
    return new NextResponse("invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const id = orderIdOf(session);
        // Card payments come back paid immediately. Delayed methods arrive as
        // "unpaid" here and settle later via async_payment_succeeded, so the
        // piece is not marked sold before the money is real.
        if (id && session.payment_status === "paid") {
          await settleOrderPaid(id, session.id);
        }
        break;
      }
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        const id = orderIdOf(session);
        if (id) await settleOrderPaid(id, session.id);
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const id = orderIdOf(session);
        if (id) await releaseOrderUnpaid(id, session.id);
        break;
      }
      default:
        break; // everything else is acknowledged and ignored
    }
  } catch {
    // Tell Stripe to retry rather than silently dropping a real payment.
    return new NextResponse("handler error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
