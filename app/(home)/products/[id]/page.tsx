'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  categoryId: string
  category: {
    id: string
    name: string
  }
}

export default function ProductPage() {
  const params = useParams()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
        toast({
          title: 'Error',
          description: 'Failed to load product details',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, toast])

  const handleAddToCart = () => {
    if (!product) return

    // TODO: Implement cart functionality
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
    })
  }

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='flex items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold'>Product not found</h1>
          <p className='mt-2 text-muted-foreground'>
            The product you are looking for does not exist.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        <div className='aspect-square overflow-hidden rounded-lg'>
          <img
            src={product.image}
            alt={product.name}
            className='h-full w-full object-cover'
          />
        </div>
        <div className='flex flex-col space-y-4'>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
          <p className='text-2xl font-semibold text-primary'>
            ${product.price.toFixed(2)}
          </p>
          <p className='text-muted-foreground'>{product.description}</p>
          <div className='mt-4'>
            <Button onClick={handleAddToCart} size='lg' className='w-full'>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
