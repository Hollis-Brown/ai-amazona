import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: {
    categoryId: string
    productId: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { categoryId, productId } = params

    if (!categoryId || !productId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const relatedProducts = await db.product.findMany({
      where: {
        categoryId,
        id: {
          not: productId,
        },
      },
      take: 6,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json(relatedProducts)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 