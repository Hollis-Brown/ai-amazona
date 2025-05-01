'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useCartStore } from "@/lib/store/cart"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"

export default function ReviewPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { items, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()

  const handleConfirm = async () => {
    try {
      setIsLoading(true)
      setError("")

      // Get checkout info from local storage
      const checkoutInfo = localStorage.getItem('checkoutInfo')
      if (!checkoutInfo) {
        router.push("/info")
        return
      }

      // Create order
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          })),
          customerInfo: JSON.parse(checkoutInfo),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      // Clear cart and redirect to confirmation
      clearCart()
      localStorage.removeItem('checkoutInfo')
      router.push("/confirmation")
    } catch (error) {
      console.error("Order creation error:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <CheckoutSteps currentStep={4} />
      <div className="min-h-[40vh] flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader>
            <CardTitle>Review Your Order</CardTitle>
            <CardDescription>Please review your order details before confirming</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Order Items</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={() => router.push("/payment")}
                >
                  Back to Payment
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Confirm Order"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 