/**
 * Google OAuth Setup Helper Script
 * 
 * This script helps you set up Google OAuth credentials for your Next.js application.
 * It will guide you through the process of creating a Google OAuth client and updating your .env file.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Google OAuth Setup Helper ===');
console.log('This script will help you set up Google OAuth credentials for your Next.js application.');
console.log('');

// Function to read the .env file
function readEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  try {
    if (fs.existsSync(envPath)) {
      return fs.readFileSync(envPath, 'utf8');
    }
    return '';
  } catch (error) {
    console.error('Error reading .env file:', error);
    return '';
  }
}

// Function to update the .env file
function updateEnvFile(envContent, googleClientId, googleClientSecret) {
  const envPath = path.join(process.cwd(), '.env');
  
  // Check if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET already exist
  const hasGoogleClientId = envContent.includes('GOOGLE_CLIENT_ID=');
  const hasGoogleClientSecret = envContent.includes('GOOGLE_CLIENT_SECRET=');
  
  let updatedContent = envContent;
  
  if (hasGoogleClientId) {
    // Replace existing GOOGLE_CLIENT_ID
    updatedContent = updatedContent.replace(
      /GOOGLE_CLIENT_ID=.*/,
      `GOOGLE_CLIENT_ID="${googleClientId}"`
    );
  } else {
    // Add GOOGLE_CLIENT_ID
    updatedContent += `\n# Google OAuth\nGOOGLE_CLIENT_ID="${googleClientId}"`;
  }
  
  if (hasGoogleClientSecret) {
    // Replace existing GOOGLE_CLIENT_SECRET
    updatedContent = updatedContent.replace(
      /GOOGLE_CLIENT_SECRET=.*/,
      `GOOGLE_CLIENT_SECRET="${googleClientSecret}"`
    );
  } else {
    // Add GOOGLE_CLIENT_SECRET
    updatedContent += `\nGOOGLE_CLIENT_SECRET="${googleClientSecret}"`;
  }
  
  try {
    fs.writeFileSync(envPath, updatedContent);
    console.log('✅ .env file updated successfully!');
  } catch (error) {
    console.error('❌ Error updating .env file:', error);
  }
}

// Main function
async function main() {
  const envContent = readEnvFile();
  
  console.log('To set up Google OAuth, follow these steps:');
  console.log('1. Go to the Google Cloud Console: https://console.cloud.google.com/');
  console.log('2. Create a new project or select an existing one');
  console.log('3. Navigate to "APIs & Services" > "OAuth consent screen"');
  console.log('4. Configure the OAuth consent screen');
  console.log('5. Navigate to "APIs & Services" > "Credentials"');
  console.log('6. Click "Create Credentials" > "OAuth client ID"');
  console.log('7. Select "Web application" as the application type');
  console.log('8. Set the following:');
  console.log('   - Name: "AI Amazona Web Client" (or your app name)');
  console.log('   - Authorized JavaScript origins: http://localhost:3000');
  console.log('   - Authorized redirect URIs: http://localhost:3000/api/auth/callback/google');
  console.log('9. Click "Create" to get your Client ID and Client Secret');
  console.log('');
  
  rl.question('Enter your Google Client ID: ', (googleClientId) => {
    rl.question('Enter your Google Client Secret: ', (googleClientSecret) => {
      if (googleClientId && googleClientSecret) {
        updateEnvFile(envContent, googleClientId, googleClientSecret);
        console.log('');
        console.log('Next steps:');
        console.log('1. Restart your development server');
        console.log('2. Test your Google OAuth setup by signing in with Google');
        console.log('');
        console.log('For more detailed instructions, see GOOGLE_OAUTH_SETUP.md');
      } else {
        console.log('❌ Client ID and Client Secret are required.');
      }
      rl.close();
    });
  });
}

main(); 