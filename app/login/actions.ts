"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  CUSTOMER_COOKIE,
  CUSTOMER_SESSION_TTL_SECONDS,
  createCustomerSessionToken,
} from "@/lib/customer-session";

// Same technique as the admin login: a real bcrypt hash of a throwaway string,
// compared against when the email is unknown, so "no such account" and "wrong
// password" take the same time and cannot be told apart by an attacker.
const DUMMY_HASH = "$2b$12$9vu/OkhuTl1Bh7KNHERUAuW5nw3Ac1Sdlzm8dXO.mjA0DS12jl/ku";

function safeNext(raw: FormDataEntryValue | null): string {
  const next = typeof raw === "string" ? raw : "";
  // Only allow internal paths, never an off-site redirect.
  return next.startsWith("/") && !next.startsWith("//") ? next : "/account";
}

export async function login(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  const customer =
    email.length > 0 && email.length <= 254
      ? await db.customer.findUnique({ where: { email } })
      : null;

  const passwordOk = await bcrypt.compare(password, customer?.passwordHash ?? DUMMY_HASH);

  if (!customer || !passwordOk) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await createCustomerSessionToken({ id: customer.id, email: customer.email });
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CUSTOMER_SESSION_TTL_SECONDS,
  });

  redirect(next);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  redirect("/");
}
