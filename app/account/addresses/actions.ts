"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { CUSTOMER_COOKIE, verifyCustomerSessionToken } from "@/lib/customer-session";
import { COUNTRIES } from "@/lib/countries";

const COUNTRY_SET = new Set(COUNTRIES.map((c) => c.name));

// Every action resolves the customer from their OWN session cookie, and every
// write is scoped to that customerId. An address id from the form is never
// trusted on its own, so one customer can never read or change another's.
async function requireCustomerId(): Promise<string> {
  const c = await cookies();
  const s = await verifyCustomerSessionToken(c.get(CUSTOMER_COOKIE)?.value);
  if (!s) redirect("/login?next=/account/addresses");
  return s.sub;
}

function field(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim() : "";
}

type ParsedAddress =
  | { error: true }
  | {
      error: false;
      data: { line1: string; line2: string | null; city: string; postcode: string; country: string };
      makeDefault: boolean;
    };

function parseAddress(fd: FormData): ParsedAddress {
  const line1 = field(fd, "line1");
  const line2 = field(fd, "line2");
  const city = field(fd, "city");
  const postcode = field(fd, "postcode");
  const country = field(fd, "country");
  if (!line1 || !city || !postcode || !country) return { error: true };
  if (line1.length > 200 || line2.length > 200 || city.length > 120 || postcode.length > 40) return { error: true };
  if (!COUNTRY_SET.has(country)) return { error: true };
  return {
    error: false,
    data: { line1, line2: line2 === "" ? null : line2, city, postcode, country },
    makeDefault: fd.get("makeDefault") === "on",
  };
}

function toId(fd: FormData): number | null {
  const n = Number.parseInt(field(fd, "id"), 10);
  return Number.isInteger(n) ? n : null;
}

export async function createAddress(formData: FormData): Promise<void> {
  const customerId = await requireCustomerId();
  const parsed = parseAddress(formData);
  if (parsed.error) redirect("/account/addresses?err=fields");

  const existing = await db.address.count({ where: { customerId } });
  const makeDefault = parsed.makeDefault || existing === 0; // first address becomes the default

  if (makeDefault) {
    await db.$transaction([
      db.address.updateMany({ where: { customerId }, data: { isDefault: false } }),
      db.address.create({ data: { ...parsed.data, customerId, isDefault: true } }),
    ]);
  } else {
    await db.address.create({ data: { ...parsed.data, customerId, isDefault: false } });
  }
  redirect("/account/addresses?saved=1");
}

export async function updateAddress(formData: FormData): Promise<void> {
  const customerId = await requireCustomerId();
  const id = toId(formData);
  if (id === null) redirect("/account/addresses");

  // Ownership gate: matches only if this address belongs to this customer.
  const owned = await db.address.findFirst({ where: { id, customerId }, select: { id: true } });
  if (!owned) redirect("/account/addresses");

  const parsed = parseAddress(formData);
  if (parsed.error) redirect(`/account/addresses/${id}?err=fields`);

  if (parsed.makeDefault) {
    await db.$transaction([
      db.address.updateMany({ where: { customerId }, data: { isDefault: false } }),
      db.address.update({ where: { id }, data: { ...parsed.data, isDefault: true } }),
    ]);
  } else {
    await db.address.update({ where: { id }, data: { ...parsed.data } });
  }
  redirect("/account/addresses?saved=1");
}

export async function deleteAddress(formData: FormData): Promise<void> {
  const customerId = await requireCustomerId();
  const id = toId(formData);
  if (id === null) redirect("/account/addresses");
  // Scoped delete: the customerId in the filter guarantees ownership.
  await db.address.deleteMany({ where: { id, customerId } });
  redirect("/account/addresses?deleted=1");
}

export async function setDefaultAddress(formData: FormData): Promise<void> {
  const customerId = await requireCustomerId();
  const id = toId(formData);
  if (id === null) redirect("/account/addresses");
  const owned = await db.address.findFirst({ where: { id, customerId }, select: { id: true } });
  if (!owned) redirect("/account/addresses");
  await db.$transaction([
    db.address.updateMany({ where: { customerId }, data: { isDefault: false } }),
    db.address.update({ where: { id }, data: { isDefault: true } }),
  ]);
  redirect("/account/addresses");
}
