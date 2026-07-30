"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/session";

// Order lifecycle, driven by the admin:
//   pending  -> paid | cancelled
//   paid     -> shipped | cancelled
//   shipped  -> delivered
// Side effects run in the SAME transaction as the status change:
//   paid      -> every piece in the order becomes "sold" (soldAt stamped)
//   cancelled -> every piece is released back to "available" (soldAt cleared)
const TRANSITIONS: Record<string, string[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: ["delivered"],
};

export async function setOrderStatus(formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const next = String(formData.get("next") ?? "");
  if (!id || !next) redirect("/admin/orders");

  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id },
      select: { status: true, items: { select: { productId: true } } },
    });
    if (!order) return;
    if (!(TRANSITIONS[order.status] ?? []).includes(next)) return;

    await tx.order.update({ where: { id }, data: { status: next } });

    const productIds = order.items
      .map((i: { productId: string | null }) => i.productId)
      .filter((p: string | null): p is string => p !== null);
    if (productIds.length > 0) {
      if (next === "paid") {
        await tx.product.updateMany({
          where: { id: { in: productIds } },
          data: { status: "sold", soldAt: new Date() },
        });
      } else if (next === "cancelled") {
        await tx.product.updateMany({
          where: { id: { in: productIds } },
          data: { status: "available", soldAt: null },
        });
      }
    }
  });

  revalidatePath("/", "layout"); // public site shows Sold / released pieces immediately
  revalidatePath("/admin/orders");
  redirect(`/admin/orders/${id}`);
}
