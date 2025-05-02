'use client'

import { useCart, selectTotal } from '@/store/use-cart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const cart = useCart()
  const total = useCart(selectTotal)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
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
              Add some courses to your cart to see them here.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href='/products'>Continue Shopping</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-16'>
      <Card>
        <CardHeader>
          <CardTitle>Shopping Cart</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {cart.items.map((item) => (
            <div
              key={item.id}
              className='flex items-center gap-4 py-4'
            >
              <div className='relative aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-md'>
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='flex flex-1 flex-col'>
                <Link
                  href={`/products/${item.productId}`}
                  className='font-medium hover:underline'
                >
                  {item.name}
                </Link>
                <span className='text-muted-foreground'>
                  {formatPrice(item.price)}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  min='1'
                  value={item.quantity}
                  onChange={(e) =>
                    cart.updateQuantity(
                      item.productId,
                      parseInt(e.target.value)
                    )
                  }
                  className='w-20'
                />
                <Button
                  variant='destructive'
                  size='icon'
                  onClick={() => cart.removeItem(item.productId)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
              <div className='text-right min-w-[100px]'>
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
        </CardContent>
        <CardFooter className='flex justify-end'>
          <Button asChild>
            <Link href='/checkout/information'>Checkout</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
