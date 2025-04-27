'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'

export default function ConfirmationPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  const [orderItems, setOrderItems] = useState(items)

  useEffect(() => {
    // Check if we have a completed order
    const hasCompletedOrder = sessionStorage.getItem('orderCompleted')
    
    if (!hasCompletedOrder) {
      router.replace('/cart')
      return
    }

    // Store the current items for display
    setOrderItems(items)
  }, [items, router])

  const handleReturnHome = () => {
    // Clear cart and order completion status before returning home
    clearCart()
    sessionStorage.removeItem('orderCompleted')
    router.push('/products')  // Navigate to the homepage
  }

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 md:px-8">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Thank you for your purchase. You will receive an email with your course access details shortly.
          </p>

          {/* Order Summary */}
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-lg text-left">Order Summary</h3>
            <div className="divide-y divide-border rounded-lg border">
              {orderItems.map((item) => (
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

          <div className="pt-6">
            <Button onClick={handleReturnHome} className="w-full">
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 