import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import { Order, OrderItem } from '@/types'

interface OrderWithRelations extends Order {
  items: (OrderItem & {
    product: {
      id: string
      name: string
      images: string[]
      price: number
    }
  })[]
  shippingAddress: {
    id: string
    addressLine1: string
    addressLine2: string | null
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
            },
          },
        },
      },
      shippingAddress: true,
    },
  }) as OrderWithRelations | null

  if (!order) {
    redirect('/dashboard/orders')
  }

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Order Confirmation</h2>
        <p className='text-muted-foreground'>
          Thank you for your purchase! Your order has been confirmed.
        </p>
      </div>
      <Card>
        <CardContent className='p-6'>
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium'>Order #{order.id.slice(-8)}</p>
                <p className='text-sm text-muted-foreground'>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Badge
                variant={
                  order.status === 'DELIVERED'
                    ? 'default'
                    : order.status === 'CANCELLED'
                    ? 'destructive'
                    : 'secondary'
                }
                className='capitalize'
              >
                {order.status.toLowerCase()}
              </Badge>
            </div>
            <div className='divide-y'>
              {order.items.map((item: OrderItem & { product: { id: string; name: string; images: string[]; price: number } }) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between py-4'
                >
                  <div className='flex items-center space-x-4'>
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={48}
                      height={48}
                      className='object-cover'
                    />
                    <div>
                      <p className='font-medium'>{item.product.name}</p>
                      <p className='text-sm text-muted-foreground'>
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className='font-medium'>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div>
              <h2 className='text-lg font-semibold'>Shipping Address</h2>
              <div className='text-gray-500'>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && (
                  <>
                    <br />
                    {order.shippingAddress.addressLine2}
                  </>
                )}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
                <br />
                {order.shippingAddress.country}
              </div>
            </div>
            <div className='flex justify-end border-t pt-4'>
              <div className='text-right'>
                <p className='text-sm text-muted-foreground'>Total</p>
                <p className='text-2xl font-bold'>
                  ${order.items.reduce((sum: number, item: OrderItem & { product: { id: string; name: string; images: string[]; price: number } }) => 
                    sum + item.product.price * item.quantity, 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
