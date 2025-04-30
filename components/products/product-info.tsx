'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart'
import { Button } from '@/components/ui/button'
import { AddToCartDialog } from '@/components/ui/add-to-cart-dialog'
import { Product } from '@/types'
import { ShoppingCart } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductInfoProps {
  product: Product & {
    category: {
      id: string
      name: string
    }
  }
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [quantity, setQuantity] = useState('1')
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      product,
      quantity: parseInt(quantity),
    })
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Description</h2>
        <p className="text-muted-foreground">{product.description}</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Category</h2>
        <p className="text-muted-foreground">{product.category.name}</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-2">Quantity</div>
          <Select value={quantity} onValueChange={setQuantity}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Select quantity" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: Math.min(10, product.stock || 10) }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          {product.stock ? (
            product.stock > 0 ? (
              <span className="text-green-600">In stock</span>
            ) : (
              <span className="text-red-600">Out of stock</span>
            )
          ) : (
            <span className="text-green-600">In stock</span>
          )}
        </div>
      </div>

      <Button 
        size="lg" 
        onClick={handleAddToCart}
        className="w-full gap-2"
        disabled={product.stock === 0}
      >
        Add to Cart
        <ShoppingCart className="h-5 w-5" />
      </Button>

      <AddToCartDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        productName={product.name}
      />
    </div>
  )
}
