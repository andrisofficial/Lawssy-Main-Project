-- Function to create client_statuses table
CREATE OR REPLACE FUNCTION create_client_statuses_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS client_statuses (
        id SERIAL PRIMARY KEY,
        status VARCHAR(50) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
END;
$$;

-- Function to create clients table
CREATE OR REPLACE FUNCTION create_clients_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS clients (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        tax_id VARCHAR(50),
        status_id INTEGER REFERENCES client_statuses(id),
        notes TEXT,
        profile_photo_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by UUID REFERENCES auth.users(id),
        updated_by UUID REFERENCES auth.users(id)
    );

    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_clients_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_clients_updated_at_trigger ON clients;
    CREATE TRIGGER update_clients_updated_at_trigger
        BEFORE UPDATE ON clients
        FOR EACH ROW
        EXECUTE FUNCTION update_clients_updated_at();
END;
$$;

-- Function to create client_emails table
CREATE OR REPLACE FUNCTION create_client_emails_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS client_emails (
        id SERIAL PRIMARY KEY,
        client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        email_type VARCHAR(50),
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(client_id, email)
    );

    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_client_emails_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_client_emails_updated_at_trigger ON client_emails;
    CREATE TRIGGER update_client_emails_updated_at_trigger
        BEFORE UPDATE ON client_emails
        FOR EACH ROW
        EXECUTE FUNCTION update_client_emails_updated_at();
END;
$$;

-- Function to create client_phones table
CREATE OR REPLACE FUNCTION create_client_phones_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS client_phones (
        id SERIAL PRIMARY KEY,
        client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
        phone_number VARCHAR(50) NOT NULL,
        phone_type VARCHAR(50),
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(client_id, phone_number)
    );

    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_client_phones_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_client_phones_updated_at_trigger ON client_phones;
    CREATE TRIGGER update_client_phones_updated_at_trigger
        BEFORE UPDATE ON client_phones
        FOR EACH ROW
        EXECUTE FUNCTION update_client_phones_updated_at();
END;
$$;

-- Function to create client_websites table
CREATE OR REPLACE FUNCTION create_client_websites_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS client_websites (
        id SERIAL PRIMARY KEY,
        client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
        url VARCHAR(255) NOT NULL,
        website_type VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(client_id, url)
    );

    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_client_websites_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_client_websites_updated_at_trigger ON client_websites;
    CREATE TRIGGER update_client_websites_updated_at_trigger
        BEFORE UPDATE ON client_websites
        FOR EACH ROW
        EXECUTE FUNCTION update_client_websites_updated_at();
END;
$$;

-- Function to create client_addresses_direct table
CREATE OR REPLACE FUNCTION create_client_addresses_direct_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS client_addresses_direct (
        id SERIAL PRIMARY KEY,
        client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
        address_type VARCHAR(50),
        street_address TEXT NOT NULL,
        unit_number VARCHAR(50),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'United States',
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_client_addresses_direct_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_client_addresses_direct_updated_at_trigger ON client_addresses_direct;
    CREATE TRIGGER update_client_addresses_direct_updated_at_trigger
        BEFORE UPDATE ON client_addresses_direct
        FOR EACH ROW
        EXECUTE FUNCTION update_client_addresses_direct_updated_at();
END;
$$;

-- Function to create client_contacts table
CREATE OR REPLACE FUNCTION create_client_contacts_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS client_contacts (
        id SERIAL PRIMARY KEY,
        client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(100),
        department VARCHAR(100),
        email VARCHAR(255),
        phone VARCHAR(50),
        is_primary BOOLEAN DEFAULT false,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_client_contacts_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_client_contacts_updated_at_trigger ON client_contacts;
    CREATE TRIGGER update_client_contacts_updated_at_trigger
        BEFORE UPDATE ON client_contacts
        FOR EACH ROW
        EXECUTE FUNCTION update_client_contacts_updated_at();
END;
$$;

-- Function to create client_addresses table
CREATE OR REPLACE FUNCTION create_client_addresses_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS client_addresses (
        id SERIAL PRIMARY KEY,
        contact_id INTEGER REFERENCES client_contacts(id) ON DELETE CASCADE,
        address_type VARCHAR(50),
        street_address TEXT NOT NULL,
        unit_number VARCHAR(50),
        city VARCHAR(100) NOT NULL,
        state VARCHAR(50) NOT NULL,
        postal_code VARCHAR(20) NOT NULL,
        country VARCHAR(100) NOT NULL DEFAULT 'United States',
        is_primary BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_client_addresses_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_client_addresses_updated_at_trigger ON client_addresses;
    CREATE TRIGGER update_client_addresses_updated_at_trigger
        BEFORE UPDATE ON client_addresses
        FOR EACH ROW
        EXECUTE FUNCTION update_client_addresses_updated_at();
END;
$$;

-- Function to create client_cases table
CREATE OR REPLACE FUNCTION create_client_cases_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS client_cases (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
        case_number VARCHAR(100) NOT NULL,
        case_type VARCHAR(100),
        status VARCHAR(50),
        description TEXT,
        filing_date DATE,
        closing_date DATE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_by UUID REFERENCES auth.users(id),
        updated_by UUID REFERENCES auth.users(id)
    );

    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_client_cases_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS update_client_cases_updated_at_trigger ON client_cases;
    CREATE TRIGGER update_client_cases_updated_at_trigger
        BEFORE UPDATE ON client_cases
        FOR EACH ROW
        EXECUTE FUNCTION update_client_cases_updated_at();
END;
$$;

-- Function to create audit_logs table
CREATE OR REPLACE FUNCTION create_audit_logs_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        table_name VARCHAR(50) NOT NULL,
        record_id UUID NOT NULL,
        action VARCHAR(10) NOT NULL,
        old_data JSONB,
        new_data JSONB,
        changed_by UUID REFERENCES auth.users(id),
        changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Create audit trigger function
    CREATE OR REPLACE FUNCTION audit_trigger_function()
    RETURNS TRIGGER AS $$
    DECLARE
        old_data JSONB;
        new_data JSONB;
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            old_data = to_jsonb(OLD);
            new_data = null;
        ELSIF (TG_OP = 'INSERT') THEN
            old_data = null;
            new_data = to_jsonb(NEW);
        ELSE
            old_data = to_jsonb(OLD);
            new_data = to_jsonb(NEW);
        END IF;

        INSERT INTO audit_logs (
            table_name,
            record_id,
            action,
            old_data,
            new_data,
            changed_by,
            changed_at
        ) VALUES (
            TG_TABLE_NAME,
            CASE 
                WHEN TG_OP = 'DELETE' THEN OLD.id
                ELSE NEW.id
            END,
            TG_OP,
            old_data,
            new_data,
            CASE 
                WHEN TG_OP = 'DELETE' THEN OLD.updated_by
                ELSE NEW.updated_by
            END,
            CURRENT_TIMESTAMP
        );
        RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    -- Add audit triggers to relevant tables
    DROP TRIGGER IF EXISTS audit_trigger_clients ON clients;
    CREATE TRIGGER audit_trigger_clients
        AFTER INSERT OR UPDATE OR DELETE ON clients
        FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

    DROP TRIGGER IF EXISTS audit_trigger_client_cases ON client_cases;
    CREATE TRIGGER audit_trigger_client_cases
        AFTER INSERT OR UPDATE OR DELETE ON client_cases
        FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
END;
$$; 