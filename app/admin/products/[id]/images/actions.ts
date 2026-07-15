"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import sharp from "sharp";
import { db } from "../../../../../lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "../../../../../lib/session";

const MAX_IMAGES_PER_PRODUCT = 5;
const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB
const MAX_EDGE_PX = 2400;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");
const UPLOAD_URL_PREFIX = "/uploads/products/";

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) redirect("/admin/login");
}

function revalidateSite(): void {
  revalidatePath("/", "layout");
  revalidatePath("/admin/products");
}

function back(productId: string, flash?: { err?: string; ok?: string }): never {
  const params = new URLSearchParams();
  if (flash?.err) params.set("err", flash.err);
  if (flash?.ok) params.set("ok", flash.ok);
  const q = params.toString();
  redirect(`/admin/products/${productId}${q ? `?${q}` : ""}#photos`);
}

async function processUpload(file: File, slug: string): Promise<string> {
  const output = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: MAX_EDGE_PX, height: MAX_EDGE_PX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${slug.slice(0, 40)}-${Date.now()}-${randomBytes(3).toString("hex")}.jpg`;
  await writeFile(path.join(UPLOAD_DIR, filename), output);
  return UPLOAD_URL_PREFIX + filename;
}

/** Instant multi-photo upload (form field: photos). Bound with productId on the edit page. */
export async function uploadImages(productId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, slug: true, _count: { select: { images: true } } },
  });
  if (!product) redirect("/admin/products");

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) back(productId, { err: "Choose one or more photos to upload." });

  const room = MAX_IMAGES_PER_PRODUCT - product._count.images;
  if (room <= 0) {
    back(productId, {
      err: `This product already has ${MAX_IMAGES_PER_PRODUCT} photos. Remove one before uploading another.`,
    });
  }

  const toUpload = files.slice(0, room);
  const maxOrder = await db.productImage.aggregate({
    where: { productId },
    _max: { sortOrder: true },
  });
  let nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

  for (const file of toUpload) {
    if (!ALLOWED_TYPES.has(file.type)) {
      back(productId, {
        err: `"${file.name}" is not a supported format. Please use JPG, PNG or WebP photos.`,
      });
    }
    if (file.size > MAX_FILE_BYTES) {
      back(productId, { err: `"${file.name}" is larger than 15 MB. Please send a smaller photo.` });
    }
    let servedPath: string;
    try {
      servedPath = await processUpload(file, product.slug);
    } catch {
      back(productId, { err: `"${file.name}" could not be read as an image. Please try a different photo.` });
    }
    await db.productImage.create({
      data: { productId, path: servedPath, sortOrder: nextOrder++ },
    });
  }

  revalidateSite();
  const n = toUpload.length;
  back(productId, {
    ok: n === 1 ? "Photo uploaded." : `${n} photos uploaded.`,
  });
}

export async function deleteImage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get("imageId") ?? ""), 10);
  const image = Number.isInteger(id) ? await db.productImage.findUnique({ where: { id } }) : null;
  if (!image) redirect("/admin/products");

  await db.productImage.delete({ where: { id } });
  if (image.path.startsWith(UPLOAD_URL_PREFIX)) {
    await unlink(path.join(UPLOAD_DIR, path.basename(image.path))).catch(() => {});
  }

  const remaining = await db.productImage.findMany({
    where: { productId: image.productId },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
  await db.$transaction(
    remaining.map((row, i) => db.productImage.update({ where: { id: row.id }, data: { sortOrder: i } }))
  );

  revalidateSite();
  back(image.productId, { ok: "Photo removed." });
}

export async function moveImage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get("imageId") ?? ""), 10);
  const dir = String(formData.get("dir") ?? "");
  const image = Number.isInteger(id) ? await db.productImage.findUnique({ where: { id } }) : null;
  if (!image) redirect("/admin/products");

  const images = await db.productImage.findMany({
    where: { productId: image.productId },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
  const idx = images.findIndex((row) => row.id === id);
  if (idx < 0) back(image.productId);

  let ordered = images.map((row) => row.id);
  if (dir === "left" && idx > 0) {
    [ordered[idx - 1], ordered[idx]] = [ordered[idx], ordered[idx - 1]];
  } else if (dir === "right" && idx < ordered.length - 1) {
    [ordered[idx], ordered[idx + 1]] = [ordered[idx + 1], ordered[idx]];
  } else if (dir === "cover" && idx > 0) {
    ordered = [id, ...ordered.filter((x) => x !== id)];
  } else {
    back(image.productId);
  }

  await db.$transaction(
    ordered.map((rowId, i) => db.productImage.update({ where: { id: rowId }, data: { sortOrder: i } }))
  );
  revalidateSite();
  back(image.productId);
}

// Rotate a photo 90° clockwise. Seeded photos under /images (git-tracked) are
// copy-on-write: the rotated result becomes a managed upload and the row is
// repointed; the original repo asset is never modified or deleted.
export async function rotateImage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get("imageId") ?? ""), 10);
  const image = Number.isInteger(id) ? await db.productImage.findUnique({ where: { id } }) : null;
  if (!image) redirect("/admin/products");
  const product = await db.product.findUnique({ where: { id: image.productId }, select: { slug: true } });
  if (!product) redirect("/admin/products");

  const isUpload = image.path.startsWith(UPLOAD_URL_PREFIX);
  const sourcePath = isUpload
    ? path.join(UPLOAD_DIR, path.basename(image.path))
    : path.join(process.cwd(), "public", image.path.replace(/^\//, ""));

  let output: Buffer;
  try {
    output = await sharp(sourcePath)
      .rotate(90)
      .jpeg({ quality: 88, mozjpeg: true })
      .toBuffer();
  } catch {
    back(image.productId, { err: "That photo could not be rotated. Please try again." });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${product.slug.slice(0, 40)}-${Date.now()}-${randomBytes(3).toString("hex")}.jpg`;
  await writeFile(path.join(UPLOAD_DIR, filename), output);
  await db.productImage.update({ where: { id }, data: { path: UPLOAD_URL_PREFIX + filename } });
  if (isUpload) {
    await unlink(sourcePath).catch(() => {});
  }
  revalidateSite();
  back(image.productId);
}

