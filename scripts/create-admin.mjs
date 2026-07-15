// Create the first admin user, or reset an existing one's password (upsert).
//
// Usage (run on the VPS as the balzac user, from the project root):
//   node scripts/create-admin.mjs balzacbangkok@gmail.com "A-Strong-Password"
//
// Requires .env with DATABASE_URL (already present) and `npx prisma generate` run at least once.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const [emailArg, passwordArg] = process.argv.slice(2);

if (!emailArg || !passwordArg) {
  console.error('Usage: node scripts/create-admin.mjs <email> "<password>"');
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error(`Not a valid email: ${email}`);
  process.exit(1);
}
if (passwordArg.length < 10) {
  console.error("Password must be at least 10 characters.");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const passwordHash = await bcrypt.hash(passwordArg, 12);
  // Schema requires `name` (not in the base prompt); default from email local-part.
  const name = email.split("@")[0] || "Admin";
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name },
  });
  console.log(`Admin ready: ${admin.email} (id ${admin.id})`);
  console.log("If this email already existed, its password has been reset.");
} finally {
  await prisma.$disconnect();
}
