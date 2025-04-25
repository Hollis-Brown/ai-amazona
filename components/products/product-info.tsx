'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCart } from '@/store/use-cart'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import Link from 'next/link'

interface ProductInfoProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    stock: number
    images: string[]
    courseDates?: string
    courseTime?: string
    courseLength?: string
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState('1')
  const cart = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    cart.addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: parseInt(quantity),
    })

    toast({
      title: 'Added to cart',
      description: `${quantity} x ${product.name} added to your cart`,
      action: (
        <ToastAction altText='View cart' asChild>
          <Link href='/cart'>View Cart</Link>
        </ToastAction>
      ),
    })
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold'>{product.name}</h1>
      </div>

      <div className='text-2xl font-bold'>${product.price.toFixed(2)}</div>

      <div className='prose prose-sm'>
        <p>{product.description}</p>
      </div>

      {/* Course Details */}
      {(product.courseDates || product.courseTime || product.courseLength) && (
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg border">
          <h3 className="font-semibold text-lg">Course Details</h3>
          {product.courseDates && (
            <p className="text-sm"><span className="font-medium">Course Dates:</span> {product.courseDates}</p>
          )}
          {product.courseTime && (
            <p className="text-sm"><span className="font-medium">Time:</span> {product.courseTime}</p>
          )}
          {product.courseLength && (
            <p className="text-sm"><span className="font-medium">Length:</span> {product.courseLength}</p>
          )}
        </div>
      )}

      <div className='space-y-4'>
        <div>
          <div className='text-sm font-medium mb-2'>Quantity</div>
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger className='w-24'>
              <SelectValue placeholder='Select quantity' />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: Math.min(10, product.stock) }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='text-sm text-muted-foreground'>
          {product.stock > 0 ? (
            <span className='text-green-600'>In stock</span>
          ) : (
            <span className='text-red-600'>Out of stock</span>
          )}
        </div>

        <Button
          onClick={handleAddToCart}
          className='w-full'
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
