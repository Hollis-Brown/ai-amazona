'use client'

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface CheckoutProgressProps {
  steps: string[]
  currentStep: number
}

export function CheckoutProgress({ steps, currentStep }: CheckoutProgressProps) {
  return (
    <nav
      aria-label="Checkout progress"
      className="relative mx-auto mb-8 max-w-2xl"
    >
      <ol
        role="list"
        className="flex items-center justify-between gap-4 text-sm font-medium text-muted-foreground"
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isConfirmation = step === "Confirmation"

          return (
            <li
              key={step}
              className={cn(
                "relative flex w-full items-center justify-center",
                index !== steps.length - 1 && "after:absolute after:left-[calc(50%+16px)] after:top-4 after:h-[2px] after:w-[calc(100%-16px)] after:bg-muted",
                isCompleted && "after:bg-primary"
              )}
            >
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && !isConfirmation && "border-primary",
                    isCurrent && isConfirmation && "border-black bg-black text-white",
                    !isCompleted && !isCurrent && "border-muted"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted || (isCurrent && isConfirmation) ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span
                      className={cn(
                        "text-sm",
                        isCurrent && !isConfirmation && "text-primary",
                        !isCompleted && !isCurrent && "text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                  <span className="sr-only">
                    {step}
                    {isCompleted && " (completed)"}
                    {isCurrent && " (current)"}
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-2 text-center text-sm",
                    isCompleted && "text-primary",
                    isCurrent && "font-medium text-foreground",
                    !isCompleted && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
} 