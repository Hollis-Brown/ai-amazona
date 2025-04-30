/**
 * Create .env File
 * 
 * This script creates a .env file with the correct Google OAuth credentials.
 */

const fs = require('fs');
const path = require('path');

// Google OAuth credentials
const GOOGLE_CLIENT_ID = '49251234294-raa6mfajr9j5gih2jbm2p08i7ne3vs3d.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

// Create .env file content
const envContent = `# Google OAuth
GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai-amazona?schema=public"

# Stripe
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# Uploadthing
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
`;

// Write to .env file
const envPath = path.join(process.cwd(), '.env');
try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully at:', envPath);
  console.log('');
  console.log('Next steps:');
  console.log('1. Make sure you have the following redirect URI in your Google Cloud Console:');
  console.log('   http://localhost:3000/api/auth/callback/google');
  console.log('2. Restart your Next.js server');
  console.log('3. Try signing in with Google again');
} catch (error) {
  console.error('❌ Error creating .env file:', error);
} 