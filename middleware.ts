import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

// Add paths that require authentication
const protectedPaths = [
  "/dashboard",
  "/profile",
  "/orders",
  "/admin",
  "/api/checkout",
  "/cart",
  "/checkout",
  "/products/[id]", // Protect individual product pages
  "/api/cart", // Protect cart API endpoints
  "/payment" // Protect payment pages
]

export async function middleware(request: NextRequest) {
  const session = await auth()

  const { pathname } = request.nextUrl

  // Check if the path is protected
  const isProtectedPath = protectedPaths.some(path => {
    // Handle dynamic routes like /products/[id]
    if (path.includes('[') && path.includes(']')) {
      const pattern = new RegExp('^' + path.replace(/\[.*?\]/g, '[^/]+') + '$')
      return pattern.test(pathname)
    }
    return pathname.startsWith(path)
  })
  
  // Redirect to signin if accessing protected route without auth
  if (isProtectedPath && !session) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }
  
  // Redirect to home if authenticated user tries to access auth pages
  if (session && pathname.startsWith("/auth")) {
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
     * - Cart and checkout routes
     */
    "/dashboard/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/admin/:path*",
    "/api/checkout/:path*", // Match the checkout API route
    "/auth/:path*",
    "/cart/:path*",
    "/checkout/:path*",
    "/payment/:path*",
    "/products/:path*", // Match product pages
  ],
}
