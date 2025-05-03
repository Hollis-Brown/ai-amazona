'use client'

import { useCart } from '@/store/use-cart'
import { selectTotal } from '@/store/use-cart'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { formatPrice } from '@/lib/utils'

export default function InformationPage() {
  const total = useCart(selectTotal)
  const router = useRouter()

  if (!total || total <= 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Checkout Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center">
            <p className="text-lg font-semibold">Total Amount</p>
            <p className="text-2xl font-bold">{formatPrice(total)}</p>
          </div>
          <CheckoutForm />
        </CardContent>
      </Card>
    </div>
  )
} 