'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ProductRelated } from '@/components/products/product-related'
import { useCartStore } from '@/lib/store/cart'
import { ShoppingCart } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  categoryId: string
  category: {
    id: string
    name: string
  }
  courseDates?: string
  courseTime?: string
  courseLength?: string
}

export default function ProductPage() {
  const params = useParams()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const addItem = useCartStore((state) => state.addItem)

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

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    })

    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart`,
      action: (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.location.href = '/cart'}
        >
          View Cart
        </Button>
      ),
    })
  }

  if (loading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='aspect-square overflow-hidden rounded-lg'>
            <Skeleton className='h-full w-full' />
          </div>
          <div className='flex flex-col space-y-4'>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-6 w-1/4' />
            <Skeleton className='h-24 w-full' />
            <Skeleton className='h-10 w-full' />
          </div>
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
        <div className='space-y-4'>
          <div className='aspect-square overflow-hidden rounded-lg'>
            <Image
              src={product.images[selectedImage] || '/placeholder.png'}
              alt={product.name}
              width={600}
              height={600}
              className='h-full w-full object-cover'
            />
          </div>
          {product.images.length > 1 && (
            <div className='grid grid-cols-4 gap-2'>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg ${
                    selectedImage === index
                      ? 'ring-2 ring-primary'
                      : 'ring-1 ring-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    width={150}
                    height={150}
                    className='h-full w-full object-cover'
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className='flex flex-col space-y-4'>
          <h1 className='text-3xl font-bold'>{product.name}</h1>
          <p className='text-2xl font-semibold text-primary'>
            ${product.price.toFixed(2)}
          </p>
          <p className='text-muted-foreground'>{product.description}</p>
          
          {(product.courseDates || product.courseTime || product.courseLength) && (
            <div className='mt-4 space-y-2 rounded-lg border p-4'>
              <h3 className='font-semibold'>Course Details</h3>
              {product.courseDates && (
                <p><span className='font-medium'>Dates:</span> {product.courseDates}</p>
              )}
              {product.courseTime && (
                <p><span className='font-medium'>Time:</span> {product.courseTime}</p>
              )}
              {product.courseLength && (
                <p><span className='font-medium'>Length:</span> {product.courseLength}</p>
              )}
            </div>
          )}
          
          <div className='mt-4'>
            <Button onClick={handleAddToCart} size='lg' className='w-full gap-2'>
              Add to Cart
              <ShoppingCart className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
      
      <Separator className='my-8' />
      
      {product.categoryId && (
        <ProductRelated
          categoryId={product.categoryId}
          currentProductId={product.id}
        />
      )}
    </div>
  )
}
