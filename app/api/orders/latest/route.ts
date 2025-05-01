import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const order = await prisma.order.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    })

    if (!order) {
      return new NextResponse('No orders found', { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching latest order:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 