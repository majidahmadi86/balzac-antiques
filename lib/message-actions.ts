"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";

// Contact, acquisition and newsletter submissions. Everything is stored in the
// database and read from the admin Messages panel, so nothing is lost while an
// email service is still being chosen. Email notification can be layered on
// later without changing any of this.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim() : "";
}

// Honeypot: a field hidden from real visitors. Bots fill it in, so when it has
// a value we show the normal thank-you and store nothing.
function isBot(fd: FormData): boolean {
  return field(fd, "company") !== "";
}

export async function submitContact(formData: FormData): Promise<void> {
  if (isBot(formData)) redirect("/contact?sent=1");

  const name = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const body = field(formData, "body");

  if (name.length < 1 || name.length > 120) redirect("/contact?err=1");
  if (!EMAIL_RE.test(email) || email.length > 254) redirect("/contact?err=1");
  if (body.length < 1 || body.length > 5000) redirect("/contact?err=1");

  await db.message.create({ data: { kind: "contact", name, email, body } });
  redirect("/contact?sent=1");
}

export async function submitSell(formData: FormData): Promise<void> {
  if (isBot(formData)) redirect("/sell?sent=1");

  const name = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const phone = field(formData, "phone");
  const body = field(formData, "body");

  if (name.length < 1 || name.length > 120) redirect("/sell?err=1");
  if (!EMAIL_RE.test(email) || email.length > 254) redirect("/sell?err=1");
  if (phone.length > 40) redirect("/sell?err=1");
  if (body.length < 1 || body.length > 5000) redirect("/sell?err=1");

  await db.message.create({
    data: { kind: "sell", name, email, phone: phone === "" ? null : phone, body },
  });
  redirect("/sell?sent=1");
}

// Called directly from the footer form (a client component), so it returns a
// result instead of redirecting.
export async function subscribeNewsletter(rawEmail: string): Promise<{ ok: boolean }> {
  const email = rawEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return { ok: false };

  const existing = await db.message.findFirst({
    where: { kind: "newsletter", email },
    select: { id: true },
  });
  if (!existing) await db.message.create({ data: { kind: "newsletter", email } });
  return { ok: true };
}
