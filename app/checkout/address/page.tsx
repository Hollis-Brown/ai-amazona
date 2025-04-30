import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { AddressForm } from "@/components/checkout/address-form"

export default async function CheckoutContactPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/checkout/contact")
  }

  return (
    <div className="container max-w-xl py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Contact Information</h1>
        <p className="mt-2 text-muted-foreground">
          Please enter your contact details to continue checkout.
        </p>
      </div>
      <AddressForm />
    </div>
  )
} 
