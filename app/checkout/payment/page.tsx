'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentForm } from '@/components/checkout/payment-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function PaymentPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isCreatingOrder, setIsCreatingOrder] = useState(false)

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  useEffect(() => {
    const createOrder = async () => {
      if (items.length === 0 || orderId) return

      try {
        setIsCreatingOrder(true)
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
            userInfo: {
              fullName: 'Digital Customer',
              email: 'digital@example.com',
            },
            total: items.reduce(
              (sum, item) => sum + item.product.price * item.quantity,
              0
            ),
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to create order')
        }

        const data = await response.json()
        setOrderId(data.orderId)
      } catch (error) {
        console.error('Error creating order:', error)
      } finally {
        setIsCreatingOrder(false)
      }
    }

    createOrder()
  }, [items, orderId])

  if (items.length === 0) {
    return null
  }

  if (isCreatingOrder) {
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4 md:px-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Creating order...</span>
        </div>
      </div>
    )
  }

  if (!orderId) {
    return (
      <div className="container mx-auto max-w-6xl py-12 px-4 md:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p>Failed to create order. Please try again.</p>
          <Button onClick={() => router.push('/cart')}>Back to Cart</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 md:px-8">
      <h1 className="mb-8 text-3xl font-bold">Payment</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr,1.5fr]">
        <div className="h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentForm orderId={orderId} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummary />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
