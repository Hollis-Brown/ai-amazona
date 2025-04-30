'use client'

import { Suspense } from 'react'
import { PaymentContent } from '@/components/payment/payment-content'

export default function PaymentPage() {
  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 md:px-8">
      <h1 className="mb-8 text-3xl font-bold">Complete Payment</h1>
      <Suspense fallback={<div>Loading payment form...</div>}>
        <PaymentContent />
      </Suspense>
    </div>
  )
} 
