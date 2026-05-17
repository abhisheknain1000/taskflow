import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Get the token from cookies
  const token = request.cookies.get("token");
  const pathname = request.nextUrl.pathname;

  // 2. Define protected routes
  const protectedRoutes = ["/dashboard", "/admin"];

  // 3. Check if the current path is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 4. Redirect to login if accessing a protected route without a token
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 5. Allow the request to proceed
  return NextResponse.next();
}

// ✅ FIX: Clean and non-nested matcher configuration
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
  ],
};