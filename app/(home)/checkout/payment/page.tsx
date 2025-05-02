'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { PaymentForm } from '@/components/checkout/payment-form'
import { useCart } from '@/store/use-cart'
import { selectTotal } from '@/store/use-cart'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function PaymentPage() {
  const cart = useCart()
  const total = useCart(selectTotal)
  const router = useRouter()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!total || total <= 0) {
          setError('No items in cart')
          return
        }

        // Create a test payment intent
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(total * 100), // Convert to cents
            currency: 'usd',
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment intent')
        }

        if (!data.clientSecret) {
          throw new Error('No client secret received')
        }

        setClientSecret(data.clientSecret)
      } catch (err) {
        console.error('Error fetching client secret:', err)
        setError(err instanceof Error ? err.message : 'Failed to load payment form. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchClientSecret()
  }, [total])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-sm text-gray-500">Loading payment form...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center">
            <p className="text-lg font-semibold">Total Amount</p>
            <p className="text-2xl font-bold">{formatPrice(total)}</p>
          </div>
          <PaymentForm orderId={`order_${Date.now()}`} />
        </CardContent>
      </Card>
    </div>
  )
} 