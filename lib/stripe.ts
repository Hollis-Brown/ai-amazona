import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export async function createPaymentIntent(amount: number) {
  if (!amount || amount <= 0) {
    throw new Error('Invalid amount')
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        amount: amount.toString(),
      },
    })

    if (!paymentIntent?.client_secret) {
      throw new Error('Failed to create payment intent')
    }

    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

export async function confirmPayment(paymentIntentId: string) {
  if (!paymentIntentId) {
    throw new Error('Payment intent ID is required')
  }

  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId)
    return paymentIntent
  } catch (error) {
    console.error('Error confirming payment:', error)
    throw error
  }
} 
