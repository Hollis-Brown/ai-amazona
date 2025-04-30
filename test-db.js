const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_4vNBM1lAzxVp@ep-small-poetry-a6suw3qe-pooler.us-west-2.aws.neon.tech/neondb?sslmode=require"
    },
  },
})

async function main() {
  try {
    const result = await prisma.$connect()
    console.log('Successfully connected to the database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 