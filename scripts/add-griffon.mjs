// One-off catalogue insert: product 5 (Griffon lithograph), provided by the
// client 2026-07. Idempotent — upserts by slug, clears + reinserts specs.
// FR copy drafted by the studio, PENDING the client's native review.
// Usage (as balzac, project root): node scripts/add-griffon.mjs

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const p = {
  slug: "griffon-courbevoie-lithograph",
  categorySlug: "art",
  eyebrow: "Thor · G. Elleaume, Paris",
  titleEn: "Rare Original Griffon · Courbevoie Advertising Lithograph",
  titleFr: "Rare lithographie publicitaire originale Griffon · Courbevoie",
  descriptionEn:
    "Original early 20th-century French advertising lithograph for Griffon, one of France's historic bicycle and automobile manufacturers. Designed by Thor and printed by G. Elleaume, Paris. This beautiful Belle Époque poster features both a Griffon bicycle and an early automobile, making it an outstanding piece of French advertising history. Professionally linen-backed (mounted on linen) for preservation.",
  descriptionFr:
    "Lithographie publicitaire française originale du début du XXe siècle pour Griffon, l'un des fabricants historiques de bicyclettes et d'automobiles en France. Dessinée par Thor et imprimée par G. Elleaume à Paris. Cette belle affiche Belle Époque représente à la fois une bicyclette Griffon et une automobile ancienne, ce qui en fait une pièce exceptionnelle de l'histoire de la publicité française. Entoilée par un professionnel (montée sur lin) pour sa préservation.",
  origin: "France",
  year: "Early 20th century",
  condition: "Good vintage condition, linen-backed",
  dimensions: null,
  priceEur: "1450.00",
  published: true,
  featured: false,
  specs: [
    { labelEn: "Artist", labelFr: "Artiste", valueEn: "Thor", valueFr: "Thor" },
    { labelEn: "Printer", labelFr: "Imprimeur", valueEn: "G. Elleaume, Paris", valueFr: "G. Elleaume, Paris" },
    { labelEn: "Origin", labelFr: "Origine", valueEn: "France", valueFr: "France" },
    { labelEn: "Period", labelFr: "Période", valueEn: "Early 20th century", valueFr: "Début du XXe siècle" },
    { labelEn: "Technique", labelFr: "Technique", valueEn: "Original colour lithograph", valueFr: "Lithographie couleur originale" },
  ],
};

try {
  const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
  if (!category) throw new Error(`Category "${p.categorySlug}" not found`);

  const { specs, categorySlug, ...fields } = p;
  const product = await prisma.product.upsert({
    where: { slug: p.slug },
    update: { ...fields, categoryId: category.id },
    create: { ...fields, categoryId: category.id },
  });
  await prisma.productSpec.deleteMany({ where: { productId: product.id } });
  await prisma.productSpec.createMany({
    data: specs.map((s, i) => ({ ...s, productId: product.id, sortOrder: i })),
  });
  console.log(`Griffon lithograph ready: ${product.slug}`);
} finally {
  await prisma.$disconnect();
}
