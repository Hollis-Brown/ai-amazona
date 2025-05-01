'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function ConfirmationPage() {
  const router = useRouter()
  const { clearCart } = useCartStore()

  const handleContinueShopping = () => {
    clearCart()
    router.push('/products')
  }

  return (
    <Card className="text-center">
      <CardHeader>
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <div className="space-y-2">
          <p className="font-medium">What's Next?</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• You will receive an order confirmation email shortly</li>
            <li>• Your order will be processed and shipped within 1-2 business days</li>
            <li>• You can track your order status in your account dashboard</li>
          </ul>
        </div>
        <div className="pt-6">
          <Button onClick={handleContinueShopping} size="lg">
            Continue Shopping
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 
