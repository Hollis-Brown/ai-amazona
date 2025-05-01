'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const steps = [
  { name: 'Information', path: '/info' },
  { name: 'Payment', path: '/checkout/payment' },
  { name: 'Review', path: '/checkout/review' },
  { name: 'Confirmation', path: '/checkout/confirmation' },
]

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol role="list" className="flex items-center justify-center">
                {steps.map((step, index) => {
                  const isActive = pathname === step.path
                  const isCompleted = steps.findIndex(s => s.path === pathname) > index

                  return (
                    <li key={step.name} className="relative">
                      {index !== steps.length - 1 && (
                        <div
                          className={`absolute left-4 top-4 -ml-px mt-0.5 h-0.5 w-8 ${
                            isCompleted ? 'bg-primary' : 'bg-gray-300'
                          }`}
                        />
                      )}
                      <div className="group relative flex items-start">
                        <span className="flex h-9 items-center">
                          <span
                            className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${
                              isCompleted
                                ? 'bg-primary'
                                : isActive
                                ? 'border-2 border-primary'
                                : 'border-2 border-gray-300'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            ) : (
                              <Circle
                                className={`h-5 w-5 ${
                                  isActive ? 'text-primary' : 'text-gray-300'
                                }`}
                              />
                            )}
                          </span>
                        </span>
                        <span className="ml-4 flex min-w-0 flex-col">
                          <span
                            className={`text-sm font-medium ${
                              isActive ? 'text-primary' : 'text-gray-500'
                            }`}
                          >
                            {step.name}
                          </span>
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ol>
            </nav>
          </div>
          <div className="mt-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 