'use client'

import { Suspense } from 'react'
import { CheckoutSteps } from '@/components/checkout/checkout-steps'
import { CartContent } from '@/components/checkout/cart-content'

export default function CartPage() {
  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 md:px-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      <CheckoutSteps currentStep={1} />
      <Suspense fallback={<div>Loading cart...</div>}>
        <CartContent />
      </Suspense>
    </div>
  )
} 
