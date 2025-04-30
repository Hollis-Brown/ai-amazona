const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected successfully');
    
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    
    console.log(`Found ${products.length} products:`);
    products.forEach(product => {
      console.log(`- ${product.name} (ID: ${product.id})`);
      console.log(`  Description: ${product.description.substring(0, 50)}...`);
      console.log(`  Price: $${product.price}`);
      console.log(`  Course Dates: ${product.courseDates}`);
      console.log(`  Course Length: ${product.courseLength}`);
      console.log(`  Course Time: ${product.courseTime}`);
      console.log(`  Category: ${product.category?.name || 'None'}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 