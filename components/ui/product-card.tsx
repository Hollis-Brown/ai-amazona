'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useCart } from '@/store/use-cart'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'

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
  className?: string
  showFullDescription?: boolean
}

export function ProductCard({ product, className, showFullDescription = false }: ProductCardProps) {
  const cart = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation when clicking the button
    cart.addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    })

    toast({
      title: 'Added to cart',
      description: `${product.name} added to your cart`,
      action: (
        <ToastAction altText='View cart' asChild>
          <Link href='/cart'>View Cart</Link>
        </ToastAction>
      ),
    })
  }

  return (
    <Card className={cn('overflow-hidden group flex flex-col h-full', className)}>
      <Link href={`/products/${product.id}`} className="flex-1">
        <div className='aspect-square overflow-hidden relative'>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>
        <CardHeader className='p-4'>
          <CardTitle className='text-lg'>{product.name}</CardTitle>
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
      </Link>
      <div className="mt-auto">
        <CardContent className='p-4 pt-0'>
          <div className='text-xl font-bold'>
            ${product.price.toFixed(2)}
          </div>
        </CardContent>
        <CardFooter className='p-4 pt-0'>
          <Button className='w-full' onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
