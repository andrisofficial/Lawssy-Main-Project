/**
 * Database schema creation script for cases and client-case associations
 * This script will create the necessary tables for Phase 3 - Case Association
 * 
 * Run with: node create-case-tables.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('Starting database setup for cases and client-case associations...');

    // 1. Create case_types table
    console.log('Creating case_types table...');
    const { error: typesError } = await supabase.rpc('create_case_types_table', {});
    
    if (typesError) {
      throw new Error(`Error creating case_types table: ${typesError.message}`);
    }
    
    // 2. Create case_statuses table
    console.log('Creating case_statuses table...');
    const { error: statusesError } = await supabase.rpc('create_case_statuses_table', {});
    
    if (statusesError) {
      throw new Error(`Error creating case_statuses table: ${statusesError.message}`);
    }
    
    // 3. Create cases table
    console.log('Creating cases table...');
    const { error: casesError } = await supabase.rpc('create_cases_table', {});
    
    if (casesError) {
      throw new Error(`Error creating cases table: ${casesError.message}`);
    }
    
    // 4. Create client_case_associations table
    console.log('Creating client_case_associations table...');
    const { error: associationsError } = await supabase.rpc('create_client_case_associations_table', {});
    
    if (associationsError) {
      throw new Error(`Error creating client_case_associations table: ${associationsError.message}`);
    }
    
    // 5. Create the stored procedures for table creation if they don't exist yet
    console.log('Creating or updating stored procedures...');
    await createStoredProcedures();
    
    // 6. Insert default case types and statuses
    console.log('Inserting default case types and statuses...');
    await insertDefaultData();
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

async function createStoredProcedures() {
  // Create stored procedure for case_types table
  const createCaseTypesTableSQL = `
  CREATE OR REPLACE FUNCTION create_case_types_table()
  RETURNS void
  LANGUAGE plpgsql
  AS $$
  BEGIN
    -- Create case_types table if it doesn't exist
    CREATE TABLE IF NOT EXISTS case_types (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      color VARCHAR(20),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_case_types_name ON case_types(name);
    CREATE INDEX IF NOT EXISTS idx_case_types_is_active ON case_types(is_active);
    
    -- Create RLS policies
    ALTER TABLE case_types ENABLE ROW LEVEL SECURITY;
    
    -- Allow authenticated users to view, create, update, and delete records
    DROP POLICY IF EXISTS case_types_select_policy ON case_types;
    CREATE POLICY case_types_select_policy ON case_types
      FOR SELECT USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS case_types_insert_policy ON case_types;
    CREATE POLICY case_types_insert_policy ON case_types
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS case_types_update_policy ON case_types;
    CREATE POLICY case_types_update_policy ON case_types
      FOR UPDATE USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS case_types_delete_policy ON case_types;
    CREATE POLICY case_types_delete_policy ON case_types
      FOR DELETE USING (auth.role() = 'authenticated');
  END;
  $$;
  `;
  
  // Create stored procedure for case_statuses table
  const createCaseStatusesTableSQL = `
  CREATE OR REPLACE FUNCTION create_case_statuses_table()
  RETURNS void
  LANGUAGE plpgsql
  AS $$
  BEGIN
    -- Create case_statuses table if it doesn't exist
    CREATE TABLE IF NOT EXISTS case_statuses (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      description TEXT,
      color VARCHAR(20),
      display_order INTEGER NOT NULL,
      is_active BOOLEAN DEFAULT true,
      is_default BOOLEAN DEFAULT false,
      is_closed BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_case_statuses_name ON case_statuses(name);
    CREATE INDEX IF NOT EXISTS idx_case_statuses_display_order ON case_statuses(display_order);
    CREATE INDEX IF NOT EXISTS idx_case_statuses_is_active ON case_statuses(is_active);
    CREATE INDEX IF NOT EXISTS idx_case_statuses_is_default ON case_statuses(is_default);
    CREATE INDEX IF NOT EXISTS idx_case_statuses_is_closed ON case_statuses(is_closed);
    
    -- Create RLS policies
    ALTER TABLE case_statuses ENABLE ROW LEVEL SECURITY;
    
    -- Allow authenticated users to view, create, update, and delete records
    DROP POLICY IF EXISTS case_statuses_select_policy ON case_statuses;
    CREATE POLICY case_statuses_select_policy ON case_statuses
      FOR SELECT USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS case_statuses_insert_policy ON case_statuses;
    CREATE POLICY case_statuses_insert_policy ON case_statuses
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS case_statuses_update_policy ON case_statuses;
    CREATE POLICY case_statuses_update_policy ON case_statuses
      FOR UPDATE USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS case_statuses_delete_policy ON case_statuses;
    CREATE POLICY case_statuses_delete_policy ON case_statuses
      FOR DELETE USING (auth.role() = 'authenticated');
  END;
  $$;
  `;
  
  // Create stored procedure for cases table
  const createCasesTableSQL = `
  CREATE OR REPLACE FUNCTION create_cases_table()
  RETURNS void
  LANGUAGE plpgsql
  AS $$
  BEGIN
    -- Create cases table if it doesn't exist
    CREATE TABLE IF NOT EXISTS cases (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      case_number VARCHAR(50) NOT NULL UNIQUE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      type_id UUID REFERENCES case_types(id),
      status_id UUID REFERENCES case_statuses(id),
      assigned_to UUID REFERENCES auth.users(id),
      opened_date DATE NOT NULL,
      closed_date DATE,
      filing_date DATE,
      court VARCHAR(255),
      judge VARCHAR(255),
      opposing_counsel VARCHAR(255),
      is_archived BOOLEAN DEFAULT false,
      priority VARCHAR(20) DEFAULT 'Medium', -- Low, Medium, High, Urgent
      notes TEXT,
      created_by UUID REFERENCES auth.users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_cases_case_number ON cases(case_number);
    CREATE INDEX IF NOT EXISTS idx_cases_title ON cases(title);
    CREATE INDEX IF NOT EXISTS idx_cases_type_id ON cases(type_id);
    CREATE INDEX IF NOT EXISTS idx_cases_status_id ON cases(status_id);
    CREATE INDEX IF NOT EXISTS idx_cases_assigned_to ON cases(assigned_to);
    CREATE INDEX IF NOT EXISTS idx_cases_is_archived ON cases(is_archived);
    CREATE INDEX IF NOT EXISTS idx_cases_priority ON cases(priority);
    CREATE INDEX IF NOT EXISTS idx_cases_opened_date ON cases(opened_date);
    CREATE INDEX IF NOT EXISTS idx_cases_closed_date ON cases(closed_date);
    
    -- Create RLS policies
    ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
    
    -- Allow authenticated users to view, create, update, and delete records
    DROP POLICY IF EXISTS cases_select_policy ON cases;
    CREATE POLICY cases_select_policy ON cases
      FOR SELECT USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS cases_insert_policy ON cases;
    CREATE POLICY cases_insert_policy ON cases
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS cases_update_policy ON cases;
    CREATE POLICY cases_update_policy ON cases
      FOR UPDATE USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS cases_delete_policy ON cases;
    CREATE POLICY cases_delete_policy ON cases
      FOR DELETE USING (auth.role() = 'authenticated');
  END;
  $$;
  `;
  
  // Create stored procedure for client_case_associations table
  const createClientCaseAssociationsTableSQL = `
  CREATE OR REPLACE FUNCTION create_client_case_associations_table()
  RETURNS void
  LANGUAGE plpgsql
  AS $$
  BEGIN
    -- Create client_case_associations table if it doesn't exist
    CREATE TABLE IF NOT EXISTS client_case_associations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
      case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
      role VARCHAR(100), -- Primary Client, Co-Plaintiff, Defendant, Witness, etc.
      is_primary BOOLEAN DEFAULT false,
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(client_id, case_id)
    );
    
    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_client_case_associations_client_id ON client_case_associations(client_id);
    CREATE INDEX IF NOT EXISTS idx_client_case_associations_case_id ON client_case_associations(case_id);
    CREATE INDEX IF NOT EXISTS idx_client_case_associations_is_primary ON client_case_associations(is_primary);
    
    -- Create RLS policies
    ALTER TABLE client_case_associations ENABLE ROW LEVEL SECURITY;
    
    -- Allow authenticated users to view, create, update, and delete records
    DROP POLICY IF EXISTS client_case_associations_select_policy ON client_case_associations;
    CREATE POLICY client_case_associations_select_policy ON client_case_associations
      FOR SELECT USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS client_case_associations_insert_policy ON client_case_associations;
    CREATE POLICY client_case_associations_insert_policy ON client_case_associations
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS client_case_associations_update_policy ON client_case_associations;
    CREATE POLICY client_case_associations_update_policy ON client_case_associations
      FOR UPDATE USING (auth.role() = 'authenticated');
      
    DROP POLICY IF EXISTS client_case_associations_delete_policy ON client_case_associations;
    CREATE POLICY client_case_associations_delete_policy ON client_case_associations
      FOR DELETE USING (auth.role() = 'authenticated');
  END;
  $$;
  `;

  // Create the stored procedures
  const { error: caseTypesSpError } = await supabase.rpc('exec_sql', { sql: createCaseTypesTableSQL });
  if (caseTypesSpError) {
    throw new Error(`Error creating case types stored procedure: ${caseTypesSpError.message}`);
  }
  
  const { error: caseStatusesSpError } = await supabase.rpc('exec_sql', { sql: createCaseStatusesTableSQL });
  if (caseStatusesSpError) {
    throw new Error(`Error creating case statuses stored procedure: ${caseStatusesSpError.message}`);
  }
  
  const { error: casesSpError } = await supabase.rpc('exec_sql', { sql: createCasesTableSQL });
  if (casesSpError) {
    throw new Error(`Error creating cases stored procedure: ${casesSpError.message}`);
  }
  
  const { error: associationsSpError } = await supabase.rpc('exec_sql', { sql: createClientCaseAssociationsTableSQL });
  if (associationsSpError) {
    throw new Error(`Error creating client case associations stored procedure: ${associationsSpError.message}`);
  }
}

async function insertDefaultData() {
  // Insert default case types
  const defaultCaseTypes = [
    { name: 'Civil Litigation', description: 'General civil litigation matters', color: '#4CAF50' },
    { name: 'Family Law', description: 'Divorce, custody, and family-related matters', color: '#2196F3' },
    { name: 'Criminal Defense', description: 'Criminal defense cases', color: '#F44336' },
    { name: 'Corporate', description: 'Corporate legal matters and business transactions', color: '#9C27B0' },
    { name: 'Real Estate', description: 'Real estate transactions and disputes', color: '#FF9800' },
    { name: 'Intellectual Property', description: 'Patents, trademarks, and IP matters', color: '#3F51B5' },
    { name: 'Estate Planning', description: 'Wills, trusts, and estate planning', color: '#607D8B' },
    { name: 'Immigration', description: 'Immigration and visa matters', color: '#00BCD4' },
    { name: 'Tax', description: 'Tax planning and disputes', color: '#795548' },
    { name: 'Other', description: 'Other legal matters', color: '#9E9E9E' }
  ];

  // Insert default case statuses
  const defaultCaseStatuses = [
    { name: 'Open', description: 'Case is open and active', color: '#4CAF50', display_order: 1, is_default: true },
    { name: 'Pending', description: 'Case is pending further action', color: '#FFC107', display_order: 2 },
    { name: 'Discovery', description: 'Case is in discovery phase', color: '#2196F3', display_order: 3 },
    { name: 'Negotiation', description: 'Case is in negotiation phase', color: '#9C27B0', display_order: 4 },
    { name: 'Litigation', description: 'Case is in active litigation', color: '#F44336', display_order: 5 },
    { name: 'Trial', description: 'Case is in trial', color: '#FF5722', display_order: 6 },
    { name: 'Settlement', description: 'Case has settled', color: '#8BC34A', display_order: 7, is_closed: true },
    { name: 'Judgment', description: 'Case has reached final judgment', color: '#3F51B5', display_order: 8, is_closed: true },
    { name: 'Closed', description: 'Case is closed', color: '#9E9E9E', display_order: 9, is_closed: true },
    { name: 'Archived', description: 'Case is archived', color: '#607D8B', display_order: 10, is_closed: true }
  ];

  // Check if case types already exist to avoid duplicates
  const { data: existingTypes } = await supabase
    .from('case_types')
    .select('name');

  if (!existingTypes || existingTypes.length === 0) {
    // Insert default case types
    const { error: typesError } = await supabase
      .from('case_types')
      .insert(defaultCaseTypes);
    
    if (typesError) {
      console.error('Error inserting default case types:', typesError);
    } else {
      console.log('Default case types inserted successfully');
    }
  } else {
    console.log('Case types already exist, skipping default data insertion');
  }

  // Check if case statuses already exist to avoid duplicates
  const { data: existingStatuses } = await supabase
    .from('case_statuses')
    .select('name');

  if (!existingStatuses || existingStatuses.length === 0) {
    // Insert default case statuses
    const { error: statusesError } = await supabase
      .from('case_statuses')
      .insert(defaultCaseStatuses);
    
    if (statusesError) {
      console.error('Error inserting default case statuses:', statusesError);
    } else {
      console.log('Default case statuses inserted successfully');
    }
  } else {
    console.log('Case statuses already exist, skipping default data insertion');
  }
}

// Run the table creation
createTables(); 