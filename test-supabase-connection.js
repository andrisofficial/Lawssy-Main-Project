// Simple script to test Supabase connection
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl ? supabaseUrl : 'URL is missing!');
console.log('Anon Key:', supabaseAnonKey ? 'Key is defined' : 'Key is missing!');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERROR: Supabase credentials are missing. Check your .env file.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Simple query to test connection
    console.log('Attempting to connect to Supabase...');
    const { data, error } = await supabase
      .from('client_statuses')
      .select('count()', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      if (error.code) {
        console.error('Error code:', error.code);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }
      if (error.hint) {
        console.error('Error hint:', error.hint);
      }
      process.exit(1);
    }
    
    console.log('✅ Successfully connected to Supabase!');
    console.log('You can now run the setup-client-db script to create your database tables.');
    process.exit(0);
  } catch (err) {
    console.error('Exception while testing connection:', err);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    process.exit(1);
  }
}

testConnection(); 