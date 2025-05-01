import { NextRequest, NextResponse } from 'next/server'
import * as z from 'zod'

const infoSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate the request body
    const { firstName, lastName, email } = infoSchema.parse(body)
    console.log('Validated data:', { firstName, lastName, email })

    // Return success response with the validated data
    return NextResponse.json({ 
      success: true, 
      data: { firstName, lastName, email } 
    })
  } catch (error) {
    console.error('Detailed error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 