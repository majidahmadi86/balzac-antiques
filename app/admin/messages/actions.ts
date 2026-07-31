"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/session";

// Mark an enquiry as dealt with (or reopen it). Handled items drop to the
// bottom of the list so the inbox always shows what still needs a reply.
export async function setMessageHandled(formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const handled = String(formData.get("handled") ?? "") === "true";
  if (id) await db.message.update({ where: { id }, data: { handled } });

  revalidatePath("/admin/messages");
  redirect("/admin/messages");
}
