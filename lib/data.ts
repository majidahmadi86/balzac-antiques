// ---------------------------------------------------------------------------
// DATA LAYER
// Hardcoded for now. Shape is deliberately close to what the admin panel +
// database will provide, so swapping the source doesn't force template
// changes: same exports, same field names.
// ---------------------------------------------------------------------------

// ------------------------------- Categories -------------------------------

export type Category = {
  slug: string;
  label: string;
  image: string;
  featured?: boolean; // appears in the homepage "Exceptional Pieces" grid
};

// Per the client's written brief. The reference screenshots only showed 4 of
// these as a style example — the brief is the source of truth for scope.
export const categories: Category[] = [
  { slug: "books", label: "Books", image: "/images/category-books.svg", featured: true },
  { slug: "art", label: "Art", image: "/images/category-art.svg", featured: true },
  { slug: "watches", label: "Watches", image: "/images/category-watches.svg", featured: true },
  { slug: "music", label: "Music", image: "/images/category-music.svg", featured: true },
  { slug: "furniture", label: "Furniture", image: "/images/category-furniture.svg" },
  { slug: "design", label: "Design", image: "/images/category-design.svg" },
  { slug: "objects", label: "Objects", image: "/images/category-objects.svg" },
  { slug: "curiosities", label: "Curiosities", image: "/images/category-curiosities.svg" },
];

export const categoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

// -------------------------------- Products --------------------------------

// Specs are a flexible label/value list, NOT fixed fields. A vinyl record has
// nothing in common with a wristwatch — the previous schema was watch-only
// (caseMaterial / movement / caseSize) and couldn't describe most of the
// catalogue. The admin panel will let the client add arbitrary spec rows per
// item on the same basis.
export type Spec = { label: string; value: string };

