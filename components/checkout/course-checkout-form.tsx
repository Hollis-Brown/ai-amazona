'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/lib/store/cart'
import { useToast } from '@/hooks/use-toast'
import { PaymentForm } from './payment-form'
import { useSession } from 'next-auth/react'

const courseCheckoutSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
})

type CourseCheckoutValues = z.infer<typeof courseCheckoutSchema>

export function CourseCheckoutForm() {
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()

  const form = useForm<CourseCheckoutValues>({
    resolver: zodResolver(courseCheckoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  })

  const items = useCartStore((state) => state.items)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice)

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  async function onSubmit(data: CourseCheckoutValues) {
    try {
      setLoading(true)

      // Check if user is logged in
      if (!session?.user) {
        // Store form data in localStorage to retrieve after login
        localStorage.setItem('checkoutData', JSON.stringify(data))
        // Redirect to login page with return URL
        router.push('/api/auth/signin?callbackUrl=/checkout')
        return
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          userInfo: data,
          subtotal,
          tax,
          total,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const { orderId } = await response.json()
      setOrderId(orderId)
      
      toast({
        title: "Order created successfully",
        description: "Please complete your payment to access your courses.",
      })
    } catch (error) {
      console.error('[CHECKOUT_FORM]', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  // Check if we have stored checkout data after login
  useEffect(() => {
    if (session?.user) {
      const storedData = localStorage.getItem('checkoutData')
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          form.reset(parsedData)
          localStorage.removeItem('checkoutData')
        } catch (e) {
          console.error('Failed to parse stored checkout data', e)
        }
      }
    }
  }, [session, form])

  return (
    <div className="space-y-8">
      {!orderId ? (
        <>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Your Information</h3>
            <p className="text-sm text-muted-foreground">
              Please provide your details to create your order.
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder='John Doe' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder='john@example.com' type='email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Creating Order...' : 'Continue to Payment'}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Payment Details</h3>
            <p className="text-sm text-muted-foreground">
              Complete your payment to access your courses.
            </p>
          </div>
          
          <PaymentForm orderId={orderId} />
        </>
      )}
    </div>
  )
} 
