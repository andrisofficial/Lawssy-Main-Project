import { createClient } from '@supabase/supabase-js';

// Supabase credentials from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Log to help debug initialization issues
console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? 'Available' : 'Missing');

// Check for missing credentials
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in your .env file.');
}

// Create Supabase client with options
const supabase = createClient(supabaseUrl || 'https://example.supabase.co', supabaseAnonKey || 'fallback-key', {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'legal-saas' },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Create a mock client that can be used if the real client fails
const createMockClient = () => {
  console.log('⚠️ Using mock Supabase client due to connection issues');
  
  return {
    from: (table) => {
      console.log(`Mock: Accessing table ${table}`);
      
      return {
        select: () => {
          console.log(`Mock: Selecting from ${table}`);
          return Promise.resolve({ data: [], error: null });
        },
        insert: () => {
          console.log(`Mock: Inserting into ${table}`);
          return Promise.resolve({ data: null, error: null });
        },
        update: () => {
          console.log(`Mock: Updating ${table}`);
          return Promise.resolve({ data: null, error: null });
        },
        delete: () => {
          console.log(`Mock: Deleting from ${table}`);
          return Promise.resolve({ data: null, error: null });
        },
        upsert: () => {
          console.log(`Mock: Upserting into ${table}`);
          return Promise.resolve({ data: null, error: null });
        }
      };
    },
    auth: {
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        list: () => Promise.resolve({ data: [], error: null }),
        download: () => Promise.resolve({ data: null, error: null })
      })
    }
  };
};

// Create a resilient client that falls back to a mock implementation
// if the real client has connection issues
let isUsingMockClient = false;
let mockClient = null;

const resilientSupabase = new Proxy({}, {
  get: function(target, prop) {
    if (isUsingMockClient) {
      if (!mockClient) {
        mockClient = createMockClient();
      }
      return mockClient[prop];
    }
    
    if (prop === 'from' && !supabaseUrl) {
      console.warn('Supabase URL is missing, using mock client');
      isUsingMockClient = true;
      mockClient = createMockClient();
      return mockClient.from;
    }
    
    return supabase[prop];
  }
});

// Test connection on initialization (but don't block app startup)
supabase.from('connection_test').select('*').limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Error connecting to Supabase on initialization:', error);
      isUsingMockClient = true;
      mockClient = createMockClient();
    } else {
      console.log('✅ Supabase connection initialized successfully');
    }
  })
  .catch(err => {
    console.error('Exception during Supabase initialization test:', err);
    isUsingMockClient = true;
    mockClient = createMockClient();
  });

// Add simple logging wrapper for debugging
const supabaseWithLogging = {
  from: (table) => {
    console.log(`Accessing table: ${table}`);
    
    // Use resilient client to get the appropriate implementation
    const query = resilientSupabase.from(table);
    
    // Add logging for select operations
    const originalSelect = query.select;
    query.select = function(columns) {
      console.log(`Selecting from ${table}${columns ? `: ${columns}` : ''}`);
      return originalSelect.apply(this, arguments);
    };
    
    return query;
  },
  
  // Forward other methods to the resilient client
  auth: resilientSupabase.auth,
  storage: resilientSupabase.storage,
  rpc: function() {
    console.log('Calling RPC function');
    return resilientSupabase.rpc.apply(resilientSupabase, arguments);
  }
};

export default supabaseWithLogging; 