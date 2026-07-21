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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Errors come back as a code in the query string and are rendered through the
// i18n dictionary on the page, so both languages stay in one place.
function fail(code: string): never {
  redirect(`/register?err=${code}`);
}

export async function register(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (name.length < 1 || name.length > 120) fail("name");
  if (!EMAIL_RE.test(email) || email.length > 254) fail("email");
  if (password.length < 8 || password.length > 200) fail("password");

  const passwordHash = await bcrypt.hash(password, 12);

  let customer;
  try {
    customer = await db.customer.create({
      data: { name, email, passwordHash },
      select: { id: true, email: true },
    });
  } catch (e: unknown) {
    // Prisma P2002 = unique constraint (email already registered).
    if (e && typeof e === "object" && "code" in e && (e as { code?: string }).code === "P2002") {
      fail("taken");
    }
    throw e;
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

  redirect("/account");
}
