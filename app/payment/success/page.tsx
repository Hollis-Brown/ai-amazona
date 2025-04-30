'use client'

import { Suspense } from 'react'
import { PaymentSuccessContent } from '@/components/payment/payment-success-content'

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto max-w-6xl flex min-h-[60vh] flex-col items-center justify-center py-8 px-4 md:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  )
} 
