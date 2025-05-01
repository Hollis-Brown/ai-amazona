import { NextResponse } from 'next/server'
import { createPaymentIntent, confirmPayment } from '@/lib/stripe'
import { auth } from '@/auth'
import { db } from '@/lib/db'

// Check if Stripe API key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { amount, paymentIntentId } = body

    if (!amount || amount <= 0) {
      return new NextResponse('Invalid amount', { status: 400 })
    }

    if (paymentIntentId) {
      // Confirm existing payment intent
      const paymentIntent = await confirmPayment(paymentIntentId)
      return NextResponse.json({ paymentIntent })
    } else {
      // Create new payment intent
      const paymentIntent = await createPaymentIntent(amount)
      
      if (!paymentIntent?.client_secret) {
        throw new Error('Failed to create payment intent')
      }

      return NextResponse.json({ 
        paymentIntent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status
        }
      })
    }
  } catch (error) {
    console.error('Payment error:', error)
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal error', 
      { status: 500 }
    )
  }
}
