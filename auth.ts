import NextAuth, { DefaultSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import authConfig from './auth.config'
import { User } from '@prisma/client'

const prisma = new PrismaClient()

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role?: 'USER' | 'ADMIN'
    } & DefaultSession['user']
  }
}

// Check for required environment variables
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not set. Please set it in your environment variables.')
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
})
