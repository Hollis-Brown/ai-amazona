'use client'

import { Suspense } from 'react'
import { ProductSidebarContent } from '@/components/products/product-sidebar-content'

export function ProductSidebar() {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <ProductSidebarContent />
    </Suspense>
  )
}
