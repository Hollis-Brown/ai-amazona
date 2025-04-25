/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { subDays, addHours, addMinutes } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  // Delete all existing records
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.address.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  // Create categories
  const courses = await prisma.category.create({
    data: {
      name: "Courses",
      description: "Educational courses covering various historical topics",
      image: "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png"
    },
  })

  // Create products
  const shadowsOfPast = await prisma.product.create({
    data: {
      name: "Shadows of the Past: Unpacking US History",
      description: "Dive deep into the untold stories and hidden narratives that shaped American history. This comprehensive course explores perspectives often overlooked in traditional historical accounts, challenging students to think critically about the past and its impact on the present.",
      price: 175.00,
      images: [
        "/images/image1.jpg",
      ],
      stock: 50,
      courseDates: "Consecutive Sundays, 8 June – 3 August",
      courseTime: "16:00 GMT / 17:00 CET",
      courseLength: "90 minutes",
      categoryId: courses.id,
    },
  })

  const obscuredPath = await prisma.product.create({
    data: {
      name: "The Obscured Path Shaping the United States from 1900–1950",
      description: "Explore America's transformative years from 1900 to 1950. This course examines the social, political, and economic forces that shaped modern America through two World Wars, the Great Depression, and the emergence of the United States as a global superpower.",
      price: 175.00,
      images: [
        "/images/image2.jpg",
      ],
      stock: 50,
      courseDates: "Consecutive Tuesdays, 10 June – 5 August",
      courseTime: "7:00 GMT / 8:00 CET",
      courseLength: "90 minutes",
      categoryId: courses.id,
    },
  })

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  // Create regular user
  const userPassword = await hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
