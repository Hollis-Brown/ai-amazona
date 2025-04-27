'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function ReviewPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  useEffect(() => {
    // Check if payment was processed
    const paymentProcessed = sessionStorage.getItem('paymentProcessed')
    if (!paymentProcessed) {
      router.replace('/checkout/payment')
      return
    }

    if (items.length === 0) {
      router.replace('/cart')
    }
  }, [items, router])

  const handleConfirmPurchase = () => {
    // Set order completion flag and clear payment processed flag
    sessionStorage.setItem('orderCompleted', 'true')
    sessionStorage.removeItem('paymentProcessed')
    router.push('/checkout/confirmation')
  }

  const handleGoBack = () => {
    router.push('/checkout/payment')
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 md:px-8">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Review Your Purchase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Please review your order details before confirming your purchase.
          </p>

          {/* Order Summary */}
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg text-left">Order Summary</h3>
            <div className="divide-y divide-border rounded-lg border">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col text-left">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between border-t pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={handleGoBack} 
              className="flex-1"
            >
              Back to Payment
            </Button>
            <Button 
              onClick={handleConfirmPurchase} 
              className="flex-1"
            >
              Confirm Purchase
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 