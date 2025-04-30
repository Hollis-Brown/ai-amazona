import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { Product } from '@/types'

interface CartItem {
  id: string
  product: Product
  quantity: number
}

interface UserInfo {
  fullName: string
  email: string
}

interface OrderBody {
  items: CartItem[]
  userInfo: UserInfo
  subtotal: number
  tax: number
  total: number
}

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized: User ID is required', {
        status: 401,
      })
    }

    const body = await req.json()
    const { items, userInfo, total } = body as OrderBody

    if (!items?.length) {
      return new NextResponse('Bad Request: Cart items are required', {
        status: 400,
      })
    }

    if (!userInfo) {
      return new NextResponse('Bad Request: User information is required', {
        status: 400,
      })
    }

    // Verify all products exist and are in stock
    const productIds = items.map((item) => item.product.id)
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    })

    // Check if all products exist
    if (products.length !== items.length) {
      const foundProductIds = products.map((p: Product) => p.id)
      const missingProductIds = productIds.filter(
        (id) => !foundProductIds.includes(id)
      )
      return new NextResponse(
        `Products not found: ${missingProductIds.join(', ')}`,
        {
          status: 400,
        }
      )
    }

    // Check stock levels
    const insufficientStock = items.filter((item) => {
      const product = products.find((p: Product) => p.id === item.product.id)
      return product && product.stock < item.quantity
    })

    if (insufficientStock.length > 0) {
      return new NextResponse(
        `Insufficient stock for products: ${insufficientStock
          .map((item) => item.product.id)
          .join(', ')}`,
        { status: 400 }
      )
    }

    // Start a transaction to ensure all operations succeed or fail together
    const order = await prisma.$transaction(async (tx: any) => {
      // Create a temporary address for the order (required by schema)
      const address = await tx.address.create({
        data: {
          fullName: userInfo.fullName,
          addressLine1: "Digital Delivery",
          city: "Online",
          state: "Digital",
          postalCode: "00000",
          country: "Digital",
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      })

      // Create order with items
      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          addressId: address.id,
          total,
          items: {
            create: items.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      })

      // Update product stock levels
      for (const item of items) {
        await tx.product.update({
          where: { id: item.product.id },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        })
      }

      // Clear the user's cart if it exists
      await tx.cart
        .delete({
          where: { userId: session.user.id },
        })
        .catch(() => {
          // Ignore error if cart doesn't exist
        })

      return newOrder
    })

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('[ORDERS_POST]', error)
    if (error instanceof Error) {
      return new NextResponse(`Error: ${error.message}`, { status: 500 })
    }
    return new NextResponse('Internal error', { status: 500 })
  }
}
