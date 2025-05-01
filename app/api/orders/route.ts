import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse('Invalid items', { status: 400 })
    }

    // Get user's default address
    const defaultAddress = await prisma.address.findFirst({
      where: {
        userId: session.user.id,
        isDefault: true,
      },
    })

    if (!defaultAddress) {
      return new NextResponse('No default address found', { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        addressId: defaultAddress.id,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        total: items.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0
        ),
        status: 'PENDING',
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order creation error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
