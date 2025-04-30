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
        courseDates: 'January 15, 2024 - March 15, 2024',
        courseTime: 'Tuesdays and Thursdays, 6:00 PM - 8:00 PM EST',
        courseLength: '8 weeks (32 hours total)'
      }
    })

    // Update The Obscured Path
    await prisma.product.updateMany({
      where: {
        name: 'The Obscured Path Shaping the United States from 1900–1950'
      },
      data: {
        courseDates: 'March 18, 2024 - May 17, 2024',
        courseTime: 'Mondays and Wednesdays, 7:00 PM - 9:00 PM EST',
        courseLength: '8 weeks (32 hours total)'
      }
    })

    return NextResponse.json({ message: 'Course details updated successfully' })
  } catch (error) {
    console.error('Error updating course details:', error)
    return NextResponse.json({ error: 'Failed to update course details' }, { status: 500 })
  }
} 
