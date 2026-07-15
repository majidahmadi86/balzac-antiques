// Prisma client singleton — survives Next dev hot-reloads without exhausting
// MySQL connections. Import { db } from "@/lib/db" everywhere.
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
