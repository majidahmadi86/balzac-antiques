import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { db } from "../../../../lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "../../../../lib/session";
import AdminHeader from "../../../../components/admin/AdminHeader";
import ProductForm from "../ProductForm";
import { updateProduct } from "../actions";
import DeleteButton from "./DeleteButton";

export const metadata: Metadata = {
  title: "Edit Product · Balzac Antiques Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  const email = session?.email ?? "";

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id: params.id },
      include: {
        specs: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
      },
    }),
    db.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, labelEn: true } }),
  ]);

  if (!product) notFound();

  const updateWithId = updateProduct.bind(null, product.id);

  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <AdminHeader email={email} />
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-[10px] tracking-[0.24em] uppercase text-[#9A8F7D]">Edit Product</p>
        <h1 className="mt-1 font-serif text-[26px] text-[#1F1B16]">{product.titleEn}</h1>

        {product.images.length > 0 && (
          <div className="mt-8 border border-[#E4DCCB] bg-white/70 p-5">
            <p className="text-[10px] tracking-[0.22em] uppercase text-[#6B6154]">Photos</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.images.map((img: { id: number; path: string; alt: string | null }) => (
                <div key={img.id} className="relative h-20 w-20 overflow-hidden border border-[#E4DCCB] bg-[#F0EADB]">
                  <Image src={img.path} alt={img.alt ?? product.titleEn} fill sizes="80px" className="object-cover" />
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-[#9A8F7D]">Photo upload and reordering arrive in the next update.</p>
          </div>
        )}

        <div className="mt-10">
          <ProductForm
            action={updateWithId}
            categories={categories}
            isNew={false}
            initial={{
              titleEn: product.titleEn,
              titleFr: product.titleFr ?? "",
              eyebrow: product.eyebrow ?? "",
              slug: product.slug,
              categoryId: product.categoryId,
              priceEur: String(product.priceEur),
              descriptionEn: product.descriptionEn,
              descriptionFr: product.descriptionFr ?? "",
              origin: product.origin ?? "",
              year: product.year ?? "",
              condition: product.condition ?? "",
              dimensions: product.dimensions ?? "",
              published: product.published,
              featured: product.featured,
              specs: product.specs.map((s: { labelEn: string; valueEn: string; labelFr: string | null; valueFr: string | null }) => ({
                labelEn: s.labelEn,
                valueEn: s.valueEn,
                labelFr: s.labelFr ?? "",
                valueFr: s.valueFr ?? "",
              })),
            }}
          />
        </div>

        <div className="mt-16 border-t border-[#C08A6A]/30 pt-8">
          <p className="mb-4 text-[10px] tracking-[0.24em] uppercase text-[#8A5A3C]">Danger Zone</p>
          <DeleteButton id={product.id} title={product.titleEn} />
        </div>
      </div>
    </main>
  );
}
