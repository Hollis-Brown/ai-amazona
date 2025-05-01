import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Update Shadows of the Past
    await prisma.product.updateMany({
      where: {
        name: 'Shadows of the Past: Unpacking US History'
      },
      data: {
        courseDates: 'Consecutive Sundays, 8 June – 3 August',
        courseTime: '16:00 GMT / 17:00 CET',
        courseLength: '90 minutes'
      }
    })

    // Update The Obscured Path
    await prisma.product.updateMany({
      where: {
        name: 'The Obscured Path Shaping the United States from 1900–1950'
      },
      data: {
        courseDates: 'Consecutive Tuesdays, 10 June – 5 August',
        courseTime: '7:00 GMT / 8:00 CET',
        courseLength: '90 minutes'
      }
    })

    return NextResponse.json({ message: 'Course details updated successfully' })
  } catch (error) {
    console.error('Error updating course details:', error)
    return NextResponse.json({ error: 'Failed to update course details' }, { status: 500 })
  }
} 
