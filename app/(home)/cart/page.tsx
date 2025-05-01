'use client'

import { CartItem } from '@/components/cart/cart-item'
import { CartSummary } from '@/components/cart/cart-summary'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { CheckoutSteps } from '@/components/checkout/checkout-steps'

export default function CartPage() {
  const { items } = useCartStore()

  if (items.length === 0) {
    return (
      <div className="container py-8">
        <CheckoutSteps currentStep={0} />
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <ShoppingCart className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Your cart is empty</h2>
          <p className="text-muted-foreground">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <CheckoutSteps currentStep={0} />
      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  )
} 