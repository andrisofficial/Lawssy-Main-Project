require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sql = `
-- Create contact_types table
CREATE TABLE IF NOT EXISTS contact_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_organization BOOLEAN DEFAULT FALSE,
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  job_title TEXT,
  email TEXT,
  phone TEXT,
  contact_type_id UUID REFERENCES contact_types(id),
  organization_id UUID REFERENCES contacts(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relationship_types table
CREATE TABLE IF NOT EXISTS relationship_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  reverse_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contact_relationships table
CREATE TABLE IF NOT EXISTS contact_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id_1 UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  contact_id_2 UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  relationship_type_id UUID NOT NULL REFERENCES relationship_types(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT contact_relationship_unique UNIQUE(contact_id_1, contact_id_2, relationship_type_id)
);

-- Create matter_contacts pivot table for linking contacts to matters
CREATE TABLE IF NOT EXISTS matter_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  matter_id UUID NOT NULL, -- References matters(id)
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT matter_contact_unique UNIQUE(matter_id, contact_id, role)
);

-- Insert default contact types
INSERT INTO contact_types (name, description)
VALUES 
  ('Client', 'Current client of the firm'),
  ('Prospect', 'Potential future client'),
  ('Opposing Counsel', 'Attorney representing opposing parties'),
  ('Witness', 'A witness in a legal matter'),
  ('Expert', 'Expert witness or consultant'),
  ('Judge', 'Judicial officer'),
  ('Court Staff', 'Staff of the court'),
  ('Vendor', 'Service provider to the firm'),
  ('Referral Source', 'Source of client referrals')
ON CONFLICT (name) DO NOTHING;

-- Insert default relationship types
INSERT INTO relationship_types (name, reverse_name, description)
VALUES 
  ('Employee of', 'Employer of', 'Employment relationship'),
  ('Spouse of', 'Spouse of', 'Matrimonial relationship'),
  ('Parent of', 'Child of', 'Parental relationship'),
  ('Child of', 'Parent of', 'Child relationship'),
  ('Sibling of', 'Sibling of', 'Sibling relationship'),
  ('Colleague of', 'Colleague of', 'Professional colleague relationship'),
  ('Referred by', 'Referred', 'Referral relationship'),
  ('Attorney for', 'Client of', 'Attorney-client relationship'),
  ('Opponent of', 'Opponent of', 'Opposing party relationship')
ON CONFLICT (name) DO NOTHING;
`;

async function createTables() {
  try {
    console.log('Creating CRM database tables...');
    
    // Using RPC to execute SQL directly
    const { data, error } = await supabase.rpc('postgres_execute', { query_text: sql });
    
    if (error) {
      console.error('Error creating tables:', error);
    } else {
      console.log('CRM tables created successfully!');
    }
  } catch (error) {
    console.error('Exception occurred:', error);
  } finally {
    process.exit(0);
  }
}

createTables(); 