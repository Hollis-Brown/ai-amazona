import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// Add paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/profile",
  "/orders",
  "/admin",
  "/api/checkout" // Protect the checkout API instead of the page
]

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  // Redirect to signin if accessing protected route without auth
  if (isProtectedPath && !token) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // Redirect to home if authenticated user tries to access auth pages
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  
  return NextResponse.next()
}

// Update matcher to only include paths we want to protect
export const config = {
  matcher: [
    /*
     * Match:
     * - Protected routes (/dashboard, /profile, etc.)
     * - Auth routes (/auth/*)
     */
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
    "/api/checkout/:path*", // Match the checkout API route
    "/auth/:path*",
  ],
}
