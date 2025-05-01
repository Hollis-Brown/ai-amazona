'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'

export function CartSummary() {
  const router = useRouter()
  const { getTotalPrice, items } = useCartStore()
  const total = getTotalPrice()

  const handleProceedToCheckout = () => {
    router.push('/info')
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <Button
        className="w-full"
        onClick={handleProceedToCheckout}
      >
        Proceed to Checkout
      </Button>
    </div>
  )
} 