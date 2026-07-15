"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { db } from "../../../../../lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "../../../../../lib/session";

const MAX_IMAGES_PER_PRODUCT = 5;
const MAX_BYTES = 15 * 1024 * 1024; // 15 MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) redirect("/admin/login");
}

function revalidateAll(productId: string) {
  revalidatePath("/", "layout"); // public catalogue + product pages
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
}

export type ImageActionState = { error: string } | { ok: true } | null;

export async function uploadProductImage(
  productId: string,
  _prev: ImageActionState,
  formData: FormData
): Promise<ImageActionState> {
  await requireAdmin();

  const product = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, _count: { select: { images: true } } },
  });
  if (!product) return { error: "This product no longer exists." };

  if (product._count.images >= MAX_IMAGES_PER_PRODUCT) {
    return {
      error: `This product already has ${MAX_IMAGES_PER_PRODUCT} photos. Delete one before uploading another.`,
    };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose a photo to upload." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "That photo is larger than 15 MB. Please choose a smaller file." };
  }
  if (!ALLOWED.has(file.type)) {
    return { error: "Please upload a JPG, PNG or WebP image." };
  }

  const input = Buffer.from(await file.arrayBuffer());
  let jpeg: Buffer;
  try {
    jpeg = await sharp(input)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
  } catch {
    return { error: "That file could not be read as an image. Please try another photo." };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${productId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
  const abs = path.join(UPLOAD_DIR, filename);
  await writeFile(abs, jpeg);

  const maxOrder = await db.productImage.aggregate({
    where: { productId },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? -1) + 1;
  const servedPath = `/uploads/products/${filename}`;

  await db.productImage.create({
    data: { productId, path: servedPath, sortOrder },
  });

  revalidateAll(productId);
  return { ok: true };
}

export async function deleteProductImage(formData: FormData): Promise<void> {
  await requireAdmin();
  const imageId = Number(formData.get("imageId"));
  const productId = String(formData.get("productId") ?? "");
  if (!Number.isFinite(imageId) || !productId) return;

  const image = await db.productImage.findUnique({ where: { id: imageId } });
  if (!image || image.productId !== productId) return;

  await db.productImage.delete({ where: { id: imageId } });

  // Remove file from disk when it lives under /uploads/products/
  if (image.path.startsWith("/uploads/products/")) {
    const base = path.basename(image.path);
    const abs = path.join(UPLOAD_DIR, base);
    await unlink(abs).catch(() => {});
  }

  // Compact sortOrder so the gallery stays contiguous (0..n-1)
  const remaining = await db.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
  await db.$transaction(
    remaining.map((row, i) =>
      db.productImage.update({ where: { id: row.id }, data: { sortOrder: i } })
    )
  );

  revalidateAll(productId);
}

export async function makeCoverPhoto(formData: FormData): Promise<void> {
  await requireAdmin();
  const imageId = Number(formData.get("imageId"));
  const productId = String(formData.get("productId") ?? "");
  if (!Number.isFinite(imageId) || !productId) return;

  const images = await db.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
    select: { id: true },
  });
  if (!images.some((i) => i.id === imageId)) return;

  // Chosen photo becomes sortOrder 0; others follow in prior relative order
  const ordered = [imageId, ...images.map((i) => i.id).filter((id) => id !== imageId)];
  await db.$transaction(
    ordered.map((id, i) => db.productImage.update({ where: { id }, data: { sortOrder: i } }))
  );

  revalidateAll(productId);
}
