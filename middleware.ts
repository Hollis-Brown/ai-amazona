import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Protect payment page
  if (pathname.startsWith('/checkout/payment')) {
    if (!token) {
      const url = new URL('/auth/signin', request.url)
      url.searchParams.set('callbackUrl', '/checkout/payment')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/checkout/payment/:path*']
} 