'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/store/use-cart'
import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function CartBadge() {
  const cart = useCart()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0)
  const hasClearedCart = useRef(false)

  // Clear cart when order is confirmed and reset when leaving confirmation page
  useEffect(() => {
    const isConfirmationPage = pathname === '/checkout/confirmation'
    const hasOrderId = searchParams.get('order_id')

    if (isConfirmationPage && hasOrderId && !hasClearedCart.current) {
      // Clear cart when order is confirmed
      hasClearedCart.current = true
      cart.clearCart()
    } else if (!isConfirmationPage) {
      // Reset the flag when leaving confirmation page
      hasClearedCart.current = false
    }
  }, [pathname, searchParams, cart])

  return (
    <Button variant='ghost' size='icon' asChild className='relative'>
      <Link href='/cart'>
        <ShoppingCart className='h-5 w-5' />
        {itemCount > 0 && (
          <span className='absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
            {itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
