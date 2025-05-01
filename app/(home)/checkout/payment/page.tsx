'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { PaymentForm } from '@/components/checkout/payment-form'
import { formatPrice } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage() {
  const router = useRouter()
  const { total } = useCartStore()
  const [clientSecret, setClientSecret] = useState<string>()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        if (!total || total <= 0) {
          setError('Invalid order total')
          return
        }

        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: total }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to create payment intent')
        }

        const { paymentIntent } = await response.json()
        if (!paymentIntent?.client_secret) {
          throw new Error('Invalid payment intent response')
        }

        setClientSecret(paymentIntent.client_secret)
      } catch (error) {
        console.error('Error creating payment intent:', error)
        setError(error instanceof Error ? error.message : 'Failed to initialize payment')
      } finally {
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [total])

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-40 space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    )
  }

  if (isLoading || !clientSecret) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  const options = {
    clientSecret,
    appearance: {
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
    },
  }

  return (
    <div className="container max-w-xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Payment</h1>
        <p className="mt-2 text-muted-foreground">
          Complete your purchase with a secure payment.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm orderId={clientSecret} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  )
} 
