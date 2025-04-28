/**
 * Add Google OAuth Credentials to .env File
 * 
 * This script directly adds Google OAuth credentials to your .env file.
 */

const fs = require('fs');
const path = require('path');

// Google OAuth credentials
const GOOGLE_CLIENT_ID = '49251234294-raa6mfajr9j5gih2jbm2p08i7ne3vs3d.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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'; // Client Secret added

console.log('=== Adding Google OAuth Credentials to .env ===');

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

// Function to update the .env file
function updateEnvFile(envPath) {
  try {
    // Read the current .env file
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if credentials already exist
    const hasGoogleClientId = envContent.includes('GOOGLE_CLIENT_ID=');
    const hasGoogleClientSecret = envContent.includes('GOOGLE_CLIENT_SECRET=');
    
    // Update or add GOOGLE_CLIENT_ID
    if (hasGoogleClientId) {
      envContent = envContent.replace(
        /GOOGLE_CLIENT_ID\s*=\s*["']?[^"'\n]*["']?/,
        `GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID}"`
      );
      console.log('✅ Updated existing GOOGLE_CLIENT_ID');
    } else {
      envContent += `\n# Google OAuth\nGOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID}"`;
      console.log('✅ Added GOOGLE_CLIENT_ID');
    }
    
    // Update or add GOOGLE_CLIENT_SECRET if provided
    if (GOOGLE_CLIENT_SECRET) {
      if (hasGoogleClientSecret) {
        envContent = envContent.replace(
          /GOOGLE_CLIENT_SECRET\s*=\s*["']?[^"'\n]*["']?/,
          `GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET}"`
        );
        console.log('✅ Updated existing GOOGLE_CLIENT_SECRET');
      } else {
        envContent += `\nGOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET}"`;
        console.log('✅ Added GOOGLE_CLIENT_SECRET');
      }
    } else if (!hasGoogleClientSecret) {
      console.log('⚠️ GOOGLE_CLIENT_SECRET is not provided. Please add it manually to your .env file.');
    }
    
    // Write the updated content back to the .env file
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
  const envPath = findEnvFile();
  
  if (!envPath) {
    console.log('❌ .env file not found. Please create one first.');
    return;
  }
  
  console.log(`✅ Found .env file at: ${envPath}`);
  
  if (updateEnvFile(envPath)) {
    console.log('');
    console.log('Next steps:');
    console.log('1. Make sure your Google Cloud Console project is properly configured:');
    console.log('   - OAuth consent screen is set up');
    console.log('   - Authorized JavaScript origins include: http://localhost:3000');
    console.log('   - Authorized redirect URIs include: http://localhost:3000/api/auth/callback/google');
    console.log('2. Restart your development server');
    console.log('3. Test your Google OAuth setup by signing in with Google');
  }
}

main(); 