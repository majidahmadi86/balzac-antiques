"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "../../../lib/db";
import { ADMIN_COOKIE, SESSION_TTL_SECONDS, createSessionToken } from "../../../lib/session";

// Real bcrypt hash of a random throwaway string. When the email doesn't exist we
// still run a full bcrypt.compare against this, so "unknown email" and "wrong
// password" take the same time (no account enumeration via timing).
const DUMMY_HASH = "$2b$12$9vu/OkhuTl1Bh7KNHERUAuW5nw3Ac1Sdlzm8dXO.mjA0DS12jl/ku";

function safeNext(raw: FormDataEntryValue | null): string {
  const next = typeof raw === "string" ? raw : "";
  // Only allow internal admin paths; blocks open redirects like //evil.com
  return next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export async function login(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const admin =
    email.length > 0 && email.length <= 254
      ? await db.adminUser.findUnique({ where: { email } })
      : null;

  const passwordOk = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH);

  if (!admin || !passwordOk) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await createSessionToken({ id: admin.id, email: admin.email });
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  redirect(next);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  redirect("/admin/login");
}
