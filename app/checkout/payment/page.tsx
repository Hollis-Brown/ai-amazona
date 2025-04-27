'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PaymentForm } from '@/components/checkout/payment-form'
import { OrderSummary } from '@/components/checkout/order-summary'

export default function PaymentPage() {
  const router = useRouter()
  const items = useCartStore((state) => state.items)

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items, router])

  if (items.length === 0) {
    return null
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
              <PaymentForm />
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