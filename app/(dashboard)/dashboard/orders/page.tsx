import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    images: string[]
    price: number
  }
}

interface Order {
  id: string
  status: string
  createdAt: Date
  total: number
  items: OrderItem[]
}

export default async function OrdersPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/sign-in')
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Order History</h2>
        <p className='text-muted-foreground'>
          View and manage your order history
        </p>
      </div>
      <div className='space-y-4'>
        {orders.length === 0 ? (
          <p className='text-muted-foreground'>No orders found</p>
        ) : (
          orders.map((order: Order) => (
            <Card key={order.id}>
              <CardContent className='p-6'>
                <div className='space-y-4'>
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
                    {order.items.map((item: OrderItem) => (
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
                  <div className='flex justify-end border-t pt-4'>
                    <div className='text-right'>
                      <p className='text-sm text-muted-foreground'>Total</p>
                      <p className='text-2xl font-bold'>
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
