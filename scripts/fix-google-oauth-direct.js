/**
 * Fix Google OAuth Direct
 * 
 * This script directly checks and fixes Google OAuth credentials.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Fix Google OAuth Direct ===');
console.log('This script will directly check and fix your Google OAuth credentials.');
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
  
  if (!envPath) {
    console.log('❌ .env file not found. Please create one first.');
    return null;
  }
  
  try {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log(`✅ Found .env file at: ${envPath}`);
    return { path: envPath, content };
  } catch (error) {
    console.error('❌ Error reading .env file:', error);
    return null;
  }
}

// Function to update the .env file with new credentials
function updateEnvFile(envInfo, newClientId, newClientSecret) {
  const envPath = envInfo.path;
  let envContent = envInfo.content;
  
  // Update GOOGLE_CLIENT_ID
  if (envContent.includes('GOOGLE_CLIENT_ID=')) {
    envContent = envContent.replace(
      /GOOGLE_CLIENT_ID\s*=\s*["']?[^"'\n]*["']?/,
      `GOOGLE_CLIENT_ID="${newClientId}"`
    );
  } else {
    envContent += `\nGOOGLE_CLIENT_ID="${newClientId}"`;
  }
  
  // Update GOOGLE_CLIENT_SECRET
  if (envContent.includes('GOOGLE_CLIENT_SECRET=')) {
    envContent = envContent.replace(
      /GOOGLE_CLIENT_SECRET\s*=\s*["']?[^"'\n]*["']?/,
      `GOOGLE_CLIENT_SECRET="${newClientSecret}"`
    );
  } else {
    envContent += `\nGOOGLE_CLIENT_SECRET="${newClientSecret}"`;
  }
  
  // Update NEXTAUTH_URL
  if (envContent.includes('NEXTAUTH_URL=')) {
    envContent = envContent.replace(
      /NEXTAUTH_URL\s*=\s*["']?[^"'\n]*["']?/,
      `NEXTAUTH_URL="http://localhost:3000"`
    );
  } else {
    envContent += `\nNEXTAUTH_URL="http://localhost:3000"`;
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
  
  console.log('Please enter your Google OAuth credentials:');
  
  rl.question('Enter your Google Client ID: ', (clientId) => {
    if (!clientId) {
      console.log('❌ Client ID is required.');
      rl.close();
      return;
    }
    
    rl.question('Enter your Google Client Secret: ', (clientSecret) => {
      if (!clientSecret) {
        console.log('❌ Client Secret is required.');
        rl.close();
        return;
      }
      
      // Check if credentials are valid format
      const clientIdFormat = /^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/;
      const clientSecretFormat = /^[A-Za-z0-9_-]{24,}$/;
      
      const isClientIdValid = clientIdFormat.test(clientId);
      const isClientSecretValid = clientSecretFormat.test(clientSecret);
      
      if (!isClientIdValid) {
        console.log('❌ Client ID is not in the correct format.');
        console.log('It should look like: 123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com');
        rl.close();
        return;
      }
      
      if (!isClientSecretValid) {
        console.log('❌ Client Secret is not in the correct format.');
        console.log('It should be at least 24 characters long.');
        rl.close();
        return;
      }
      
      // Update the .env file
      if (updateEnvFile(envInfo, clientId, clientSecret)) {
        console.log('');
        console.log('✅ Google OAuth credentials updated successfully!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Make sure you have the following redirect URI in your Google Cloud Console:');
        console.log('   http://localhost:3000/api/auth/callback/google');
        console.log('2. Restart your Next.js server');
        console.log('3. Try signing in with Google again');
      }
      
      rl.close();
    });
  });
}

main(); 