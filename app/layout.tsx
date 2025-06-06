import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SessionProvider } from '@/components/providers/session-provider'
import { CartProvider } from '@/components/providers/cart-provider'
import { cn } from '@/lib/utils'
import { Toaster as SonnerToaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'History Beyond Headlines',
  description: 'Your one-stop shop for AI courses',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen font-sans antialiased',
          inter.className
        )}
      >
        <SessionProvider>
          <CartProvider>
            {children}
            <Toaster />
            <SonnerToaster />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
