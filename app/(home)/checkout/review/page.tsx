'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export default function ReviewPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)

  const handlePlaceOrder = async () => {
    setIsLoading(true)
    try {
      // Create order in database
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          total,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      // Clear cart and redirect to confirmation
      clearCart()
      router.push('/checkout/confirmation')
    } catch (error) {
      console.error('Error placing order:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      Access: Lifetime
                    </p>
                  </div>
                </div>
                <p className="font-medium">
                  {formatPrice(item.price)}
                </p>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-medium">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Credit Card</p>
            <p className="text-sm text-gray-500">Payment will be processed securely through Stripe</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push('/checkout/payment')}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button onClick={handlePlaceOrder} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Complete Purchase'
          )}
        </Button>
      </div>
    </div>
  )
} 
