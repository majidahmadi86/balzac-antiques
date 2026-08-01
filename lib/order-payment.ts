// Order settlement, shared by the Stripe webhook and the confirmation page.
//
// Every transition is IDEMPOTENT: it only fires while the order is still
// "pending", so a webhook retry, a duplicate Stripe event, the buyer
// refreshing the confirmation page, and the admin clicking Mark as paid all
// converge on the same result instead of double-selling a piece.
//
// The side effects are identical to app/admin/orders/actions.ts on purpose:
// an order paid by card and an order paid by invoice must leave the database
// in exactly the same state.

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";

type ItemRow = { productId: string | null };

// settleOrderPaid is also called while the confirmation PAGE renders (the
// safety net for a webhook that has not arrived yet). Cache revalidation is
// not supported during render, so it is wrapped: the database transition is
// what matters, and the webhook revalidates properly a moment later.
function safeRevalidate(): void {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/admin/orders");
  } catch {
    // render-time call, ignore
  }
}

export async function settleOrderPaid(orderId: string, sessionId?: string): Promise<boolean> {
  const changed: boolean = await db.$transaction(async (tx: any) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { status: true, items: { select: { productId: true } } },
    });
    if (!order || order.status !== "pending") return false;

    await tx.order.update({
      where: { id: orderId },
      data: sessionId ? { status: "paid", stripeSessionId: sessionId } : { status: "paid" },
    });

    const productIds: string[] = order.items
      .map((i: ItemRow) => i.productId)
      .filter((p: string | null): p is string => p !== null);
    if (productIds.length > 0) {
      await tx.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: "sold", soldAt: new Date() },
      });
    }
    return true;
  });

  if (changed) safeRevalidate(); // pieces show Sold immediately
  return changed;
}

// A Stripe Checkout session expires unpaid (24h by default). The piece goes
// back on the floor rather than sitting reserved forever.
//
// The sessionId guard matters: if the buyer came back and started a NEW
// payment session, the OLD session still expires later, and releasing then
// would cancel an order that is actively being paid. So the release only runs
// when the expiring session is still the order's current one.
export async function releaseOrderUnpaid(orderId: string, sessionId: string): Promise<boolean> {
  const changed: boolean = await db.$transaction(async (tx: any) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      select: { status: true, stripeSessionId: true, items: { select: { productId: true } } },
    });
    if (!order || order.status !== "pending") return false;
    if (order.stripeSessionId && order.stripeSessionId !== sessionId) return false;

    await tx.order.update({ where: { id: orderId }, data: { status: "cancelled" } });

    const productIds: string[] = order.items
      .map((i: ItemRow) => i.productId)
      .filter((p: string | null): p is string => p !== null);
    if (productIds.length > 0) {
      await tx.product.updateMany({
        where: { id: { in: productIds } },
        data: { status: "available", soldAt: null },
      });
    }
    return true;
  });

  if (changed) safeRevalidate();
  return changed;
}
