'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { Spinner } from '@/components/ui/spinner'
import { useSession } from 'next-auth/react'

interface OldCartItem {
  productId?: string
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession()

  // Handle hydration and migration
  useEffect(() => {
    // Check if we need to migrate from the old cart format
    const oldCart = localStorage.getItem('shopping-cart')
    if (oldCart) {
      try {
        const parsedCart = JSON.parse(oldCart)
        if (parsedCart.state && parsedCart.state.items) {
          // Check if we have items in the old format (with productId)
          const hasOldFormat = parsedCart.state.items.some(
            (item: OldCartItem) => item.productId
          )
          
          if (hasOldFormat) {
            // Clear the old cart to avoid duplicates
            localStorage.removeItem('shopping-cart')
          }
        }
      } catch (error) {
        console.error('Error parsing cart data:', error)
      }
    }
    
    setIsLoading(false)
  }, [])

  // Check authentication status
  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin?callbackUrl=/checkout/cart')
    }
  }, [session, status, router])

  if (isLoading || status === 'loading') {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  // If not authenticated, don't render anything (will redirect)
  if (!session) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        {items.length > 0 && (
          <Button
            variant="outline"
            onClick={() => router.push("/products")}
            className="hidden sm:block"
          >
            Continue Shopping
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button onClick={() => router.push("/products")}>
              Start Shopping
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Card>
              <CardContent className="divide-y space-y-6 p-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-6 pt-6 first:pt-0">
                    <div className="relative h-64 w-64 flex-shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">{item.name}</h3>
                        <p className="text-lg text-muted-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-8 w-8 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4">
            <Card className="p-6">
              <div className="flex justify-between border-t pt-4">
                <span className="text-xl font-semibold">Total</span>
                <span className="text-xl font-semibold">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <Button 
                className="mt-4 w-full" 
                size="lg" 
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
} 