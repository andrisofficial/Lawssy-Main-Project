require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Initializing Supabase client for database setup with URL:', supabaseUrl ? 'URL defined' : 'URL not defined');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Supabase credentials missing. Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL for creating tables
const tableCreationSQL = `
-- Create client_statuses table
CREATE TABLE IF NOT EXISTS client_statuses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table with enhanced fields
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_type TEXT NOT NULL CHECK (client_type IN ('Individual', 'Organization')),
  prefix TEXT,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  organization_name TEXT,
  title TEXT,
  date_of_birth DATE,
  primary_email TEXT,
  primary_phone TEXT,
  profile_photo_url TEXT,
  tags JSONB,
  custom_fields JSONB,
  payment_type TEXT,
  hourly_rate DECIMAL(10, 2),
  ledes_id TEXT,
  status_id UUID REFERENCES client_statuses(id),
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by UUID, -- This should reference your users table
  notes TEXT,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT client_type_name_check CHECK (
    (client_type = 'Individual' AND first_name IS NOT NULL) OR
    (client_type = 'Organization' AND organization_name IS NOT NULL)
  ),
  CONSTRAINT client_email_unique UNIQUE (primary_email)
);

-- Create client_contacts table for managing multiple contacts per client
CREATE TABLE IF NOT EXISTS client_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  role TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  is_billing BOOLEAN DEFAULT FALSE,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_addresses table for managing multiple addresses per client contact
CREATE TABLE IF NOT EXISTS client_addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_contact_id UUID NOT NULL REFERENCES client_contacts(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL CHECK (address_type IN ('Home', 'Work', 'Mailing', 'Other')),
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'USA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_emails table for managing multiple emails per client
CREATE TABLE IF NOT EXISTS client_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('Work', 'Personal', 'Other')),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_phones table for managing multiple phone numbers per client
CREATE TABLE IF NOT EXISTS client_phones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  phone_type TEXT NOT NULL CHECK (phone_type IN ('Work', 'Mobile', 'Home', 'Other')),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_websites table for managing multiple websites per client
CREATE TABLE IF NOT EXISTS client_websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  website_type TEXT NOT NULL CHECK (website_type IN ('Work', 'Personal', 'Portfolio', 'Other')),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_addresses_direct table for managing multiple addresses directly linked to clients
CREATE TABLE IF NOT EXISTS client_addresses_direct (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL CHECK (address_type IN ('Home', 'Work', 'Mailing', 'Other')),
  street TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'USA',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS client_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  old_status_id UUID REFERENCES client_statuses(id),
  new_status_id UUID REFERENCES client_statuses(id),
  changed_by UUID, -- This should reference your users table
  change_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create client_cases table for linking clients to cases/matters
CREATE TABLE IF NOT EXISTS client_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  case_id UUID NOT NULL, -- This should reference your cases/matters table
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT client_case_unique UNIQUE(client_id, case_id)
);

-- Add audit_log table if it doesn't exist already
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'VIEW')),
  old_values JSONB,
  new_values JSONB,
  changed_by UUID, -- This should reference your users table
  ip_address TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
`;

// SQL for inserting default client statuses
const statusInsertionSQL = `
-- Insert default client statuses
INSERT INTO client_statuses (name, description, color)
VALUES 
  ('Active', 'Currently active client', '#4CAF50'),
  ('Inactive', 'Inactive relationship', '#9E9E9E'),
  ('Pending', 'Pending review or onboarding', '#FFC107'),
  ('Consultation', 'Initial consultation stage', '#2196F3'),
  ('Closed', 'Case closed, relationship complete', '#F44336'),
  ('Archived', 'Archived client record', '#607D8B')
ON CONFLICT (name) DO NOTHING;
`;

// Function to verify client statuses exist
async function verifyClientStatuses() {
  try {
    console.log('Verifying client statuses...');
    
    // Check if client_statuses table exists and has data
    const { data, error } = await supabase
      .from('client_statuses')
      .select('*');
    
    if (error) {
      console.error('Error checking client statuses:', error);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.log('No client statuses found, will insert default statuses');
      return false;
    }
    
    console.log(`Found ${data.length} client statuses:`);
    data.forEach(status => {
      console.log(`- ${status.name} (${status.id})`);
    });
    
    return true;
  } catch (error) {
    console.error('Exception during status verification:', error);
    return false;
  }
}

async function createClientTables() {
  try {
    console.log('Starting client database setup...');
    
    // Step 1: Create tables
    console.log('Creating client database tables...');
    const { data: tableData, error: tableError } = await supabase.rpc('postgres_execute', { query_text: tableCreationSQL });
    
    if (tableError) {
      console.error('Error creating client tables:', tableError);
      process.exit(1);
    }
    
    console.log('Tables created successfully!');
    
    // Step 2: Verify or insert statuses
    const statusesExist = await verifyClientStatuses();
    
    if (!statusesExist) {
      console.log('Inserting default client statuses...');
      const { data: statusData, error: statusError } = await supabase.rpc('postgres_execute', { query_text: statusInsertionSQL });
      
      if (statusError) {
        console.error('Error inserting default client statuses:', statusError);
        process.exit(1);
      }
      
      console.log('Default client statuses inserted successfully!');
      
      // Verify statuses were inserted
      await verifyClientStatuses();
    }
    
    console.log('Client database setup completed successfully!');
  } catch (error) {
    console.error('Exception occurred during database setup:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createClientTables(); 