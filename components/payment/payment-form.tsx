'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStripe, useElements, PaymentElement, LinkAuthenticationElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CreditCard, Wallet, Banknote } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentFormProps {
  clientSecret: string
}

export function PaymentForm({ clientSecret }: PaymentFormProps) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [email, setEmail] = useState("")
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isElementsReady, setIsElementsReady] = useState(false)

  useEffect(() => {
    if (stripe && elements) {
      setIsReady(true)
    }
  }, [stripe, elements])

  useEffect(() => {
    if (elements) {
      const element = elements.getElement('payment')
      if (element) {
        const handleReady = () => {
          setIsElementsReady(true)
          setIsLoading(false)
        }

        element.on('ready', handleReady)

        // Cleanup
        return () => {
          element.off('ready', handleReady)
        }
      }
    }
  }, [elements])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/review`,
        },
      })

      if (stripeError) {
        setError(stripeError.message || "An error occurred")
        setIsProcessing(false)
        return
      }
    } catch (error) {
      console.error("Payment error:", error)
      setError("An error occurred while processing your payment")
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h4 className="font-medium">Select Payment Method</h4>
        <RadioGroup
          value={paymentMethod}
          onValueChange={setPaymentMethod}
          className="grid grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem
              value="card"
              id="card"
              className="peer sr-only"
            />
            <Label
              htmlFor="card"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                paymentMethod === "card" && "border-primary"
              )}
            >
              <CreditCard className="mb-3 h-6 w-6" />
              <span>Card</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="wallet"
              id="wallet"
              className="peer sr-only"
            />
            <Label
              htmlFor="wallet"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                paymentMethod === "wallet" && "border-primary"
              )}
            >
              <Wallet className="mb-3 h-6 w-6" />
              <span>Wallet</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem
              value="bank"
              id="bank"
              className="peer sr-only"
            />
            <Label
              htmlFor="bank"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary",
                paymentMethod === "bank" && "border-primary"
              )}
            >
              <Banknote className="mb-3 h-6 w-6" />
              <span>Bank</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {paymentMethod === "card" && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter your card information to complete the payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-md p-4 bg-white">
              <LinkAuthenticationElement
                onChange={(e) => setEmail(e.value.email)}
                options={{
                  defaultValues: {
                    email: localStorage.getItem('checkoutInfo') 
                      ? JSON.parse(localStorage.getItem('checkoutInfo')!).email 
                      : '',
                  },
                }}
              />
            </div>

            <div className="border rounded-md p-4 bg-white">
              <PaymentElement
                options={{
                  layout: "tabs",
                  defaultValues: {
                    billingDetails: {
                      email,
                    },
                  },
                  fields: {
                    billingDetails: {
                      email: 'never',
                    },
                  },
                }}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              <p>We accept the following payment methods:</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">Visa</span>
                <span className="text-xs">Mastercard</span>
                <span className="text-xs">American Express</span>
                <span className="text-xs">Discover</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentMethod === "wallet" && (
        <Card>
          <CardHeader>
            <CardTitle>Wallet Payment</CardTitle>
            <CardDescription>Pay using your digital wallet</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Wallet payment options will be available soon.</p>
          </CardContent>
        </Card>
      )}

      {paymentMethod === "bank" && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer</CardTitle>
            <CardDescription>Pay using bank transfer</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Bank transfer options will be available soon.</p>
          </CardContent>
        </Card>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={!stripe || isProcessing || paymentMethod !== "card" || !isReady || !isElementsReady}
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  )
} 