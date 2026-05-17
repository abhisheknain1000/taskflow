import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/admin"];
const authPaths = ["/auth/login", "/auth/signup"];

function getDashboardPath(role: string | undefined) {
  return role === "admin" ? "/admin/dashboard" : "/dashboard";
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  const isProtected = protectedPrefixes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authPaths.some((route) => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith("/admin");

  if (isProtected && !token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && token && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(
      new URL(getDashboardPath(role), request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
    "/auth/login",
    "/auth/signup",
  ],
};
