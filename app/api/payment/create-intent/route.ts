import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, metadata } = body

    if (!amount || amount <= 0) {
      return new NextResponse('Invalid amount', { status: 400 })
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount is already in cents
      currency: 'usd',
      metadata,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Payment intent creation error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 