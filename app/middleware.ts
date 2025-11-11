// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/login");
  const isPublic = isAuthPage || pathname.startsWith("/api");

  // If no token and trying to access protected route → redirect to /login
  if (!token && !isPublic) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, verify it
  if (token) {
    try {
      jwt.verify(token, process.env.JWT_SECRET!); // throws if invalid or expired

      // If token valid and trying to access /login → redirect to /overview
      if (isAuthPage) {
        const overviewUrl = new URL("/overview", req.url);
        return NextResponse.redirect(overviewUrl);
      }

      return NextResponse.next(); // Allow access
    } catch {
      // Token invalid or expired → clear and redirect
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static assets and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
};
