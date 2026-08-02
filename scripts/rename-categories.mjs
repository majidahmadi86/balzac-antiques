// One-off, idempotent, and refuses to do damage.
//
// Renames the two category rows IN PLACE. Deleting and recreating would trip
// the Product.categoryId foreign key if anything were filed under them, and
// would lose sortOrder. Renaming keeps every relation intact, so if the client
// has already filed a piece under Objects it would silently become Properties,
// which is why the script stops rather than guessing.

import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

const MOVES = [
  { from: "design", to: "fashion", labelEn: "Fashion", labelFr: "Mode", image: "/images/category-fashion.svg" },
  { from: "objects", to: "properties", labelEn: "Properties", labelFr: "Propriétés", image: "/images/category-properties.svg" },
];

let changed = 0;
for (const m of MOVES) {
  const existing = await db.category.findUnique({ where: { slug: m.to } });
  if (existing) {
    console.log(`SKIP ${m.from} -> ${m.to}: target slug already exists (id ${existing.id})`);
    continue;
  }
  const row = await db.category.findUnique({
    where: { slug: m.from },
    select: { id: true, _count: { select: { products: true } } },
  });
  if (!row) {
    console.log(`SKIP ${m.from}: not found, nothing to rename`);
    continue;
  }
  if (row._count.products > 0) {
    console.error(`ABORT ${m.from}: ${row._count.products} product(s) attached. Reassign them first.`);
    await db.$disconnect();
    process.exit(1);
  }
  await db.category.update({
    where: { id: row.id },
    data: { slug: m.to, labelEn: m.labelEn, labelFr: m.labelFr, image: m.image },
  });
  console.log(`OK ${m.from} -> ${m.to} (id ${row.id})`);
  changed++;
}
console.log(`done, ${changed} row(s) renamed`);
await db.$disconnect();
