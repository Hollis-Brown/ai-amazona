import { AddressForm } from "@/components/checkout/address-form"

export default function CheckoutInfoPage() {
  return (
    <div className="container max-w-xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Information</h1>
        <p className="mt-2 text-muted-foreground">
          Please provide your information to continue with checkout.
        </p>
      </div>
      <AddressForm />
    </div>
  )
} 
