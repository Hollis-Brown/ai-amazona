import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { z } from "zod"

const contactSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = contactSchema.parse(body)

    // Store contact info in session or proceed directly
    // Since we're not storing address info, we can just validate and proceed
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid contact data", { status: 400 })
    }

    console.error("[CONTACT_ERROR]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 
