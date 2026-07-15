"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "../../../lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "../../../lib/session";

export type ProductFormState = { error: string } | null;

// Middleware already guards /admin/*; this is defense in depth for the action POSTs.
async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!session) redirect("/admin/login");
}

function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "") // strip accents (French titles)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "piece"
  );
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let n = 2;
  // Loop until free; bounded in practice by catalogue size.
  for (;;) {
    const existing = await db.product.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}

type ParsedSpec = { labelEn: string; valueEn: string; labelFr: string | null; valueFr: string | null; sortOrder: number };

type Parsed =
  | { error: string }
  | {
      error?: undefined;
      data: {
        titleEn: string;
        titleFr: string | null;
        eyebrow: string | null;
        categoryId: number;
        priceEur: string;
        descriptionEn: string;
        descriptionFr: string | null;
        origin: string | null;
        year: string | null;
        condition: string | null;
        dimensions: string | null;
        published: boolean;
        featured: boolean;
      };
      slugInput: string;
      specs: ParsedSpec[];
    };

function str(formData: FormData, name: string): string {
  const v = formData.get(name);
  return typeof v === "string" ? v.trim() : "";
}

function orNull(s: string): string | null {
  return s === "" ? null : s;
}

function parseProductForm(formData: FormData): Parsed {
  const titleEn = str(formData, "titleEn");
  if (!titleEn) return { error: "The English title is required." };
  if (titleEn.length > 200) return { error: "The English title is too long (200 characters max)." };

  const descriptionEn = str(formData, "descriptionEn");
  if (!descriptionEn) return { error: "The English description is required." };

  const categoryId = Number.parseInt(str(formData, "categoryId"), 10);
  if (!Number.isInteger(categoryId) || categoryId <= 0) return { error: "Please choose a category." };

  const priceRaw = str(formData, "priceEur").replace(/[,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(priceRaw)) {
    return { error: "Price must be a number in euros, e.g. 1250 or 269.99." };
  }
  if (Number.parseFloat(priceRaw) >= 100_000_000) return { error: "Price is out of range." };

  // Spec repeater rows arrive as parallel getAll() arrays (inputs share names, DOM order preserved)
  const labelsEn = formData.getAll("specLabelEn").map((v) => String(v).trim());
  const valuesEn = formData.getAll("specValueEn").map((v) => String(v).trim());
  const labelsFr = formData.getAll("specLabelFr").map((v) => String(v).trim());
  const valuesFr = formData.getAll("specValueFr").map((v) => String(v).trim());

  const specs: ParsedSpec[] = [];
  for (let i = 0; i < labelsEn.length; i++) {
    const labelEn = labelsEn[i] ?? "";
    const valueEn = valuesEn[i] ?? "";
    const labelFr = labelsFr[i] ?? "";
    const valueFr = valuesFr[i] ?? "";
    if (!labelEn && !valueEn && !labelFr && !valueFr) continue; // fully empty row: skip
    if (!labelEn || !valueEn) {
      return { error: `Specification row ${i + 1} needs both an English label and an English value (or leave the whole row empty).` };
    }
    specs.push({ labelEn, valueEn, labelFr: orNull(labelFr), valueFr: orNull(valueFr), sortOrder: specs.length });
  }

  return {
    data: {
      titleEn,
      titleFr: orNull(str(formData, "titleFr")),
      eyebrow: orNull(str(formData, "eyebrow")),
      categoryId,
      priceEur: priceRaw,
      descriptionEn,
      descriptionFr: orNull(str(formData, "descriptionFr")),
      origin: orNull(str(formData, "origin")),
      year: orNull(str(formData, "year")),
      condition: orNull(str(formData, "condition")),
      dimensions: orNull(str(formData, "dimensions")),
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
    },
    slugInput: str(formData, "slug"),
    specs,
  };
}

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();
  // useFormState calls (state, formData); a bare progressive POST may pass FormData as the only argument.
  const data = _prev instanceof FormData ? _prev : formData;
  const parsed = parseProductForm(data);
  if (parsed.error !== undefined) return { error: parsed.error };

  const category = await db.category.findUnique({ where: { id: parsed.data.categoryId }, select: { id: true } });
  if (!category) return { error: "That category no longer exists. Please refresh and try again." };

  const slug = await uniqueSlug(slugify(parsed.slugInput || parsed.data.titleEn));

  await db.product.create({
    data: {
      ...parsed.data,
      slug,
      specs: { create: parsed.specs },
    },
  });

  revalidatePath("/", "layout"); // public site reads this catalogue now
  revalidatePath("/admin/products");
  redirect("/admin/products?saved=1");
}

export async function updateProduct(id: string, _prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const existing = await db.product.findUnique({ where: { id }, select: { id: true, slug: true } });
  if (!existing) return { error: "This product no longer exists." };

  const data = _prev instanceof FormData ? _prev : formData;
  const parsed = parseProductForm(data);
  if (parsed.error !== undefined) return { error: parsed.error };

  const category = await db.category.findUnique({ where: { id: parsed.data.categoryId }, select: { id: true } });
  if (!category) return { error: "That category no longer exists. Please refresh and try again." };

  const slug = await uniqueSlug(slugify(parsed.slugInput || parsed.data.titleEn), id);

  // Specs are replaced wholesale in one transaction (same clear/reinsert pattern as the seed)
  await db.$transaction([
    db.product.update({ where: { id }, data: { ...parsed.data, slug } }),
    db.productSpec.deleteMany({ where: { productId: id } }),
    db.productSpec.createMany({ data: parsed.specs.map((s) => ({ ...s, productId: id })) }),
  ]);

  revalidatePath("/", "layout"); // public site reads this catalogue now
  revalidatePath("/admin/products");
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  if (id) {
    // ProductImage + ProductSpec rows cascade via the schema's onDelete: Cascade
    await db.product.delete({ where: { id } }).catch(() => {});
  }
  revalidatePath("/", "layout"); // public site reads this catalogue now
  revalidatePath("/admin/products");
  redirect("/admin/products?deleted=1");
}

export async function togglePublished(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const product = id ? await db.product.findUnique({ where: { id }, select: { published: true } }) : null;
  if (product) {
    await db.product.update({ where: { id }, data: { published: !product.published } });
  }
  revalidatePath("/", "layout"); // public site reads this catalogue now
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function toggleFeatured(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = str(formData, "id");
  const product = id ? await db.product.findUnique({ where: { id }, select: { featured: true } }) : null;
  if (product) {
    await db.product.update({ where: { id }, data: { featured: !product.featured } });
  }
  revalidatePath("/", "layout"); // public site reads this catalogue now
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
