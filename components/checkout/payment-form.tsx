'use client'

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
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const formSchema = z.object({
  cardNumber: z.string().min(16, {
    message: 'Please enter a valid card number.',
  }),
  expiryDate: z.string().min(5, {
    message: 'Please enter a valid expiry date (MM/YY).',
  }),
  cvc: z.string().min(3, {
    message: 'Please enter a valid CVC.',
  }),
})

type FormValues = z.infer<typeof formSchema>

export function PaymentForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
  })

  async function onSubmit(values: FormValues) {
    if (isSubmitting) return
    
    try {
      setIsSubmitting(true)
      
      // Mock successful payment processing
      console.log('Processing payment:', values)
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store payment info in session (you might want to handle this differently in production)
      sessionStorage.setItem('paymentProcessed', 'true')
      
      // Navigate to review page
      router.push('/checkout/review')
    } catch (error) {
      console.error('Payment error:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Card Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="1234 5678 9012 3456" 
                  {...field} 
                  maxLength={16}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expiry Date</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="MM/YY" 
                    {...field} 
                    maxLength={5}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CVC</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123" 
                    {...field} 
                    maxLength={4}
                    type="password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Continue to Review'}
        </Button>
      </form>
    </Form>
  )
}
