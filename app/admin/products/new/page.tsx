import type { Metadata } from "next";
import { cookies } from "next/headers";
import { db } from "../../../../lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "../../../../lib/session";
import AdminHeader from "../../../../components/admin/AdminHeader";
import ProductForm from "../ProductForm";
import { createProduct } from "../actions";

export const metadata: Metadata = {
  title: "New Product · Balzac Antiques Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  const email = session?.email ?? "";

  const categories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, labelEn: true },
  });

  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <AdminHeader email={email} />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-serif text-[26px] text-[#1F1B16]">New Product</h1>
        <p className="mb-10 mt-2 text-[14px] leading-relaxed text-[#6B6154]">
          English fields are required. French is optional; the site shows English until it is filled in. Photos are added in the next update.
        </p>
        <ProductForm
          action={createProduct}
          categories={categories}
          isNew
          initial={{
            titleEn: "",
            titleFr: "",
            eyebrow: "",
            slug: "",
            categoryId: "",
            priceEur: "",
            descriptionEn: "",
            descriptionFr: "",
            origin: "",
            year: "",
            condition: "",
            dimensions: "",
            published: true,
            featured: false,
            specs: [],
          }}
        />
      </div>
    </main>
  );
}
