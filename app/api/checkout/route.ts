/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

// Check if Stripe API key is available
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not defined in environment variables')
}

// Initialize Stripe with a fallback for development
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { items, shippingAddress } = body

    if (!items?.length || !shippingAddress) {
      return new NextResponse('Bad request', { status: 400 })
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: 'PENDING',
        total: items.reduce(
          (total: number, item: any) => total + item.price * item.quantity,
          0
        ),
        addressId: shippingAddress.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    })

    // Check if Stripe is initialized
    if (!stripe) {
      console.error('Stripe is not initialized. Please set STRIPE_SECRET_KEY in your environment variables.')
      return new NextResponse('Payment processing is not configured', { status: 503 })
    }

    // Create Stripe payment intent
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }))

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(
        (order.total + order.total * 0.1 + 10) * 100 // Total + 10% tax + $10 shipping
      ),
      currency: 'usd',
      metadata: {
        orderId: order.id,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    })
  } catch (error) {
    console.error('[CHECKOUT_ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
