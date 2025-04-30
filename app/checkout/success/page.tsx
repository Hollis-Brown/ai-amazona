'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      router.push('/cart')
      return
    }

    // Clear the cart after successful payment
    clearCart()
  }, [clearCart, router, searchParams])

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="mb-6 text-green-500">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
        <p className="mb-8 text-center text-muted-foreground">
          Thank you for your purchase. You&apos;ll receive an email confirmation shortly.
        </p>
        <Button asChild>
          <Link href="/dashboard">View Your Courses</Link>
        </Button>
      </div>
    </div>
  )
} 
