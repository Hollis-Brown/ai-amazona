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
        description: 'This seminar course explores key historical events and themes shaping early America, including Indigenous American contributions, the arrival of the Pilgrims and Puritans fleeing the Church of England, the American Revolution, the lasting impact of the Constitution, the enslavement of West Africans and their influence on American culture and politics, waves of European immigration, the religious fervor of the Great Awakening, as well as the catalysts of the Civil War. Participants will gain insights into the American mindset and worldview from 1620 to 1854 through textbooks, academic articles, and videos.'
      }
    })

    // Update The Obscured Path
    await prisma.product.updateMany({
      where: {
        name: 'The Obscured Path Shaping the United States from 1900–1950'
      },
      data: {
        description: 'This seminar course examines critical moments that shaped the United States during the first half of the 20th century, including the Second Industrial Revolution, early feminist movement, Jim Crow Laws, the Prohibition era, and the Great Depression. Students will examine America\'s experiences in both World Wars and how these events influenced U.S. foreign policy toward the UK and Europe. Course materials include textbooks, academic articles, and videos.'
      }
    })

    return NextResponse.json({ message: 'Descriptions updated successfully' })
  } catch (error) {
    console.error('Error updating descriptions:', error)
    return NextResponse.json({ error: 'Failed to update descriptions' }, { status: 500 })
  }
} 
