import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // This is a server-side API route, but we'll return instructions
    // for the client to clear the cart data
    return NextResponse.json({
      success: true,
      message: 'To clear your cart, run this in your browser console: localStorage.removeItem("shopping-cart")',
      instructions: [
        '1. Open your browser developer tools (F12 or right-click > Inspect)',
        '2. Go to the Console tab',
        '3. Run: localStorage.removeItem("shopping-cart")',
        '4. Refresh the page',
      ],
    })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
} 
