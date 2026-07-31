import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// Serves photographs attached to acquisition offers. Same pattern as the
// product image route: the files live outside the public folder and are
// streamed through here with a strict filename guard.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "enquiries");
const SAFE = /^[a-zA-Z0-9._-]+$/;

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;
  if (!SAFE.test(filename)) return new NextResponse("Not found", { status: 404 });

  const abs = path.join(UPLOAD_DIR, filename);
  if (!abs.startsWith(UPLOAD_DIR + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    await stat(abs);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const buf = await readFile(abs);
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
