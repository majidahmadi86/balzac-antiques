// -----------------------------------------------------------------------
// PLACEHOLDER DATA LAYER
// This hardcoded data stands in for the admin-panel/database content
// described in the contract (products, categories, auctions editable by
// the client). Once the admin panel + DB are built, replace these
// exports with real data fetches — the page components below should not
// need to change shape, only where they get their data from.
// -----------------------------------------------------------------------

export type Category = {
  slug: string;
  label: string;
  image: string;
  featured?: boolean; // shown in the homepage "Exceptional Pieces" teaser grid
};

// Full category set per the client's written brief (Balzac_Antiques_Website_Brief_Final.docx).
// Reference screenshots only illustrated 4 of these (Books/Watches/Posters/Pop
// Culture) as a style example, not the full list — the brief is the source of
// truth for actual scope here.
export const categories: Category[] = [
  { slug: "books", label: "Books", image: "/images/category-books.svg", featured: true },
  { slug: "art", label: "Art", image: "/images/category-art.svg" },
  { slug: "watches", label: "Watches", image: "/images/category-watches.svg", featured: true },
  { slug: "music", label: "Music", image: "/images/category-music.svg" },
  { slug: "furniture", label: "Furniture", image: "/images/category-furniture.svg", featured: true },
  { slug: "design", label: "Design", image: "/images/category-design.svg" },
  { slug: "objects", label: "Objects", image: "/images/category-objects.svg", featured: true },
  { slug: "curiosities", label: "Curiosities", image: "/images/category-curiosities.svg" },
];

export type Product = {
  id: string;
  brand: string;
  model: string;
  reference: string;
  title: string;
  location: string;
  year: string;
  description: string;
  caseMaterial: string;
  movement: string;
  caseSize: string;
  condition: string;
  boxPapers: string;
  price: string;
  currency: string;
  images: string[];
};

export const products: Product[] = [
  {
    id: "patek-philippe-1463",
    brand: "Patek Philippe",
    model: "Chronograph",
    reference: "1463",
    title: "Chronograph Ref. 1463",
    location: "Geneva, Switzerland",
    year: "circa 1965",
    description:
      "An exceptional and highly collectible example of the Patek Philippe Ref. 1463 in 18k yellow gold. Powered by the iconic manual-winding caliber 13\u2074\u2075\u2074. A timeless classic for the discerning collector.",
    caseMaterial: "18K Yellow Gold",
    movement: "Manual Wind Caliber 13\u2034",
    caseSize: "36 mm",
    condition: "Excellent",
    boxPapers: "No / No",
    price: "48,000",
    currency: "CHF",
    images: [
      "/images/product-main.svg",
      "/images/product-thumb-1.svg",
      "/images/product-thumb-2.svg",
      "/images/product-thumb-3.svg",
    ],
  },
];

export const auction = {
  eyebrow: "Upcoming Auction",
  title: "The Geneva Watch Auction: IX",
  city: "Geneva",
  date: "11 May 2025",
  image: "/images/auction-watch.svg",
};
