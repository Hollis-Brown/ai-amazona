import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { Cart, CartItem, Product } from '@prisma/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type CartWithItems = Cart & {
  items: (CartItem & {
    product: Product
  })[]
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let cart = await db.cart.findFirst({
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
    })

    if (!cart) {
      const newCart = await db.cart.create({
        data: {
          userId: session.user.id,
          items: {
            create: [],
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
      cart = newCart
    }

    if (!cart) {
      return NextResponse.json(
        { error: 'Failed to create cart' },
        { status: 500 }
      )
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Error fetching cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items } = body as { items: Array<{ productId: string; quantity: number }> }

    // Validate items
    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid items format' },
        { status: 400 }
      )
    }

    // Get or create user's cart
    let cart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId: session.user.id,
          items: {
            create: [],
          },
        },
        include: {
          items: true,
        },
      })
    }

    if (!cart) {
      return NextResponse.json(
        { error: 'Failed to create cart' },
        { status: 500 }
      )
    }

    // Delete existing items
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    // Create new items
    await db.cartItem.createMany({
      data: items.map((item) => ({
        cartId: cart!.id,
        productId: item.productId,
        quantity: item.quantity,
      })),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving cart:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 