export type Product = {
  id: string;
  category: string; // Category.slug
  eyebrow?: string; // small gold line above the title (maker, artist, label)
  title: string;
  origin?: string;
  year?: string;
  description: string;
  specs: Spec[];
  condition?: string;
  priceEur: number; // BASE CURRENCY = EUR. Client prices everything in EUR.
  images: string[];
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "gainsbourg-melody-nelson-1971",
    category: "music",
    eyebrow: "Serge Gainsbourg",
    title: "Histoire de Melody Nelson",
    origin: "France",
    year: "1971",
    description:
      "Original French pressing of Serge Gainsbourg's legendary album Histoire de Melody Nelson. A beautiful original copy with glossy vinyl and a well-preserved gatefold sleeve. A highly collectible classic and an essential album for any Serge Gainsbourg collection.",
    specs: [
      { label: "Label", value: "Philips" },
      { label: "Catalogue No.", value: "6325 071" },
      { label: "Country", value: "France" },
      { label: "Year", value: "1971" },
      { label: "Format", value: "Original gatefold sleeve" },
      { label: "Sleeve", value: "VG+" },
      { label: "Vinyl", value: "VG+ / EX-" },
    ],
    condition: "Sleeve VG+ / Vinyl VG+ to EX-",
    priceEur: 269.99,
    images: [
      "/images/products/melody-nelson-1.jpg",
      "/images/products/melody-nelson-2.jpg",
      "/images/products/melody-nelson-3.jpg",
      "/images/products/melody-nelson-4.jpg",
    ],
    featured: true,
  },
  {
    id: "paul-picot-firshire-4090",
    category: "watches",
    eyebrow: "Paul Picot",
    title: "Firshire Chronograph Ref. 4090",
    origin: "Switzerland",
    year: "Swiss Made",
    description:
      "A beautiful and increasingly collectible Swiss chronograph, combining timeless elegance with the legendary reliability of the ETA Valjoux 7750 movement. Excellent near mint condition, complete full set with original box and papers.",
    specs: [
      { label: "Brand", value: "Paul Picot" },
      { label: "Model", value: "Firshire Chronograph" },
      { label: "Reference", value: "4090" },
      { label: "Movement", value: "ETA Valjoux 7750 Automatic" },
      { label: "Case", value: "Stainless Steel" },
      { label: "Bracelet", value: "Original Stainless Steel" },
      { label: "Crystal", value: "Sapphire" },
      { label: "Dial", value: "Black" },
      { label: "Complications", value: "Chronograph, Big Date, Day, Tachymeter" },
      { label: "Water Resistance", value: "50 m" },
      { label: "Box / Papers", value: "Yes / Yes" },
    ],
    condition: "Excellent, near mint — full set",
    priceEur: 2190,
    images: [
      "/images/products/paul-picot-1.jpg",
      "/images/products/paul-picot-2.jpg",
      "/images/products/paul-picot-3.jpg",
    ],
    featured: true,
  },
  {
    id: "kuniyoshi-hanshiro-iwai-1842",
    category: "art",
    eyebrow: "Utagawa Kuniyoshi (1798-1861)",
    title: "Kabuki Actor Hanshiro Iwai",
    origin: "Japan",
    year: "circa 1842",
    description:
      "Original Japanese ukiyo-e woodblock print depicting the Kabuki actor Hanshiro Iwai. Beautiful impression with artist's signature and seals. Professionally framed and preserved in very good overall condition. A fine and collectible example of 19th-century Japanese art.",
    specs: [
      { label: "Artist", value: "Utagawa Kuniyoshi (1798-1861)" },
      { label: "Subject", value: "Kabuki Actor Hanshiro Iwai" },
      { label: "Technique", value: "Woodblock print (ukiyo-e)" },
      { label: "Period", value: "circa 1842" },
      { label: "Country", value: "Japan" },
      { label: "Presentation", value: "Professionally framed" },
      { label: "Marks", value: "Artist's signature and seals" },
    ],
    condition: "Very good overall",
    priceEur: 950,
    images: [
      "/images/products/kuniyoshi-1.jpg",
      "/images/products/kuniyoshi-2.jpg",
      "/images/products/kuniyoshi-3.jpg",
    ],
    featured: true,
  },
  {
    id: "gigandet-pendant-watch",
    category: "watches",
    eyebrow: "Gigandet",
    title: "Hidden Pendant Watch",
    origin: "Switzerland",
    year: "Vintage",
    description:
      "Rare vintage Gigandet hidden pendant watch with gold-plated engraved case and tassel. Features a Swiss mechanical Incabloc movement and a concealed rectangular dial. In very good vintage condition and in working order. A unique and collectible piece for vintage watch enthusiasts.",
    specs: [
      { label: "Brand", value: "Gigandet" },
      { label: "Type", value: "Hidden pendant watch" },
      { label: "Movement", value: "Swiss mechanical, Incabloc" },
      { label: "Case", value: "Gold-plated, engraved, with tassel" },
      { label: "Dial", value: "Concealed rectangular" },
      { label: "Origin", value: "Swiss Made" },
    ],
    condition: "Very good vintage, in working order",
    priceEur: 450,
    images: [
      "/images/products/gigandet-1.jpg",
      "/images/products/gigandet-2.jpg",
    ],
    featured: true,
  },
];

export const productById = (id: string) => products.find((p) => p.id === id);

export const productsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

// -------------------------------- Pricing ---------------------------------

// EUR is the settlement currency — everything is priced and charged in EUR.
// USD/CHF display conversion is a separate piece of work and needs an FX rate
// source decided first; this helper is the single place that changes when it
// lands, so no template touches the raw number.
export const formatPrice = (eur: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: eur % 1 === 0 ? 0 : 2,
  }).format(eur);

// ---------------------------- Homepage banner -----------------------------

export const auction = {
  // Hidden for now: Zac has no live auction. Flip to true and refresh the
  // title, city, date and href to show a real event banner on the homepage.
  visible: false,
  eyebrow: "Upcoming Auction",
  title: "The Geneva Watch Auction: IX",
  city: "Geneva",
  date: "11 May 2025",
  image: "/images/auction-watch.svg",
  href: "/collection/watches",
};
