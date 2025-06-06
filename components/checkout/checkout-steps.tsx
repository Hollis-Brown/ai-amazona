'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CheckoutStepsProps {
  currentStep: number
}

const steps = [
  { id: 0, name: 'Cart', path: '/cart' },
  { id: 1, name: 'Info', path: '/info' },
  { id: 2, name: 'Payment', path: '/payment' },
  { id: 3, name: 'Review', path: '/review' },
  { id: 4, name: 'Confirmation', path: '/confirmation' },
]

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  return (
    <div className="flex items-center justify-between py-8">
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={cn(
            'flex flex-col items-center',
            index < steps.length - 1 && 'flex-1'
          )}
        >
          <div className="flex items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full',
                currentStep >= step.id
                  ? 'bg-black text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {currentStep > step.id ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 flex-1',
                  currentStep > step.id ? 'bg-black' : 'bg-muted'
                )}
              />
            )}
          </div>
          <span
            className={cn(
              'mt-2 text-sm font-medium',
              currentStep >= step.id ? 'text-black font-bold' : 'text-muted-foreground'
            )}
          >
            {step.name}
          </span>
        </div>
      ))}
    </div>
  )
} 