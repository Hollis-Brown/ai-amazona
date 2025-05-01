'use client'

import { signIn as nextAuthSignIn } from 'next-auth/react'

interface SignInOptions {
  redirect?: boolean;
  callbackUrl?: string;
  [key: string]: any;
}

export const signIn = async (provider: string, options: SignInOptions) => {
  try {
    const result = await nextAuthSignIn(provider, {
      ...options,
      redirect: false,
    })
    
    if (result?.error) {
      throw new Error(result.error)
    }
    
    return result
  } catch (error) {
    console.error('Sign in error:', error)
    throw error
  }
} 