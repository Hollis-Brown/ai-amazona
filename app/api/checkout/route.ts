import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { CartItem } from '@/lib/store/cart'

export async function POST(req: Request) {
  try {
    const { items, customerDetails } = await req.json()

    if (!items?.length) {
      return new NextResponse('No items in cart', { status: 400 })
    }

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerDetails.email,
      line_items: items.map((item: CartItem) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            images: [item.product.images[0]],
            description: 'Digital course access',
          },
          unit_amount: Math.round(item.product.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
      metadata: {
        email: customerDetails.email,
        name: customerDetails.name,
      },
    })

    return NextResponse.json({ sessionId: stripeSession.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
