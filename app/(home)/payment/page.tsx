'use client'

import { useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { PaymentForm } from "@/components/payment/payment-form"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { useCartStore } from "@/lib/store/cart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getTotalPrice } = useCartStore()

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        // Get checkout info from local storage
        const checkoutInfo = localStorage.getItem('checkoutInfo')
        if (!checkoutInfo) {
          router.push('/info')
          return
        }

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(getTotalPrice() * 100), // Convert to cents
            metadata: {
              email: JSON.parse(checkoutInfo).email,
            }
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create payment intent")
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error) {
        console.error("Error creating payment intent:", error)
        setError(error instanceof Error ? error.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [getTotalPrice, router])

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <CheckoutSteps currentStep={2} />
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-6xl py-8">
        <CheckoutSteps currentStep={2} />
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/cart')}>
            Back to Cart
          </Button>
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="container max-w-6xl py-8">
        <CheckoutSteps currentStep={2} />
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to initialize payment. Please try again.</AlertDescription>
          </Alert>
          <Button onClick={() => router.push('/cart')}>
            Back to Cart
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      <CheckoutSteps currentStep={2} />
      <div className="mt-8">
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance,
            loader: 'auto',
          }}
        >
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      </div>
    </div>
  )
} 