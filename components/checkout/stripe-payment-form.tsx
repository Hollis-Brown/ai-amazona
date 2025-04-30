'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/lib/store/cart'
import { useToast } from '@/hooks/use-toast'

export function StripePaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const clearCart = useCartStore((state) => state.clearCart)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      })

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Payment failed',
          description: error.message || 'Something went wrong. Please try again.',
        })
        return
      }

      if (paymentIntent.status === 'succeeded') {
        // Clear cart and shipping info
        clearCart()
        sessionStorage.removeItem('shippingInfo')

        // Show success message
        toast({
          title: 'Payment successful',
          description: 'Thank you for your purchase!',
        })

        // Redirect to success page
        router.push('/checkout/success')
      }
    } catch (error) {
      console.error('Payment error:', error)
      toast({
        variant: 'destructive',
        title: 'Payment failed',
        description: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !stripe || !elements}
      >
        {isLoading ? 'Processing...' : 'Pay now'}
      </Button>
    </form>
  )
} 
