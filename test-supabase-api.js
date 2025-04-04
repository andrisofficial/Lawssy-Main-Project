// Script to test the Supabase REST API endpoint
require('dotenv').config();
const fetch = require('node-fetch');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Check your .env file.');
  process.exit(1);
}

console.log('Testing Supabase REST API endpoint...');
console.log('URL:', supabaseUrl);

// Test both with and without the /rest/v1 path
const testEndpoints = [
  `${supabaseUrl}/rest/v1/client_statuses?select=count`,
  `${supabaseUrl}/client_statuses?select=count`,
];

async function testEndpoint(url) {
  try {
    console.log(`Testing endpoint: ${url}`);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    const status = response.status;
    console.log(`Status code: ${status}`);
    
    if (status >= 200 && status < 300) {
      console.log('✅ Endpoint accessible');
      const data = await response.json();
      console.log('Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ Endpoint returned error status');
      try {
        const errorData = await response.text();
        console.log('Error response:', errorData);
      } catch (e) {
        console.log('Could not read error response body');
      }
      return false;
    }
  } catch (error) {
    console.error('Error testing endpoint:', error.message);
    return false;
  }
}

async function runTests() {
  let success = false;
  
  for (const endpoint of testEndpoints) {
    console.log('\n--------');
    const result = await testEndpoint(endpoint);
    if (result) {
      success = true;
      console.log(`✅ Successfully connected to: ${endpoint}`);
    }
  }
  
  if (success) {
    console.log('\n✅ At least one Supabase endpoint is accessible.');
    process.exit(0);
  } else {
    console.log('\n❌ All Supabase endpoints failed. Please check your credentials and project status.');
    process.exit(1);
  }
}

runTests(); 