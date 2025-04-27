'use client'

import { useEffect, useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center">
        <p>Loading cart...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Add some items to your cart to continue shopping</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div>
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="flex items-center gap-8 p-6">
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="h-fit">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between border-t pt-4">
                  <span className="text-xl font-semibold">Total</span>
                  <span className="text-xl font-semibold">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <Button className="mt-4 w-full" size="lg" asChild>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
} 