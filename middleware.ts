// Guards every /admin route. Unauthenticated -> /admin/login (with ?next= return path).
// Already-authenticated visits to /admin/login bounce to /admin.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "./lib/session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session && !isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (session && isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/admin"],
};
