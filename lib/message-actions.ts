"use server";

import { redirect } from "next/navigation";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import sharp from "sharp";
import { db } from "@/lib/db";
import { sendEnquiryEmail } from "@/lib/email";

// Contact, acquisition and newsletter submissions.
//
// Order of operations matters: the submission is written to the database
// FIRST, then the notification email is attempted. If mail fails for any
// reason the lead still exists in the admin Messages panel, so nothing is
// ever lost to an email outage or a missing API key.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_PHOTOS = 3;
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_EDGE_PX = 2000;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "enquiries");
const UPLOAD_URL_PREFIX = "/uploads/enquiries/";

function field(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v.trim() : "";
}

// Honeypot: a field hidden from real visitors. Bots fill it in, so when it has
// a value we show the normal thank-you and store nothing.
function isBot(fd: FormData): boolean {
  return field(fd, "company") !== "";
}

// Photographs are re-encoded through sharp, which also strips EXIF and any
// non-image payload, then written under a random filename.
async function savePhotos(fd: FormData): Promise<string[]> {
  const files = fd.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return [];

  const urls: string[] = [];
  for (const file of files.slice(0, MAX_PHOTOS)) {
    if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_BYTES) continue;
    try {
      const output = await sharp(Buffer.from(await file.arrayBuffer()))
        .rotate()
        .resize({ width: MAX_EDGE_PX, height: MAX_EDGE_PX, fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
      await mkdir(UPLOAD_DIR, { recursive: true });
      const filename = `offer-${Date.now()}-${randomBytes(4).toString("hex")}.jpg`;
      await writeFile(path.join(UPLOAD_DIR, filename), output);
      urls.push(UPLOAD_URL_PREFIX + filename);
    } catch {
      // A single unreadable file must not lose the whole submission.
    }
  }
  return urls;
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
  try {
    await sendEnquiryEmail({ kind: "contact", name, email, body });
  } catch {
    // Saved in the admin panel regardless.
  }
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

  const photoUrls = await savePhotos(formData);

  await db.message.create({
    data: {
      kind: "sell",
      name,
      email,
      phone: phone === "" ? null : phone,
      body,
      photos: photoUrls.length > 0 ? photoUrls.join(",") : null,
    },
  });
  try {
    await sendEnquiryEmail({ kind: "sell", name, email, phone, body, photoUrls });
  } catch {
    // Saved in the admin panel regardless.
  }
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
