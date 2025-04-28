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

// Generate a fallback secret if environment variables are not set
const fallbackSecret = 'fallback-secret-key-for-development-only-min-32-chars'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || fallbackSecret,
  debug: process.env.NODE_ENV === 'development',
})
