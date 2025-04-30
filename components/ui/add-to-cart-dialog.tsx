'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ShoppingCart, ArrowRight } from 'lucide-react'

interface AddToCartDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productName: string
}

export function AddToCartDialog({
  open,
  onOpenChange,
  productName,
}: AddToCartDialogProps) {
  const router = useRouter()

  const handleContinueShopping = () => {
    onOpenChange(false)
    router.push('/')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Added to Cart!</DialogTitle>
          <DialogDescription>
            {productName} has been added to your cart.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <ShoppingCart className="h-16 w-16 text-primary" />
        </div>
        <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-0">
          <Button
            variant="outline"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </Button>
          <Button 
            onClick={() => router.push('/checkout/cart')}
            className="gap-2"
          >
            Go to Cart
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 
