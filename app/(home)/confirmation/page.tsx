'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"

export default function ConfirmationPage() {
  const router = useRouter()

  return (
    <div className="container py-8">
      <CheckoutSteps currentStep={5} />
      <div className="min-h-[40vh] flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-4">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle>Order Confirmed!</CardTitle>
            <CardDescription>
              Thank you for your purchase. Your order has been successfully processed.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                We've sent a confirmation email with your order details.
              </p>
              <p className="text-muted-foreground">
                You can track your order status in your account dashboard.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/")}
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => router.push("/dashboard/orders")}
              >
                View Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 