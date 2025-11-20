// middleware.js → Place this in your project root (next to package.json)
import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;
    const role = request.cookies.get("userRole")?.value;

    if (!token || role !== "admin") {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
