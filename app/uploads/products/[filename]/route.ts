import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "products");
const SAFE = /^[a-zA-Z0-9._-]+$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  if (!SAFE.test(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const abs = path.join(UPLOAD_DIR, filename);
  // Ensure resolved path stays inside UPLOAD_DIR (no traversal)
  if (!abs.startsWith(UPLOAD_DIR + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    await stat(abs);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const buf = await readFile(abs);
  const ext = path.extname(filename).toLowerCase();
  const type =
    ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
