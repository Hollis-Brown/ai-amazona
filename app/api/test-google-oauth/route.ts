import { NextResponse } from 'next/server';

export async function GET() {
  // Get environment variables
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const nextAuthSecret = process.env.NEXTAUTH_SECRET;
  
  // Check if credentials are set
  const credentialsStatus = {
    GOOGLE_CLIENT_ID: googleClientId ? 'Set' : 'Not set',
    GOOGLE_CLIENT_SECRET: googleClientSecret ? 'Set' : 'Not set',
    NEXTAUTH_URL: nextAuthUrl ? 'Set' : 'Not set',
    NEXTAUTH_SECRET: nextAuthSecret ? 'Set' : 'Not set'
  };
  
  // Check if credentials are valid format
  const clientIdFormat = /^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/;
  const clientSecretFormat = /^[A-Za-z0-9_-]{24,}$/;
  
  const isClientIdValid = googleClientId ? clientIdFormat.test(googleClientId) : false;
  const isClientSecretValid = googleClientSecret ? clientSecretFormat.test(googleClientSecret) : false;
  
  // Return detailed information
  return NextResponse.json({
    credentialsStatus,
    validation: {
      isClientIdValid,
      isClientSecretValid,
      clientIdFormat: clientIdFormat.toString(),
      clientSecretFormat: clientSecretFormat.toString()
    },
    redirectUri: nextAuthUrl ? `${nextAuthUrl}/api/auth/callback/google` : 'Not set',
    message: 'This endpoint helps diagnose Google OAuth configuration issues'
  });
} 