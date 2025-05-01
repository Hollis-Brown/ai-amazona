import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const perPage = 12

    // Get products with default sorting
    const products = await db.product.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      take: perPage,
    })

    const total = await db.product.count()

    return NextResponse.json({
      products,
      total,
      perPage,
      currentPage: 1,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
