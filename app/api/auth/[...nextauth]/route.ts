import { handlers } from "@/auth"
import { NextResponse, NextRequest } from "next/server"

export const { GET, POST } = handlers

// Add error handling middleware
export async function middleware(request: NextRequest) {
  try {
    const response = await handlers.GET(request)
    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}