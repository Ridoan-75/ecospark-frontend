import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const MEMBER_ROUTES = ["/dashboard/member"];
const ADMIN_ROUTES = ["/dashboard/admin"];
const AUTH_ROUTES = ["/login", "/register"];

type TJwtPayload = {
  id: string;
  email: string;
  role: "MEMBER" | "ADMIN";
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Auth routes — login থাকলে home এ redirect
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  const isProtected =
    MEMBER_ROUTES.some((r) => pathname.startsWith(r)) ||
    ADMIN_ROUTES.some((r) => pathname.startsWith(r));

  if (isProtected) {
    // Token নেই — login এ redirect
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const decoded = jwtDecode<TJwtPayload>(token);

      // Member admin route এ গেলে redirect
      if (
        ADMIN_ROUTES.some((r) => pathname.startsWith(r)) &&
        decoded.role !== "ADMIN"
      ) {
        return NextResponse.redirect(
          new URL("/dashboard/member", request.url)
        );
      }

      // Admin member route এ গেলে redirect
      if (
        MEMBER_ROUTES.some((r) => pathname.startsWith(r)) &&
        decoded.role !== "MEMBER"
      ) {
        return NextResponse.redirect(
          new URL("/dashboard/admin", request.url)
        );
      }
    } catch {
      const response = NextResponse.redirect(
        new URL("/login", request.url)
      );
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};