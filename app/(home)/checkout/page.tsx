import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export default async function CheckoutPage() {
  const session = await auth()

  if (!session?.user) {
    // Redirect to information page
    redirect('/info')
  }

  // If user is authenticated, redirect to address page
  redirect('/checkout/address')
} 
