'use client'

import { Suspense } from 'react'
import { SuccessContent } from '@/components/checkout/success-content'

export default function SuccessPage() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
} 
