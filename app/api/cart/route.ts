import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/db'
import { CartItem } from '@/lib/store/cart'

// Types based on Prisma schema
type PrismaCartItem = {
  id: string
  cartId: string
  productId: string
  quantity: number
  product: any
}

type PrismaCart = {
  id: string
  userId: string
  items: PrismaCartItem[]
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ items: [] })
    }

    // Get user's saved cart from database
    const userCart = await db.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!userCart) {
      return NextResponse.json({ items: [] })
    }

    // Transform database cart items to match frontend cart item structure
    const items = userCart.items.map((item: PrismaCartItem) => ({
      id: item.id,
      product: item.product,
      quantity: item.quantity,
    }))

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
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
    const { items } = body as { items: CartItem[] }

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
        },
      })
    }

    // Delete existing items
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    // Create new items
    await db.cartItem.createMany({
      data: items.map((item) => ({
        cartId: cart!.id,
        productId: item.product.id,
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