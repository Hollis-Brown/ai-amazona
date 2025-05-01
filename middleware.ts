import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname

  // Only protect checkout steps (not the cart)
  if (pathname.startsWith('/checkout/') && !pathname.includes('/checkout/cart')) {
    if (!session) {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/:path*'],
} 