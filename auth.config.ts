import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

declare module 'next-auth' {
  interface User {
    id: string
    role?: 'USER' | 'ADMIN'
  }
}

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('Google OAuth credentials are not set. Google sign-in will not work.')
}

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials) {
            console.error('No credentials provided')
            return null
          }

          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              image: true,
              role: true
            }
          })

          if (!user) {
            console.error('User not found:', email)
            return null
          }

          if (!user.password) {
            console.error('User has no password:', email)
            return null
          }

          const isValid = await compare(password, user.password)

          if (!isValid) {
            console.error('Invalid password for user:', email)
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error('Credentials auth error:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === 'google') {
          const email = profile?.email
          if (!email) {
            console.error('No email provided by Google')
            return false
          }

          // Check if user exists
          let dbUser = await prisma.user.findUnique({
            where: { email },
          })

          // If user doesn't exist, create one
          if (!dbUser) {
            const image = typeof profile?.picture === 'string' ? profile.picture : null
            dbUser = await prisma.user.create({
              data: {
                email,
                name: profile?.name || '',
                image,
                role: 'USER',
              },
            })
          }

          return true
        }

        return true
      } catch (error) {
        console.error('Sign in callback error:', error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      try {
        if (user) {
          token.id = user.id
          token.email = user.email
          token.name = user.name
          token.image = user.image
          token.role = user.role || 'USER'
        }
        return token
      } catch (error) {
        console.error('JWT callback error:', error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          session.user.id = token.id as string
          session.user.email = token.email as string
          session.user.name = token.name as string
          session.user.image = token.image as string | null
          session.user.role = token.role as 'USER' | 'ADMIN'
        }
        return session
      } catch (error) {
        console.error('Session callback error:', error)
        return session
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig
