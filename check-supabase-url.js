// Script to check if the Supabase URL is accessible
require('dotenv').config();
const https = require('https');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

if (!supabaseUrl) {
  console.error('Supabase URL is not defined in .env file');
  process.exit(1);
}

console.log(`Checking if Supabase URL is accessible: ${supabaseUrl}`);

// Remove the https:// prefix for the hostname
const hostname = supabaseUrl.replace('https://', '');

const options = {
  hostname: hostname,
  port: 443,
  path: '/',
  method: 'GET'
};

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);

  if (res.statusCode >= 200 && res.statusCode < 300) {
    console.log('✅ Supabase URL is accessible');
  } else {
    console.log('❌ Supabase URL returned a non-success status code');
  }

  res.on('data', (chunk) => {
    // Don't log the full response body, just acknowledge receipt
    console.log('Received response data chunk');
  });
});

req.on('error', (e) => {
  console.error(`❌ Failed to connect to Supabase URL: ${e.message}`);
  process.exit(1);
});

req.end(); 