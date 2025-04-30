/**
 * Update Neon Database Connection
 * 
 * This script helps you update your .env file with the correct Neon connection string.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Update Neon Database Connection ===');
console.log('This script will help you update your .env file with the correct Neon connection string.');
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
  
  return path.join(process.cwd(), '.env'); // Default to creating a new .env file
}

// Function to read the .env file
function readEnvFile() {
  const envPath = findEnvFile();
  let envContent = '';
  
  // Check if the file exists
  if (fs.existsSync(envPath)) {
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log(`✅ Found .env file at: ${envPath}`);
    } catch (error) {
      console.error('❌ Error reading .env file:', error);
      return null;
    }
  } else {
    console.log(`⚠️ .env file not found at: ${envPath}`);
    console.log('Creating a new .env file...');
  }
  
  return { path: envPath, content: envContent };
}

// Function to update the .env file with the database connection string
function updateEnvFile(envInfo, databaseUrl) {
  const envPath = envInfo.path;
  let envContent = envInfo.content;
  
  // Update DATABASE_URL
  if (envContent.includes('DATABASE_URL=')) {
    envContent = envContent.replace(
      /DATABASE_URL\s*=\s*["']?[^"'\n]*["']?/,
      `DATABASE_URL="${databaseUrl}"`
    );
  } else {
    envContent += `\nDATABASE_URL="${databaseUrl}"`;
  }
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file updated successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error updating .env file:', error);
    return false;
  }
}

// Main function
function main() {
  const envInfo = readEnvFile();
  
  if (!envInfo) {
    rl.close();
    return;
  }
  
  console.log('Please enter your Neon database connection string:');
  console.log('It should look like: postgresql://username:password@hostname:port/database');
  console.log('');
  
  rl.question('Enter your Neon database connection string: ', (databaseUrl) => {
    if (!databaseUrl) {
      console.log('❌ Database connection string is required.');
      rl.close();
      return;
    }
    
    // Update the .env file
    if (updateEnvFile(envInfo, databaseUrl)) {
      console.log('');
      console.log('✅ Database connection string updated successfully!');
      console.log('');
      console.log('Next steps:');
      console.log('1. Run the following command to set up the database:');
      console.log('   npx prisma db push');
      console.log('2. Restart your Next.js server');
      console.log('3. Try accessing your application again');
    }
    
    rl.close();
  });
}

main(); 