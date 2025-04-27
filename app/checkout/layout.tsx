'use client'

import { ReactNode } from 'react'
import { CheckoutProgress } from '@/components/checkout/checkout-progress'
import { usePathname } from 'next/navigation'

interface CheckoutLayoutProps {
  children: ReactNode
}

// You can change these words here to whatever you want
const steps = ["Cart", "Information", "Payment", "Review", "Confirmation"]

const stepPaths = {
  '/checkout/cart': 0,
  '/checkout': 1,
  '/checkout/payment': 2,
  '/checkout/review': 3,
  '/checkout/confirmation': 4,
}

export default function CheckoutLayout({ children }: CheckoutLayoutProps) {
  const pathname = usePathname()
  const currentStep = stepPaths[pathname as keyof typeof stepPaths] || 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl py-8 px-4 md:px-8">
        <div className="mb-8">
          <CheckoutProgress currentStep={currentStep} steps={steps} />
        </div>
        {children}
      </div>
    </div>
  )
} 