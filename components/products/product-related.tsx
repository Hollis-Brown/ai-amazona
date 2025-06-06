'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types'
import { ProductCard } from '@/components/ui/product-card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

interface ProductRelatedProps {
  categoryId: string
  currentProductId: string
}

export function ProductRelated({
  categoryId,
  currentProductId,
}: ProductRelatedProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `/api/products/related?categoryId=${categoryId}&currentProductId=${currentProductId}`
        )
        const data = await response.json()
        // Ensure data is an array
        setProducts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching related products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (categoryId && currentProductId) {
      fetchRelatedProducts()
    }
  }, [categoryId, currentProductId])

  if (loading) {
    return (
      <div className='space-y-4'>
        <h2 className='text-2xl font-bold'>Related Products</h2>
        <div className='flex items-center justify-center py-8'>
          <div className='text-muted-foreground'>Loading related products...</div>
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className='space-y-4'>
      <h2 className='text-2xl font-bold'>Related Products</h2>
      <Carousel className='w-full'>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className='md:basis-1/2 lg:basis-1/3'
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
