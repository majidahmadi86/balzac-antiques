import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { db } from "../../../lib/db";
import { ADMIN_COOKIE, verifySessionToken } from "../../../lib/session";
import AdminHeader from "../../../components/admin/AdminHeader";
import { togglePublished, toggleFeatured } from "./actions";

export const metadata: Metadata = {
  title: "Products · Balzac Antiques Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type ProductRow = {
  id: string;
  titleEn: string;
  titleFr: string | null;
  priceEur: unknown;
  featured: boolean;
  published: boolean;
  category: { labelEn: string };
  images: { path: string; alt: string | null }[];
};

function formatEur(value: unknown): string {
  const n = Number(String(value));
  return Number.isFinite(n)
    ? n.toLocaleString("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2 })
    : String(value);
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: { saved?: string; deleted?: string; heroLimit?: string };
}) {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(ADMIN_COOKIE)?.value);
  const email = session?.email ?? "";

  const products = await db.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      category: { select: { labelEn: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });

  return (
    <main className="min-h-screen bg-[#F7F3EA]">
      <AdminHeader email={email} />

      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-[26px] text-[#1F1B16]">Products</h1>
            <p className="mt-2 text-[14px] leading-relaxed text-[#6B6154]">
              {products.length} {products.length === 1 ? "piece" : "pieces"} in the catalogue.
            </p>
          </div>
          <Link
            href="/admin/products/new"
            className="bg-[#1F1B16] px-6 py-3 text-[11px] tracking-[0.28em] uppercase text-[#F7F3EA] transition-colors hover:bg-[#3A322A]"
          >
            + New Product
          </Link>
        </div>

        {searchParams?.saved === "1" && (
          <p className="mt-6 border border-[#B99A5B]/40 bg-[#F4E9D4] px-4 py-3 text-[13px] text-[#6B5326]">Product saved.</p>
        )}
        {searchParams?.heroLimit === "1" && (
          <p className="mt-6 border border-[#C08A6A]/40 bg-[#FBF4EF] px-4 py-3 text-[13px] text-[#8A5A3C]">Up to 5 pieces can be heroes on the homepage. Un-star another piece first.</p>
        )}
        {searchParams?.deleted === "1" && (
          <p className="mt-6 border border-[#B99A5B]/40 bg-[#F4E9D4] px-4 py-3 text-[13px] text-[#6B5326]">Product deleted.</p>
        )}

        {products.length === 0 ? (
          <div className="mt-10 border border-[#E4DCCB] bg-white/70 px-8 py-16 text-center">
            <p className="font-serif text-[18px] text-[#1F1B16]">The catalogue is empty</p>
            <p className="mt-2 text-[13px] text-[#6B6154]">Add your first piece to begin.</p>
          </div>
        ) : (
          <div className="mt-10 border border-[#E4DCCB] bg-white/70">
            {products.map((p: ProductRow, i: number) => (
              <div
                key={p.id}
                className={`flex flex-wrap items-center gap-4 px-5 py-4 sm:flex-nowrap ${i > 0 ? "border-t border-[#E4DCCB]" : ""}`}
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-[#E4DCCB] bg-[#F0EADB]">
                  {p.images[0] ? (
                    <Image src={p.images[0].path} alt={p.images[0].alt ?? p.titleEn} fill sizes="56px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[8px] tracking-[0.18em] text-[#9A8F7D]">
                      NO PHOTO
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <Link href={`/admin/products/${p.id}`} className="block truncate font-serif text-[16px] text-[#1F1B16] transition-colors hover:text-[#8A7A5C]">
                    {p.titleEn}
                  </Link>
                  <p className="mt-0.5 text-[12px] text-[#9A8F7D]">
                    {p.category.labelEn} · {formatEur(p.priceEur)}
                    {!p.titleFr && <span className="ml-2 text-[#B99A5B]">FR missing</span>}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2.5">
                  <form action={toggleFeatured}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      title={p.featured ? "Hero on the homepage slideshow · click to remove" : "Not a hero · click to add to the homepage slideshow (max 5)"}
                      className={`border px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase transition-colors ${
                        p.featured
                          ? "border-[#B99A5B] bg-[#F4E9D4] text-[#6B5326]"
                          : "border-[#D8CFBB] bg-white text-[#9A8F7D] hover:border-[#B99A5B]"
                      }`}
                    >
                      ★ Hero
                    </button>
                  </form>
                  <form action={togglePublished}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      title={p.published ? "Live on the site · click to hide" : "Hidden · click to publish"}
                      className={`border px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase transition-colors ${
                        p.published
                          ? "border-[#5B7A5B]/40 bg-[#EAF0E6] text-[#3E5A3E]"
                          : "border-[#D8CFBB] bg-white text-[#9A8F7D] hover:border-[#B99A5B]"
                      }`}
                    >
                      {p.published ? "Published" : "Hidden"}
                    </button>
                  </form>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="border border-[#D8CFBB] bg-white px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase text-[#1F1B16] transition-colors hover:border-[#B99A5B]"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-[12px] leading-relaxed text-[#9A8F7D]">
          Note: the public site switches to this catalogue in an upcoming update. Until then, changes here are saved but not yet shown to visitors.
        </p>
      </div>
    </main>
  );
}
