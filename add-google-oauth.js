/**
 * Add Google OAuth Credentials to .env File
 * 
 * This script adds Google OAuth credentials to your existing .env file
 * without disturbing other credentials.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=== Add Google OAuth Credentials to .env ===');
console.log('This script will add Google OAuth credentials to your existing .env file.');
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

// Function to update the .env file
function updateEnvFile(envInfo, googleClientId, googleClientSecret) {
  const envPath = envInfo.path;
  const envContent = envInfo.content;
  
  // Check if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET already exist
  const hasGoogleClientId = checkCredentialExists(envContent, 'GOOGLE_CLIENT_ID');
  const hasGoogleClientSecret = checkCredentialExists(envContent, 'GOOGLE_CLIENT_SECRET');
  
  let updatedContent = envContent;
  
  if (hasGoogleClientId) {
    // Replace existing GOOGLE_CLIENT_ID
    updatedContent = updatedContent.replace(
      /GOOGLE_CLIENT_ID\s*=\s*["']?[^"'\n]*["']?/,
      `GOOGLE_CLIENT_ID="${googleClientId}"`
    );
    console.log('✅ Updated existing GOOGLE_CLIENT_ID');
  } else {
    // Add GOOGLE_CLIENT_ID
    updatedContent += `\n# Google OAuth\nGOOGLE_CLIENT_ID="${googleClientId}"`;
    console.log('✅ Added GOOGLE_CLIENT_ID');
  }
  
  if (hasGoogleClientSecret) {
    // Replace existing GOOGLE_CLIENT_SECRET
    updatedContent = updatedContent.replace(
      /GOOGLE_CLIENT_SECRET\s*=\s*["']?[^"'\n]*["']?/,
      `GOOGLE_CLIENT_SECRET="${googleClientSecret}"`
    );
    console.log('✅ Updated existing GOOGLE_CLIENT_SECRET');
  } else {
    // Add GOOGLE_CLIENT_SECRET
    updatedContent += `\nGOOGLE_CLIENT_SECRET="${googleClientSecret}"`;
    console.log('✅ Added GOOGLE_CLIENT_SECRET');
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
  const envInfo = readEnvFile();
  
  if (!envInfo) {
    rl.close();
    return;
  }
  
  // Check if credentials already exist
  const hasGoogleClientId = checkCredentialExists(envInfo.content, 'GOOGLE_CLIENT_ID');
  const hasGoogleClientSecret = checkCredentialExists(envInfo.content, 'GOOGLE_CLIENT_SECRET');
  
  if (hasGoogleClientId && hasGoogleClientSecret) {
    console.log('✅ Google OAuth credentials already exist in your .env file.');
    console.log('If you want to update them, please edit the .env file manually.');
    rl.close();
    return;
  }
  
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
  
  let googleClientId = '';
  let googleClientSecret = '';
  
  if (!hasGoogleClientId) {
    rl.question('Enter your Google Client ID: ', (id) => {
      googleClientId = id;
      if (hasGoogleClientSecret) {
        // Only need to update the Client ID
        updateEnvFile(envInfo, googleClientId, '');
        console.log('');
        console.log('Next steps:');
        console.log('1. Restart your development server');
        console.log('2. Test your Google OAuth setup by signing in with Google');
        rl.close();
      } else {
        // Need both Client ID and Secret
        rl.question('Enter your Google Client Secret: ', (secret) => {
          googleClientSecret = secret;
          if (googleClientId && googleClientSecret) {
            updateEnvFile(envInfo, googleClientId, googleClientSecret);
            console.log('');
            console.log('Next steps:');
            console.log('1. Restart your development server');
            console.log('2. Test your Google OAuth setup by signing in with Google');
          } else {
            console.log('❌ Client ID and Client Secret are required.');
          }
          rl.close();
        });
      }
    });
  } else if (!hasGoogleClientSecret) {
    // Only need to add the Client Secret
    rl.question('Enter your Google Client Secret: ', (secret) => {
      googleClientSecret = secret;
      if (googleClientSecret) {
        // Extract the existing Client ID
        const clientIdMatch = envInfo.content.match(/GOOGLE_CLIENT_ID\s*=\s*["']?([^"'\n]*)["']?/);
        const existingClientId = clientIdMatch ? clientIdMatch[1] : '';
        
        updateEnvFile(envInfo, existingClientId, googleClientSecret);
        console.log('');
        console.log('Next steps:');
        console.log('1. Restart your development server');
        console.log('2. Test your Google OAuth setup by signing in with Google');
      } else {
        console.log('❌ Client Secret is required.');
      }
      rl.close();
    });
  }
}

main(); 