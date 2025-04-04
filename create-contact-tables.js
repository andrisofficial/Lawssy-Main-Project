/**
 * Database schema creation script for client contacts and addresses
 * This script will create the necessary tables for Phase 2 - Contact Management
 * 
 * Run with: node create-contact-tables.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Starting database setup for client contacts...');

    // 1. Create client_contacts table
    console.log('Creating client_contacts table...');
    const { error: contactsError } = await supabase.rpc('create_client_contacts_table', {});
    
    if (contactsError) {
      throw new Error(`Error creating client_contacts table: ${contactsError.message}`);
    }
    
    // 2. Create client_addresses table
    console.log('Creating client_addresses table...');
    const { error: addressesError } = await supabase.rpc('create_client_addresses_table', {});
    
    if (addressesError) {
      throw new Error(`Error creating client_addresses table: ${addressesError.message}`);
    }
    
    // 3. Create the stored procedures for table creation if they don't exist yet
    console.log('Creating or updating stored procedures...');
    await createStoredProcedures();
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

async function createStoredProcedures() {
  // Create stored procedure for client_contacts table
  const createContactsTableSQL = `
  CREATE OR REPLACE FUNCTION create_client_contacts_table()
  RETURNS void
  LANGUAGE plpgsql
  AS $$
  BEGIN
    -- Create client_contacts table if it doesn't exist
    CREATE TABLE IF NOT EXISTS client_contacts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100),
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      role VARCHAR(100),
      is_primary BOOLEAN DEFAULT false,
      is_billing BOOLEAN DEFAULT false,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_client_contacts_client_id ON client_contacts(client_id);
    CREATE INDEX IF NOT EXISTS idx_client_contacts_email ON client_contacts(email);
    CREATE INDEX IF NOT EXISTS idx_client_contacts_is_primary ON client_contacts(is_primary);
    CREATE INDEX IF NOT EXISTS idx_client_contacts_is_billing ON client_contacts(is_billing);
    
    -- Create RLS policies
    ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
    
    -- Allow authenticated users to view, create, update, and delete records
    DROP POLICY IF EXISTS client_contacts_select_policy ON client_contacts;
    CREATE POLICY client_contacts_select_policy ON client_contacts
      FOR SELECT USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS client_contacts_insert_policy ON client_contacts;
    CREATE POLICY client_contacts_insert_policy ON client_contacts
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS client_contacts_update_policy ON client_contacts;
    CREATE POLICY client_contacts_update_policy ON client_contacts
      FOR UPDATE USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS client_contacts_delete_policy ON client_contacts;
    CREATE POLICY client_contacts_delete_policy ON client_contacts
      FOR DELETE USING (auth.role() = 'authenticated');
  END;
  $$;
  `;
  
  // Create stored procedure for client_addresses table
  const createAddressesTableSQL = `
  CREATE OR REPLACE FUNCTION create_client_addresses_table()
  RETURNS void
  LANGUAGE plpgsql
  AS $$
  BEGIN
    -- Create client_addresses table if it doesn't exist
    CREATE TABLE IF NOT EXISTS client_addresses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_contact_id UUID NOT NULL REFERENCES client_contacts(id) ON DELETE CASCADE,
      address_type VARCHAR(50) NOT NULL, -- 'Home', 'Work', 'Billing', etc.
      street VARCHAR(255) NOT NULL,
      street2 VARCHAR(255),
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      zip VARCHAR(20) NOT NULL,
      country VARCHAR(100) NOT NULL DEFAULT 'United States',
      is_primary BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_client_addresses_contact_id ON client_addresses(client_contact_id);
    CREATE INDEX IF NOT EXISTS idx_client_addresses_is_primary ON client_addresses(is_primary);
    
    -- Create RLS policies
    ALTER TABLE client_addresses ENABLE ROW LEVEL SECURITY;
    
    -- Allow authenticated users to view, create, update, and delete records
    DROP POLICY IF EXISTS client_addresses_select_policy ON client_addresses;
    CREATE POLICY client_addresses_select_policy ON client_addresses
      FOR SELECT USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS client_addresses_insert_policy ON client_addresses;
    CREATE POLICY client_addresses_insert_policy ON client_addresses
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS client_addresses_update_policy ON client_addresses;
    CREATE POLICY client_addresses_update_policy ON client_addresses
      FOR UPDATE USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS client_addresses_delete_policy ON client_addresses;
    CREATE POLICY client_addresses_delete_policy ON client_addresses
      FOR DELETE USING (auth.role() = 'authenticated');
  END;
  $$;
  `;

  // Create the stored procedures
  const { error: contactsSpError } = await supabase.rpc('exec_sql', { sql: createContactsTableSQL });
  if (contactsSpError) {
    throw new Error(`Error creating contacts stored procedure: ${contactsSpError.message}`);
  }
  
  const { error: addressesSpError } = await supabase.rpc('exec_sql', { sql: createAddressesTableSQL });
  if (addressesSpError) {
    throw new Error(`Error creating addresses stored procedure: ${addressesSpError.message}`);
  }
}

// Run the table creation
createTables(); 