import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sort = searchParams.get('sort')
    const perPage = 12

    // Build the where clause
    const where: any = {}
    if (category) {
      where.categoryId = category
    }
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Build the orderBy clause
    const orderBy: any = {}
    if (sort) {
      switch (sort) {
        case 'price_asc':
          orderBy.price = 'asc'
          break
        case 'price_desc':
          orderBy.price = 'desc'
          break
        case 'name_asc':
          orderBy.name = 'asc'
          break
        case 'name_desc':
          orderBy.name = 'desc'
          break
        default:
          orderBy.createdAt = 'desc'
      }
    } else {
      orderBy.createdAt = 'desc'
    }

    // Get total count for pagination
    const total = await db.product.count({ where })

    // Get products with pagination
    const products = await db.product.findMany({
      where,
      orderBy,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: (page - 1) * perPage,
      take: perPage,
    })

    return NextResponse.json({
      products,
      total,
      perPage,
      currentPage: page,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
