"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { db } from "@/lib/db";
import { CUSTOMER_COOKIE, verifyCustomerSessionToken } from "@/lib/customer-session";
import { COUNTRIES } from "@/lib/countries";

const COUNTRY_SET = new Set(COUNTRIES.map((c) => c.name));
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Reserve-and-request checkout. The buyer submits their order; inside one
// database transaction every piece is re-checked as still available and
// flipped to "reserved", the customer record is resolved (guest checkout
// creates one), and the order is written with a frozen shipping snapshot.
// If ANY piece is no longer available the whole transaction rolls back and
// nothing is reserved. Payment is arranged afterwards (the payment gateway
// drops into this seam once the client's PayPal Business account is ready).

class CheckoutError extends Error {
  constructor(public code: string, public piece: string = "") {
    super(code);
  }
}

function field(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim() : "";
}

export async function placeOrder(formData: FormData): Promise<void> {
  // --- cart ---------------------------------------------------------------
  let slugs: string[] = [];
  try {
    const parsed: unknown = JSON.parse(field(formData, "slugs") || "[]");
    if (Array.isArray(parsed)) {
      slugs = [...new Set(parsed.filter((x): x is string => typeof x === "string" && x.length > 0))];
    }
  } catch {
    // fall through to the empty-cart guard
  }
  if (slugs.length === 0 || slugs.length > 20) redirect("/cart");

  // --- who is buying ------------------------------------------------------
  const cookieStore = await cookies();
  const session = await verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE)?.value);

  const name = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const phone = field(formData, "phone");
  const password = String(formData.get("password") ?? "");

  // --- shipping address ---------------------------------------------------
  const addressId = field(formData, "addressId"); // logged-in: a saved address id, or "new"
  const line1 = field(formData, "line1");
  const line2 = field(formData, "line2");
  const city = field(formData, "city");
  const postcode = field(formData, "postcode");
  const country = field(formData, "country");
  const usingSaved = session !== null && addressId !== "" && addressId !== "new";

  if (!usingSaved) {
    if (!line1 || !city || !postcode || !country) throw redirectErr("fields");
    if (line1.length > 200 || line2.length > 200 || city.length > 120 || postcode.length > 40) throw redirectErr("fields");
    if (!COUNTRY_SET.has(country)) throw redirectErr("fields");
  }
  if (phone.length > 40) throw redirectErr("fields");

  if (!session) {
    if (name.length < 1 || name.length > 120) throw redirectErr("fields");
    if (!EMAIL_RE.test(email) || email.length > 254) throw redirectErr("fields");
    if (password !== "" && (password.length < 8 || password.length > 200)) throw redirectErr("password");
  }

  // Guest accounts get a real password if the buyer chose one, otherwise an
  // unguessable random one (the order still works; they can use a password
  // they set to follow it). Hashing happens OUTSIDE the transaction.
  const passwordHash = session
    ? null
    : await bcrypt.hash(password !== "" ? password : randomBytes(32).toString("hex"), 12);

  // --- the transaction ----------------------------------------------------
  let orderId = "";
  let errCode = "";
  let errPiece = "";
  try {
    orderId = await db.$transaction(async (tx) => {
      // 1. Every piece must still exist, be published, and be available.
      const products = await tx.product.findMany({
        where: { slug: { in: slugs }, published: true },
        select: { id: true, slug: true, titleEn: true, priceEur: true, status: true },
      });
      if (products.length !== slugs.length) {
        const found = new Set(products.map((p: { slug: string }) => p.slug));
        throw new CheckoutError("unavailable", slugs.find((s) => !found.has(s)) ?? "");
      }
      const taken = products.find((p: { status: string }) => p.status !== "available");
      if (taken) throw new CheckoutError("unavailable", taken.slug);

      // 2. Reserve atomically: the status guard in the WHERE means a piece
      //    sold in a race is NOT re-reserved, and the count check catches it.
      const reserved = await tx.product.updateMany({
        where: { id: { in: products.map((p: { id: string }) => p.id) }, status: "available" },
        data: { status: "reserved" },
      });
      if (reserved.count !== products.length) throw new CheckoutError("unavailable");

      // 3. Resolve the customer.
      let customerId: string;
      let shipName: string;
      if (session) {
        const existing = await tx.customer.findUnique({ where: { id: session.sub }, select: { id: true, name: true } });
        if (!existing) throw new CheckoutError("fields");
        customerId = existing.id;
        shipName = existing.name;
      } else {
        const clash = await tx.customer.findUnique({ where: { email }, select: { id: true } });
        if (clash) throw new CheckoutError("email");
        const created = await tx.customer.create({
          data: { name, email, passwordHash: passwordHash as string },
          select: { id: true },
        });
        customerId = created.id;
        shipName = name;
      }

      // 4. Resolve the shipping address into a frozen snapshot.
      let snap: { line1: string; line2: string | null; city: string; postcode: string; country: string };
      if (usingSaved) {
        const idNum = Number.parseInt(addressId, 10);
        const owned = Number.isInteger(idNum)
          ? await tx.address.findFirst({ where: { id: idNum, customerId } })
          : null;
        if (!owned) throw new CheckoutError("fields");
        snap = { line1: owned.line1, line2: owned.line2, city: owned.city, postcode: owned.postcode, country: owned.country };
      } else {
        snap = { line1, line2: line2 === "" ? null : line2, city, postcode, country };
        const existingCount = await tx.address.count({ where: { customerId } });
        await tx.address.create({ data: { ...snap, customerId, isDefault: existingCount === 0 } });
      }

      // 5. Write the order with server-side prices only.
      const total = products.reduce(
        (sum: number, p: { priceEur: unknown }) => sum + Number(String(p.priceEur)),
        0
      );
      const order = await tx.order.create({
        data: {
          customerId,
          status: "pending",
          totalEur: total.toFixed(2),
          shipName,
          shipPhone: phone === "" ? null : phone,
          shipLine1: snap.line1,
          shipLine2: snap.line2,
          shipCity: snap.city,
          shipPostcode: snap.postcode,
          shipCountry: snap.country,
          items: {
            create: products.map((p: { id: string; titleEn: string; priceEur: unknown }) => ({
              productId: p.id,
              titleEn: p.titleEn,
              priceEur: String(p.priceEur),
            })),
          },
        },
        select: { id: true },
      });
      return order.id;
    });
  } catch (e) {
    if (e instanceof CheckoutError) {
      errCode = e.code;
      errPiece = e.piece;
    } else {
      throw e;
    }
  }

  if (errCode !== "") {
    redirect(`/checkout?err=${errCode}${errPiece ? `&piece=${encodeURIComponent(errPiece)}` : ""}`);
  }
  redirect(`/checkout/confirmation/${orderId}`);
}

// Field validation failures outside the transaction share one redirect shape.
function redirectErr(code: string): never {
  redirect(`/checkout?err=${code}`);
}
