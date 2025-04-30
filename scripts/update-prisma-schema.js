/**
 * Update Prisma Schema
 * 
 * This script updates the Prisma schema to use SQLite instead of PostgreSQL.
 */

const fs = require('fs');
const path = require('path');

// Path to the Prisma schema file
const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

// Read the schema file
let schemaContent = '';
try {
  schemaContent = fs.readFileSync(schemaPath, 'utf8');
  console.log('✅ Found Prisma schema file at:', schemaPath);
} catch (error) {
  console.error('❌ Error reading Prisma schema file:', error);
  process.exit(1);
}

// Update the database provider from PostgreSQL to SQLite
const updatedSchemaContent = schemaContent.replace(
  /provider\s*=\s*"postgresql"/,
  'provider = "sqlite"'
);

// Update the database URL to use SQLite
const updatedSchemaContent2 = updatedSchemaContent.replace(
  /url\s*=\s*env\("DATABASE_URL"\)/,
  'url      = "file:./dev.db"'
);

// Write the updated schema back to the file
try {
  fs.writeFileSync(schemaPath, updatedSchemaContent2);
  console.log('✅ Prisma schema updated successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run the following commands to set up the SQLite database:');
  console.log('   npx prisma generate');
  console.log('   npx prisma db push');
  console.log('2. Restart your Next.js server');
  console.log('3. Try accessing your application again');
} catch (error) {
  console.error('❌ Error updating Prisma schema file:', error);
  process.exit(1);
} 