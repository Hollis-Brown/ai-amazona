const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateCourses() {
  try {
    console.log('Updating Shadows of the Past...')
    await prisma.product.updateMany({
      where: {
        name: 'Shadows of the Past: Unpacking US History'
      },
      data: {
        description: 'This seminar course explores key historical events and themes shaping early America, including Indigenous American contributions, the arrival of the Pilgrims and Puritans fleeing the Church of England, the American Revolution, the lasting impact of the Constitution, the enslavement of West Africans and their influence on American culture and politics, waves of European immigration, the religious fervor of the Great Awakening, as well as the catalysts of the Civil War. Participants will gain insights into the American mindset and worldview from 1620 to 1854 through textbooks, academic articles, and videos.',
        courseDates: 'Consecutive Sundays, 8 June – 3 August',
        courseTime: '16:00 GMT / 17:00 CET',
        courseLength: '90 minutes'
      }
    })
    console.log('Updated Shadows of the Past successfully')

    console.log('\nUpdating The Obscured Path...')
    await prisma.product.updateMany({
      where: {
        name: 'The Obscured Path Shaping the United States from 1900–1950'
      },
      data: {
        description: 'This seminar course examines critical moments that shaped the United States during the first half of the 20th century, including the Second Industrial Revolution, early feminist movement, Jim Crow Laws, the Prohibition era, and the Great Depression. Students will examine America\'s experiences in both World Wars and how these events influenced U.S. foreign policy toward the UK and Europe. Course materials include textbooks, academic articles, and videos.',
        courseDates: 'Consecutive Tuesdays, 10 June – 5 August',
        courseTime: '7:00 GMT / 8:00 CET',
        courseLength: '90 minutes'
      }
    })
    console.log('Updated The Obscured Path successfully')

  } catch (error) {
    console.error('Error updating courses:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCourses() 