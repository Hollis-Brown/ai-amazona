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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Product } from '@/types'

export default function ProductPage() {
  const params = useParams()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()
        console.log('Product data:', data)
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
      product,
      quantity: quantity,
    })

    toast({
      title: 'Added to cart',
      description: `${quantity} ${product.name} has been added to your cart`,
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
        <h1 className='text-2xl font-bold'>Product not found</h1>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
        {/* Left column - Product Image */}
        <div className='space-y-4'>
          <div className='aspect-square overflow-hidden rounded-lg border'>
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={500}
                height={500}
                className='h-full w-full object-cover'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-muted'>
                <span className='text-sm text-muted-foreground'>No image available</span>
              </div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className='grid grid-cols-4 gap-2'>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square overflow-hidden rounded-lg ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    width={100}
                    height={100}
                    className='h-full w-full object-cover'
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right column - Product Details */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl font-bold'>{product.name}</h1>
            <p className='mt-2 text-2xl font-semibold'>
              ${product.price.toFixed(2)}
            </p>
          </div>
          <p className='text-muted-foreground'>{product.description}</p>
          <div className='flex items-center gap-4'>
            <Select
              value={quantity.toString()}
              onValueChange={(value) => setQuantity(parseInt(value))}
            >
              <SelectTrigger className='w-24'>
                <SelectValue placeholder='Quantity' />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.min(10, product.stock || 10) }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size='lg'
              onClick={handleAddToCart}
              className='flex-1 gap-2'
              disabled={product.stock === 0}
            >
              Add to Cart
              <ShoppingCart className='h-5 w-5' />
            </Button>
          </div>
          <Separator />
          <Tabs defaultValue='details'>
            <TabsList>
              <TabsTrigger value='details'>Details</TabsTrigger>
              <TabsTrigger value='shipping'>Shipping</TabsTrigger>
            </TabsList>
            <TabsContent value='details' className='space-y-4'>
              <div>
                <h3 className='font-semibold'>Category</h3>
                <p className='text-muted-foreground'>{product.category?.name}</p>
              </div>
              <div>
                <h3 className='font-semibold'>Course Dates</h3>
                <p className='text-muted-foreground'>{product.courseDates}</p>
              </div>
              <div>
                <h3 className='font-semibold'>Course Length</h3>
                <p className='text-muted-foreground'>{product.courseLength}</p>
              </div>
              <div>
                <h3 className='font-semibold'>Course Time</h3>
                <p className='text-muted-foreground'>{product.courseTime}</p>
              </div>
            </TabsContent>
            <TabsContent value='shipping' className='space-y-4'>
              <p className='text-muted-foreground'>
                Free shipping on all orders. Delivery time varies by location.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Separator className='my-8' />
      <ProductRelated categoryId={product.categoryId} currentProductId={product.id} />
    </div>
  )
}
