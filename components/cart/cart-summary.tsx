'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function CartSummary() {
  const router = useRouter()
  const { getTotalPrice, items } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const total = getTotalPrice()

  const handleProceedToCheckout = async () => {
    setIsLoading(true)
    try {
      // Proceed directly to info page
      router.push('/info')
    } finally {
      setIsLoading(false)
    }
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
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Proceed to Checkout'}
      </Button>
    </div>
  )
} 