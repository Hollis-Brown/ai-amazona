'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')

  return (
    <div className='container mx-auto px-4 py-16'>
      <Card>
        <CardHeader>
          <div className='flex flex-col items-center gap-4'>
            <CheckCircle2 className='h-16 w-16 text-green-500' />
            <CardTitle className='text-center'>Order Confirmed!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='text-center space-y-2'>
            <p className='text-muted-foreground'>
              Thank you for your purchase! Your order has been confirmed.
            </p>
            <p className='text-sm text-muted-foreground'>
              Order ID: {orderId}
            </p>
          </div>
          <div className='space-y-4'>
            <h3 className='font-medium'>Next Steps</h3>
            <ul className='space-y-2 text-muted-foreground'>
              <li>• You will receive an email confirmation shortly</li>
              <li>• Your order will be processed and shipped soon</li>
              <li>• Track your order status in your account</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Button variant='outline' asChild>
            <Link href='/products'>Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 