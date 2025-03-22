import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key
// You can get these from your Supabase project settings
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 