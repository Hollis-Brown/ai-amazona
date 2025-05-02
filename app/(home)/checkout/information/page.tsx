'use client'

import { useCart, selectTotal } from '@/store/use-cart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Image from 'next/image'

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
})

type FormData = z.infer<typeof formSchema>

export default function InformationPage() {
  const cart = useCart()
  const total = useCart(selectTotal)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      router.push('/checkout/review')
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  if (cart.items.length === 0) {
    return (
      <div className='container mx-auto px-4 py-16'>
        <Card>
          <CardHeader>
            <CardTitle>Your cart is empty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              Add some courses to your cart to proceed to checkout.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Input
                      placeholder='First Name'
                      {...register('firstName')}
                      error={errors.firstName?.message}
                    />
                  </div>
                  <div>
                    <Input
                      placeholder='Last Name'
                      {...register('lastName')}
                      error={errors.lastName?.message}
                    />
                  </div>
                </div>
                <Input
                  type='email'
                  placeholder='Email'
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Continue to Payment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className='flex items-center gap-4 py-4 border-b last:border-0'
                  >
                    <div className='relative aspect-square h-16 w-16 flex-shrink-0 overflow-hidden rounded-md'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex flex-1 flex-col'>
                      <div className='font-medium'>{item.name}</div>
                      <div className='text-sm text-muted-foreground'>
                        Quantity: {item.quantity}
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium'>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
                <div className='pt-4 border-t'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>Total</span>
                    <span className='text-lg font-bold'>
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 