// One-time seed: mirrors the current hardcoded lib/data.ts catalogue into the
// database. After this runs, the DB is the source of truth and the admin
// panel manages it — lib/data.ts gets retired when the site switches to
// Prisma queries (next phase, together with the admin UI).
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const categories = [
  { slug: "books", labelEn: "Books", image: "/images/category-books.svg", featured: true, sortOrder: 1 },
  { slug: "art", labelEn: "Art", image: "/images/category-art.svg", featured: true, sortOrder: 2 },
  { slug: "watches", labelEn: "Watches", image: "/images/category-watches.svg", featured: true, sortOrder: 3 },
  { slug: "music", labelEn: "Music", image: "/images/category-music.svg", featured: true, sortOrder: 4 },
  { slug: "furniture", labelEn: "Furniture", image: "/images/category-furniture.svg", sortOrder: 5 },
  { slug: "design", labelEn: "Design", image: "/images/category-design.svg", sortOrder: 6 },
  { slug: "objects", labelEn: "Objects", image: "/images/category-objects.svg", sortOrder: 7 },
  { slug: "curiosities", labelEn: "Curiosities", image: "/images/category-curiosities.svg", sortOrder: 8 },
];

const products = [
  {
    slug: "gainsbourg-melody-nelson-1971",
    category: "music",
    eyebrow: "Serge Gainsbourg",
    titleEn: "Histoire de Melody Nelson",
    origin: "France",
    year: "1971",
    descriptionEn:
      "Original French pressing of Serge Gainsbourg's legendary album Histoire de Melody Nelson. A beautiful original copy with glossy vinyl and a well-preserved gatefold sleeve. A highly collectible classic and an essential album for any Serge Gainsbourg collection.",
    condition: "Sleeve VG+ / Vinyl VG+ to EX-",
    priceEur: "269.99",
    featured: true,
    specs: [
      ["Label", "Philips"], ["Catalogue No.", "6325 071"], ["Country", "France"],
      ["Year", "1971"], ["Format", "Original gatefold sleeve"], ["Sleeve", "VG+"], ["Vinyl", "VG+ / EX-"],
    ],
    images: ["/images/products/melody-nelson-1.jpg", "/images/products/melody-nelson-2.jpg", "/images/products/melody-nelson-3.jpg", "/images/products/melody-nelson-4.jpg"],
  },
  {
    slug: "paul-picot-firshire-4090",
    category: "watches",
    eyebrow: "Paul Picot",
    titleEn: "Firshire Chronograph Ref. 4090",
    origin: "Switzerland",
    year: "Swiss Made",
    descriptionEn:
      "A beautiful and increasingly collectible Swiss chronograph, combining timeless elegance with the legendary reliability of the ETA Valjoux 7750 movement. Excellent near mint condition, complete full set with original box and papers.",
    condition: "Excellent, near mint — full set",
    priceEur: "2190",
    featured: true,
    specs: [
      ["Brand", "Paul Picot"], ["Model", "Firshire Chronograph"], ["Reference", "4090"],
      ["Movement", "ETA Valjoux 7750 Automatic"], ["Case", "Stainless Steel"],
      ["Bracelet", "Original Stainless Steel"], ["Crystal", "Sapphire"], ["Dial", "Black"],
      ["Complications", "Chronograph, Big Date, Day, Tachymeter"], ["Water Resistance", "50 m"], ["Box / Papers", "Yes / Yes"],
    ],
    images: ["/images/products/paul-picot-1.jpg", "/images/products/paul-picot-2.jpg", "/images/products/paul-picot-3.jpg"],
  },
  {
    slug: "kuniyoshi-hanshiro-iwai-1842",
    category: "art",
    eyebrow: "Utagawa Kuniyoshi (1798-1861)",
    titleEn: "Kabuki Actor Hanshiro Iwai",
    origin: "Japan",
    year: "circa 1842",
    descriptionEn:
      "Original Japanese ukiyo-e woodblock print depicting the Kabuki actor Hanshiro Iwai. Beautiful impression with artist's signature and seals. Professionally framed and preserved in very good overall condition. A fine and collectible example of 19th-century Japanese art.",
    condition: "Very good overall",
    priceEur: "950",
    featured: true,
    specs: [
      ["Artist", "Utagawa Kuniyoshi (1798-1861)"], ["Subject", "Kabuki Actor Hanshiro Iwai"],
      ["Technique", "Woodblock print (ukiyo-e)"], ["Period", "circa 1842"], ["Country", "Japan"],
      ["Presentation", "Professionally framed"], ["Marks", "Artist's signature and seals"],
    ],
    images: ["/images/products/kuniyoshi-1.jpg", "/images/products/kuniyoshi-2.jpg", "/images/products/kuniyoshi-3.jpg"],
  },
  {
    slug: "gigandet-pendant-watch",
    category: "watches",
    eyebrow: "Gigandet",
    titleEn: "Hidden Pendant Watch",
    origin: "Switzerland",
    year: "Vintage",
    descriptionEn:
      "Rare vintage Gigandet hidden pendant watch with gold-plated engraved case and tassel. Features a Swiss mechanical Incabloc movement and a concealed rectangular dial. In very good vintage condition and in working order. A unique and collectible piece for vintage watch enthusiasts.",
    condition: "Very good vintage, in working order",
    priceEur: "450",
    featured: true,
    specs: [
      ["Brand", "Gigandet"], ["Type", "Hidden pendant watch"], ["Movement", "Swiss mechanical, Incabloc"],
      ["Case", "Gold-plated, engraved, with tassel"], ["Dial", "Concealed rectangular"], ["Origin", "Swiss Made"],
    ],
    images: ["/images/products/gigandet-1.jpg", "/images/products/gigandet-2.jpg"],
  },
];

const catIds = {};
for (const c of categories) {
  const row = await db.category.upsert({ where: { slug: c.slug }, update: c, create: c });
  catIds[c.slug] = row.id;
}

for (const p of products) {
  const { category, specs, images, ...fields } = p;
  const product = await db.product.upsert({
    where: { slug: p.slug },
    update: {},
    create: { ...fields, categoryId: catIds[category] },
  });
  // idempotent re-seed: clear and re-insert children
  await db.productSpec.deleteMany({ where: { productId: product.id } });
  await db.productImage.deleteMany({ where: { productId: product.id } });
  await db.productSpec.createMany({
    data: specs.map(([labelEn, valueEn], i) => ({ productId: product.id, labelEn, valueEn, sortOrder: i })),
  });
  await db.productImage.createMany({
    data: images.map((path, i) => ({ productId: product.id, path, sortOrder: i })),
  });
}

const counts = {
  categories: await db.category.count(),
  products: await db.product.count(),
  images: await db.productImage.count(),
  specs: await db.productSpec.count(),
};
console.log("Seeded:", counts);
await db.$disconnect();
