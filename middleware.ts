// middleware.ts
import { AUTH_COOKIE } from "@/lib/config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Get the auth token from the request cookies
  const authToken = request.cookies.get(AUTH_COOKIE); // Use your actual cookie name

  // 2. Define the pages you want to block for logged-in users
  const authRoutes = ["/sign-in", "/sign-up"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 3. Check for the token (simple check, full verification is slow and better done in protected routes)
  if (authToken && isAuthRoute) {
    // Token is present, redirect to dashboard
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. If not logged in, or on any other route, proceed
  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: ["/sign-in/:path*", "/sign-up/:path*"],
};
