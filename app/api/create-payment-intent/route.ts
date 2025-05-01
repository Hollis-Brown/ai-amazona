import { NextResponse } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
})

interface CustomerDetails {
  email: string
  name: string
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, metadata } = body

    if (!amount) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      )
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure amount is an integer
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: metadata || {},
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      )
    }
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    )
  }
} 
