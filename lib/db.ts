import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a new PrismaClient instance with logging
const prismaClient = new PrismaClient({
  log: ['query', 'error', 'warn'],
})

// Export the database client
export const db = globalForPrisma.prisma ?? prismaClient

// In development, store the client in the global object to prevent multiple instances
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Add error handling for database connection
db.$connect()
  .then(() => {
    console.log('Successfully connected to the database')
  })
  .catch((error: Error) => {
    console.error('Failed to connect to the database:', error)
  }) 
