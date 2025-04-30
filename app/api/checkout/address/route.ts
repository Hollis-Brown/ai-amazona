import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const addressSchema = z.object({
  fullName: z.string().min(2),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(5),
  country: z.string().min(2),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = addressSchema.parse(body)

    // Save or update the shipping address
    const address = await db.address.upsert({
      where: {
        userId: session.user.id,
      },
      update: validatedData,
      create: {
        ...validatedData,
        userId: session.user.id,
      },
    })

    return NextResponse.json(address)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid address data", { status: 400 })
    }

    console.error("[ADDRESS_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 
