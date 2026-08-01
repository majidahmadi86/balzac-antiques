"use server";

// Lets a buyer who abandoned or failed the card step pay for an order that is
// already placed. The piece stays reserved for them in the meantime, so this
// is a retry rather than a new purchase.

import { redirect } from "next/navigation";
import { createPaymentSession } from "@/lib/stripe-checkout";

export async function resumePayment(formData: FormData): Promise<void> {
  const id = String(formData.get("orderId") ?? "");
  if (!id) redirect("/collection");

  let url: string | null = null;
  try {
    url = await createPaymentSession(id);
  } catch {
    url = null; // fall through to the confirmation page rather than erroring
  }

  redirect(url ?? `/checkout/confirmation/${id}?payerr=1`);
}
