'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardDescription } from '@/components/ui/card'
import { AddToCartDialog } from '@/components/ui/add-to-cart-dialog'
import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    images: string[]
    courseDates?: string
    courseTime?: string
    courseLength?: string
  }
  showFullDescription?: boolean
}

export function ProductCard({ product, showFullDescription = false }: ProductCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    })
    setDialogOpen(true)
  }

  return (
    <>
      <Card className="group overflow-hidden rounded-lg h-full flex flex-col">
        <Link href={`/products/${product.id}`} className="flex-1 flex flex-col">
          <div className="relative aspect-square">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <CardHeader className="p-4 flex-1">
            <h3 className="font-semibold">{product.name}</h3>
            <CardDescription className={showFullDescription ? '' : 'line-clamp-2'}>
              {product.description}
            </CardDescription>
            {(product.courseDates || product.courseTime || product.courseLength) && (
              <div className="mt-4 space-y-1 text-sm text-muted-foreground border-t pt-4">
                {product.courseDates && (
                  <p><span className="font-medium">Course Dates:</span> {product.courseDates}</p>
                )}
                {product.courseTime && (
                  <p><span className="font-medium">Time:</span> {product.courseTime}</p>
                )}
                {product.courseLength && (
                  <p><span className="font-medium">Length:</span> {product.courseLength}</p>
                )}
              </div>
            )}
          </CardHeader>
          <div className="mt-auto">
            <CardContent className="p-4 pt-0">
              <p className="text-lg font-semibold">
                ${product.price.toFixed(2)}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button 
                className="w-full gap-2" 
                onClick={handleAddToCart}
              >
                Add to Cart
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </CardFooter>
          </div>
        </Link>
      </Card>

      <AddToCartDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productName={product.name}
      />
    </>
  )
}
