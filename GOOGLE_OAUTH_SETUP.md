# Google OAuth Setup Guide for Next.js

This guide will help you set up Google OAuth authentication for your Next.js application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make note of the project ID

## Step 2: Configure the OAuth Consent Screen

1. In the Google Cloud Console, navigate to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace organization)
3. Fill in the required information:
   - App name: "AI Amazona" (or your app name)
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. For Scopes, add:
   - `./auth/userinfo.email`
   - `./auth/userinfo.profile`
6. Click "Save and Continue"
7. For Test Users, add your email address
8. Click "Save and Continue"
9. Review your settings and click "Back to Dashboard"

## Step 3: Create OAuth 2.0 Client ID

1. In the Google Cloud Console, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Set the following:
   - Name: "AI Amazona Web Client" (or your app name)
   - Authorized JavaScript origins: 
     - `http://localhost:3000` (for development)
     - Add your production URL if applicable
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - Add your production callback URL if applicable
5. Click "Create"
6. You will receive a Client ID and Client Secret. **Save these securely**

## Step 4: Update Your Environment Variables

Add the following to your `.env` file:

```
GOOGLE_CLIENT_ID="your_client_id_here"
GOOGLE_CLIENT_SECRET="your_client_secret_here"
```

Replace `your_client_id_here` and `your_client_secret_here` with the actual values from the Google Cloud Console.

## Step 5: Verify Your NextAuth Configuration

Your `auth.config.ts` file should look like this:

```typescript
import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    // Other providers...
  ],
  // Other configuration...
} satisfies NextAuthConfig
```

## Step 6: Restart Your Development Server

After updating your environment variables, restart your development server:

```bash
npm run dev
```

## Step 7: Test Your Google OAuth Setup

1. Visit your application at `http://localhost:3000`
2. Click on "Sign In" and select "Google"
3. You should be redirected to the Google sign-in page
4. After signing in, you should be redirected back to your application

## Troubleshooting

If you encounter the "OAuth client was not found" error (Error 401: invalid_client):

1. **Check your Client ID and Client Secret**:
   - Verify they are correctly copied from the Google Cloud Console
   - Ensure there are no extra spaces or characters

2. **Verify Redirect URIs**:
   - Make sure `http://localhost:3000/api/auth/callback/google` is listed in the authorized redirect URIs
   - Check for typos or missing parts in the URI

3. **Check OAuth Consent Screen**:
   - Ensure your app is properly configured in the OAuth consent screen
   - Verify that your email is added as a test user if you're in testing mode

4. **Environment Variables**:
   - Confirm that your .env file is being loaded correctly
   - Try logging the environment variables to verify they're accessible

5. **Google Cloud Console Status**:
   - Check if your Google Cloud project is active
   - Verify that the OAuth 2.0 Client ID is not disabled

## Common Issues and Solutions

1. **"OAuth client was not found" error**:
   - This usually means the Client ID is incorrect or the client has been deleted
   - Solution: Create a new OAuth client and update your environment variables

2. **"Invalid redirect URI" error**:
   - This means the callback URL doesn't match what's configured in the Google Cloud Console
   - Solution: Add the exact callback URL to the authorized redirect URIs

3. **"Access blocked" error**:
   - This can happen if your app is in testing mode and your email isn't added as a test user
   - Solution: Add your email as a test user in the OAuth consent screen

4. **"Error 400: invalid_request"**:
   - This can occur if the authorization parameters are incorrect
   - Solution: Check your NextAuth configuration and ensure it matches the Google OAuth requirements 