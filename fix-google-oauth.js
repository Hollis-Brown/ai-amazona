/**
 * Fix Google OAuth Redirect URI Mismatch
 * 
 * This script helps you fix the "redirect_uri_mismatch" error in Google OAuth.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Fix Google OAuth Redirect URI Mismatch ===');
console.log('This script will help you fix the "redirect_uri_mismatch" error in Google OAuth.');
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

// Function to check if a credential exists in the .env file
function checkCredentialExists(envContent, credentialName) {
  // Check for different formats
  const patterns = [
    `${credentialName}=`,
    `${credentialName} =`,
    `${credentialName}:`,
    `${credentialName} :`
  ];
  
  return patterns.some(pattern => envContent.includes(pattern));
}

// Function to extract a credential value from the .env file
function extractCredentialValue(envContent, credentialName) {
  const match = envContent.match(new RegExp(`${credentialName}\\s*=\\s*["']?([^"'\n]*)["']?`));
  return match ? match[1] : null;
}

// Function to update the .env file with the correct redirect URI
function updateEnvFile(envInfo, redirectUri) {
  const envPath = envInfo.path;
  const envContent = envInfo.content;
  
  // Check if NEXTAUTH_URL already exists
  const hasNextAuthUrl = checkCredentialExists(envContent, 'NEXTAUTH_URL');
  
  let updatedContent = envContent;
  
  if (hasNextAuthUrl) {
    // Replace existing NEXTAUTH_URL
    updatedContent = updatedContent.replace(
      /NEXTAUTH_URL\s*=\s*["']?[^"'\n]*["']?/,
      `NEXTAUTH_URL="${redirectUri}"`
    );
    console.log('✅ Updated existing NEXTAUTH_URL');
  } else {
    // Add NEXTAUTH_URL
    updatedContent += `\n# NextAuth Configuration\nNEXTAUTH_URL="${redirectUri}"`;
    console.log('✅ Added NEXTAUTH_URL');
  }
  
  try {
    fs.writeFileSync(envPath, updatedContent);
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
  
  // Check if credentials exist
  const hasGoogleClientId = checkCredentialExists(envInfo.content, 'GOOGLE_CLIENT_ID');
  const hasGoogleClientSecret = checkCredentialExists(envInfo.content, 'GOOGLE_CLIENT_SECRET');
  
  if (!hasGoogleClientId || !hasGoogleClientSecret) {
    console.log('❌ Google OAuth credentials are not properly configured in your .env file.');
    console.log('Please run the add-google-credentials.js script first.');
    rl.close();
    return;
  }
  
  console.log('Google OAuth Credentials Status:');
  console.log(`GOOGLE_CLIENT_ID: ${hasGoogleClientId ? '✅ Found' : '❌ Missing'}`);
  console.log(`GOOGLE_CLIENT_SECRET: ${hasGoogleClientSecret ? '✅ Found' : '❌ Missing'}`);
  
  console.log('');
  console.log('To fix the "redirect_uri_mismatch" error, you need to:');
  console.log('1. Go to the Google Cloud Console: https://console.cloud.google.com/');
  console.log('2. Navigate to "APIs & Services" > "Credentials"');
  console.log('3. Find your OAuth 2.0 Client ID and click on it');
  console.log('4. Under "Authorized redirect URIs", add the following URI:');
  console.log('   http://localhost:3000/api/auth/callback/google');
  console.log('5. Click "Save"');
  console.log('');
  
  rl.question('Enter your application URL (e.g., http://localhost:3000): ', (redirectUri) => {
    if (redirectUri) {
      if (updateEnvFile(envInfo, redirectUri)) {
        console.log('');
        console.log('Next steps:');
        console.log('1. Make sure you added the redirect URI to your Google Cloud Console project');
        console.log('2. Restart your development server');
        console.log('3. Test your Google OAuth setup by signing in with Google');
      }
    } else {
      console.log('❌ Application URL is required.');
    }
    rl.close();
  });
}

main(); 