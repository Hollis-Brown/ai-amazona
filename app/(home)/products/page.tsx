'use client'

import { Suspense } from 'react'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductSidebar } from '@/components/products/product-sidebar'
import { ProductsContent } from '@/components/products/products-content'

export default function ProductsPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row gap-8'>
        <aside className='w-full md:w-64'>
          <ProductSidebar />
        </aside>
        <main className='flex-1'>
          <Suspense fallback={<div>Loading products...</div>}>
            <ProductsContent />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