// Replace a photo in place: same position in the gallery, new file. The old
// file is removed from disk only if it was a managed upload.
export async function replaceImage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number.parseInt(String(formData.get("imageId") ?? ""), 10);
  const image = Number.isInteger(id) ? await db.productImage.findUnique({ where: { id } }) : null;
  if (!image) redirect("/admin/products");
  const product = await db.product.findUnique({ where: { id: image.productId }, select: { slug: true } });
  if (!product) redirect("/admin/products");

  const file = formData.getAll("photo").find((f): f is File => f instanceof File && f.size > 0);
  if (!file) back(image.productId, { err: "Choose a photo to replace this one with." });
  if (!ALLOWED_TYPES.has(file.type)) {
    back(image.productId, { err: `"${file.name}" is not a supported format. Please use JPG, PNG or WebP photos.` });
  }
  if (file.size > MAX_FILE_BYTES) {
    back(image.productId, { err: `"${file.name}" is larger than 15 MB. Please send a smaller photo.` });
  }

  let output: Buffer;
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: MAX_EDGE_PX, height: MAX_EDGE_PX, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();
  } catch {
    back(image.productId, { err: `"${file.name}" could not be read as an image. Please try a different photo.` });
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${product.slug.slice(0, 40)}-${Date.now()}-${randomBytes(3).toString("hex")}.jpg`;
  await writeFile(path.join(UPLOAD_DIR, filename), output);
  if (image.path.startsWith(UPLOAD_URL_PREFIX)) {
    await unlink(path.join(UPLOAD_DIR, path.basename(image.path))).catch(() => {});
  }
  await db.productImage.update({ where: { id }, data: { path: UPLOAD_URL_PREFIX + filename } });
  revalidateSite();
  back(image.productId, { ok: "Photo replaced." });
}
