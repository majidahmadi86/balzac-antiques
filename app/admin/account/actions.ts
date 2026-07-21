"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/session";

// Change the signed-in admin's own password. The current password is required,
// so a walk-up session cannot silently change it. Mirrors create-admin.mjs:
// bcryptjs, cost 12, minimum length 10.
export async function changePassword(formData: FormData): Promise<void> {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) redirect("/admin/login");

  const current = String(formData.get("current") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const admin = await db.adminUser.findUnique({ where: { id: session.sub } });
  if (!admin) redirect("/admin/login");

  const currentOk = await bcrypt.compare(current, admin.passwordHash);
  if (!currentOk) redirect("/admin/account?error=current");
  if (newPassword.length < 10 || newPassword.length > 200) redirect("/admin/account?error=short");
  if (newPassword !== confirm) redirect("/admin/account?error=match");
  if (newPassword === current) redirect("/admin/account?error=same");

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db.adminUser.update({ where: { id: admin.id }, data: { passwordHash } });

  redirect("/admin/account?updated=1");
}
