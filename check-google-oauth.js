/**
 * Google OAuth Configuration Checker
 * 
 * This script checks if Google OAuth credentials are properly configured in your .env file.
 */

const fs = require('fs');
const path = require('path');

console.log('=== Google OAuth Configuration Checker ===');
console.log('Checking your .env file for Google OAuth credentials...');
console.log('');

// Function to read the .env file
function readEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  try {
    if (fs.existsSync(envPath)) {
      return fs.readFileSync(envPath, 'utf8');
    }
    console.log('❌ .env file not found. Please create one first.');
    return null;
  } catch (error) {
    console.error('❌ Error reading .env file:', error);
    return null;
  }
}

// Function to check if a credential exists in the .env file
function checkCredentialExists(envContent, credentialName) {
  return envContent.includes(`${credentialName}=`);
}

// Function to extract a credential value from the .env file
function extractCredentialValue(envContent, credentialName) {
  const match = envContent.match(new RegExp(`${credentialName}="([^"]+)"`));
  return match ? match[1] : null;
}

// Main function
function main() {
  const envContent = readEnvFile();
  
  if (!envContent) {
    return;
  }
  
  // Check if credentials exist
  const hasGoogleClientId = checkCredentialExists(envContent, 'GOOGLE_CLIENT_ID');
  const hasGoogleClientSecret = checkCredentialExists(envContent, 'GOOGLE_CLIENT_SECRET');
  
  console.log('Google OAuth Credentials Status:');
  console.log(`GOOGLE_CLIENT_ID: ${hasGoogleClientId ? '✅ Found' : '❌ Missing'}`);
  console.log(`GOOGLE_CLIENT_SECRET: ${hasGoogleClientSecret ? '✅ Found' : '❌ Missing'}`);
  
  if (hasGoogleClientId && hasGoogleClientSecret) {
    const clientId = extractCredentialValue(envContent, 'GOOGLE_CLIENT_ID');
    const clientSecret = extractCredentialValue(envContent, 'GOOGLE_CLIENT_SECRET');
    
    console.log('');
    console.log('Your Google OAuth credentials are properly configured!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Make sure your Google Cloud Console project is properly configured:');
    console.log('   - OAuth consent screen is set up');
    console.log('   - Authorized JavaScript origins include: http://localhost:3000');
    console.log('   - Authorized redirect URIs include: http://localhost:3000/api/auth/callback/google');
    console.log('2. Restart your development server if you made any changes');
    console.log('3. Test your Google OAuth setup by signing in with Google');
  } else {
    console.log('');
    console.log('❌ Your Google OAuth credentials are not properly configured.');
    console.log('Please add the missing credentials to your .env file:');
    console.log('');
    console.log('# Google OAuth');
    console.log('GOOGLE_CLIENT_ID="your_client_id_here"');
    console.log('GOOGLE_CLIENT_SECRET="your_client_secret_here"');
    console.log('');
    console.log('For detailed instructions, see GOOGLE_OAUTH_SETUP.md');
  }
}

main(); 