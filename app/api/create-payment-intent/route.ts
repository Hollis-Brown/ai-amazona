import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { CartItem } from '@/lib/store/cart'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

interface CustomerDetails {
  email: string
  name: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { items, email, name }: { items: CartItem[]; email: string; name: string } = body

    if (!items?.length) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const amount = items.reduce(
      (total: number, item: CartItem) => total + item.product.price * item.quantity,
      0
    )

    const customerDetails: CustomerDetails = { email, name }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId: '',
        items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          }))
        ),
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Payment intent error:', error)
    return NextResponse.json(
      { error: 'Error creating payment intent' },
      { status: 500 }
    )
  }
} 
