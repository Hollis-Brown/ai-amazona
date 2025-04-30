/**
 * Verify Neon Database Connection
 * 
 * This script helps verify your Neon database connection and provides guidance on fixing it.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Verify Neon Database Connection ===');
console.log('This script will help verify your Neon database connection.');
console.log('');

// Function to find the .env file
function findEnvFile() {
  const possiblePaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '.env.local'),
    path.join(process.cwd(), '..', '.env'),
    path.join(process.cwd(), '..', '.env.local')
  ];
  
  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      return envPath;
    }
  }
  
  return null;
}

// Function to read the .env file
function readEnvFile() {
  const envPath = findEnvFile();
  let envContent = '';
  
  // Check if the file exists
  if (envPath && fs.existsSync(envPath)) {
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log(`✅ Found .env file at: ${envPath}`);
      return envContent;
    } catch (error) {
      console.error('❌ Error reading .env file:', error);
      return null;
    }
  } else {
    console.log('❌ .env file not found');
    return null;
  }
}

// Function to extract DATABASE_URL from .env content
function extractDatabaseUrl(envContent) {
  const match = envContent.match(/DATABASE_URL\s*=\s*["']?([^"'\n]*)["']?/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

// Function to check if the database URL is a Neon URL
function isNeonUrl(url) {
  return url && (
    url.includes('neon.tech') || 
    url.includes('neon.tech:5432') || 
    url.includes('neon.tech:5433')
  );
}

// Function to test database connection
function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    execSync('npx prisma db pull --schema=./prisma/schema.prisma', { stdio: 'inherit' });
    console.log('✅ Database connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

// Main function
function main() {
  const envContent = readEnvFile();
  
  if (!envContent) {
    console.log('Please create a .env file with your DATABASE_URL');
    return;
  }
  
  const databaseUrl = extractDatabaseUrl(envContent);
  
  if (!databaseUrl) {
    console.log('❌ DATABASE_URL not found in .env file');
    console.log('Please add your Neon database connection string to your .env file:');
    console.log('DATABASE_URL="postgresql://username:password@hostname:port/database"');
    return;
  }
  
  console.log('✅ DATABASE_URL found in .env file');
  
  if (isNeonUrl(databaseUrl)) {
    console.log('✅ DATABASE_URL appears to be a Neon URL');
  } else {
    console.log('⚠️ DATABASE_URL does not appear to be a Neon URL');
    console.log('Make sure you are using the correct Neon connection string');
  }
  
  // Test the connection
  testDatabaseConnection();
  
  console.log('');
  console.log('If the connection test failed, please check the following:');
  console.log('1. Make sure your Neon database is active');
  console.log('2. Verify your connection string is correct');
  console.log('3. Check if your IP is allowed in Neon\'s connection settings');
  console.log('4. Ensure your database user has the necessary permissions');
  console.log('');
  console.log('To get a new connection string from Neon:');
  console.log('1. Log in to your Neon account');
  console.log('2. Select your project');
  console.log('3. Go to the "Connection Details" tab');
  console.log('4. Copy the connection string and update your .env file');
}

main(); 