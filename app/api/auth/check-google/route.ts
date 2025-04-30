import { NextResponse } from 'next/server'

export async function GET() {
  const googleClientId = process.env.GOOGLE_CLIENT_ID
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
  
  // Check if credentials are set
  if (!googleClientId || !googleClientSecret) {
    return NextResponse.json(
      { 
        error: 'Google OAuth credentials are not configured',
        googleClientId: googleClientId ? 'Set' : 'Not set',
        googleClientSecret: googleClientSecret ? 'Set' : 'Not set'
      },
      { status: 400 }
    )
  }
  
  // Check if credentials are valid format
  const clientIdFormat = /^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/
  const clientSecretFormat = /^[A-Za-z0-9_-]{24,}$/
  
  const isClientIdValid = clientIdFormat.test(googleClientId)
  const isClientSecretValid = clientSecretFormat.test(googleClientSecret)
  
  if (!isClientIdValid || !isClientSecretValid) {
    return NextResponse.json(
      { 
        error: 'Google OAuth credentials are not in the correct format',
        isClientIdValid,
        isClientSecretValid
      },
      { status: 400 }
    )
  }
  
  return NextResponse.json({ 
    success: true,
    message: 'Google OAuth credentials are properly configured'
  })
} 
