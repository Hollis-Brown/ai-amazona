/**
 * Verify Google OAuth Credentials
 * 
 * This script helps you verify your Google OAuth credentials.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Verify Google OAuth Credentials ===');
console.log('This script will help you verify your Google OAuth credentials.');
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

// Function to extract a credential value from the .env file
function extractCredentialValue(envContent, credentialName) {
  const match = envContent.match(new RegExp(`${credentialName}\\s*=\\s*["']?([^"'\n]*)["']?`));
  return match ? match[1] : null;
}

// Main function
function main() {
  const envInfo = readEnvFile();
  
  if (!envInfo) {
    rl.close();
    return;
  }
  
  // Extract credentials
  const googleClientId = extractCredentialValue(envInfo.content, 'GOOGLE_CLIENT_ID');
  const googleClientSecret = extractCredentialValue(envInfo.content, 'GOOGLE_CLIENT_SECRET');
  const nextAuthUrl = extractCredentialValue(envInfo.content, 'NEXTAUTH_URL');
  
  // Check if credentials exist
  if (!googleClientId || !googleClientSecret) {
    console.log('❌ Google OAuth credentials are not properly configured in your .env file.');
    console.log('Please make sure you have GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET set.');
    rl.close();
    return;
  }
  
  // Check if credentials are valid format
  const clientIdFormat = /^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/;
  const clientSecretFormat = /^[A-Za-z0-9_-]{24,}$/;
  
  const isClientIdValid = clientIdFormat.test(googleClientId);
  const isClientSecretValid = clientSecretFormat.test(googleClientSecret);
  
  console.log('Google OAuth Credentials Status:');
  console.log(`GOOGLE_CLIENT_ID: ${googleClientId ? '✅ Found' : '❌ Missing'}`);
  console.log(`GOOGLE_CLIENT_SECRET: ${googleClientSecret ? '✅ Found' : '❌ Missing'}`);
  console.log(`NEXTAUTH_URL: ${nextAuthUrl ? '✅ Found' : '❌ Missing'}`);
  
  console.log('');
  console.log('Credential Format Validation:');
  console.log(`Client ID Format: ${isClientIdValid ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`Client Secret Format: ${isClientSecretValid ? '✅ Valid' : '❌ Invalid'}`);
  
  if (!isClientIdValid || !isClientSecretValid) {
    console.log('');
    console.log('❌ Your Google OAuth credentials are not in the correct format.');
    console.log('Please check your Google Cloud Console and make sure you have the correct credentials.');
  }
  
  console.log('');
  console.log('Redirect URI:');
  console.log(`http://localhost:3000/api/auth/callback/google`);
  
  console.log('');
  console.log('Next steps:');
  console.log('1. Go to the Google Cloud Console: https://console.cloud.google.com/');
  console.log('2. Navigate to "APIs & Services" > "Credentials"');
  console.log('3. Find your OAuth 2.0 Client ID and click on it');
  console.log('4. Under "Authorized redirect URIs", make sure you have:');
  console.log('   http://localhost:3000/api/auth/callback/google');
  console.log('5. Click "Save"');
  
  rl.close();
}

main(); 