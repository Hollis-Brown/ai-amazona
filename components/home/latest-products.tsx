'use client'

import { ProductCard } from '@/components/ui/product-card'
import { Product } from '@prisma/client'

interface LatestProductsProps {
  products: Product[]
}

export function LatestProducts({ products }: LatestProductsProps) {
  return (
    <section className='container mx-auto px-4 sm:px-6 lg:px-8'>
      <h2 className='text-2xl font-bold mb-6 text-center'>Our History Courses</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} showFullDescription={true} />
        ))}
      </div>
    </section>
  )
}
