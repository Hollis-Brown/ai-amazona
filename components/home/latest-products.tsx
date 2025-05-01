'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'

interface LatestProductsProps {
  products: (Product & {
    category: {
      name: string
    }
  })[]
}

export function LatestProducts({ products }: LatestProductsProps) {
  return (
    <section className='py-12 bg-gray-50'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Latest Products</h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Explore our newest courses and discover the fascinating story of U.S. history
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {products.map((product) => (
            <Card key={product.id} className='overflow-hidden hover:shadow-lg transition-shadow'>
              <div className='relative aspect-[4/3]'>
                <Image
                  src={product.images[0] || '/images/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className='object-cover'
                />
              </div>
              <CardHeader>
                <CardTitle className='text-xl'>{product.name}</CardTitle>
                <CardDescription>{product.category.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-gray-600 mb-4 line-clamp-2'>{product.description}</p>
                <div className='flex items-center justify-between'>
                  <span className='text-2xl font-bold text-gray-900'>${product.price}</span>
                  <Button asChild>
                    <Link href={`/products/${product.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
