@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   Legal SaaS Client Database Setup
echo ===================================================
echo.

echo Checking for .env file...
if not exist .env (
    echo Error: .env file not found.
    echo Please create a .env file with your Supabase credentials:
    echo REACT_APP_SUPABASE_URL=your-project-url
    echo REACT_APP_SUPABASE_ANON_KEY=your-anon-key
    exit /b 1
)

echo Checking for Node.js...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js from https://nodejs.org/
    exit /b 1
)

echo Installing required packages...
call npm install @supabase/supabase-js dotenv

echo Creating database tables...

node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase credentials not found in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
    try {
        // Create client_statuses table
        console.log('Creating client_statuses table...');
        await supabase.rpc('create_client_statuses_table', {});
        
        // Insert default statuses
        console.log('Adding default client statuses...');
        await supabase
            .from('client_statuses')
            .upsert([
                { status: 'Active', description: 'Currently active client' },
                { status: 'Inactive', description: 'Temporarily inactive client' },
                { status: 'Pending', description: 'Awaiting activation' },
                { status: 'Archived', description: 'Historical client record' }
            ]);

        // Create clients table
        console.log('Creating clients table...');
        await supabase.rpc('create_clients_table', {});

        // Create client_emails table
        console.log('Creating client_emails table...');
        await supabase.rpc('create_client_emails_table', {});

        // Create client_phones table
        console.log('Creating client_phones table...');
        await supabase.rpc('create_client_phones_table', {});

        // Create client_websites table
        console.log('Creating client_websites table...');
        await supabase.rpc('create_client_websites_table', {});

        // Create client_addresses_direct table
        console.log('Creating client_addresses_direct table...');
        await supabase.rpc('create_client_addresses_direct_table', {});

        // Create client_contacts table
        console.log('Creating client_contacts table...');
        await supabase.rpc('create_client_contacts_table', {});

        // Create client_addresses table
        console.log('Creating client_addresses table...');
        await supabase.rpc('create_client_addresses_table', {});

        // Create client_cases table
        console.log('Creating client_cases table...');
        await supabase.rpc('create_client_cases_table', {});

        // Create audit_logs table
        console.log('Creating audit_logs table...');
        await supabase.rpc('create_audit_logs_table', {});

        console.log('Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error.message);
        process.exit(1);
    }
}

setupDatabase();"

if %ERRORLEVEL% equ 0 (
    echo.
    echo Database setup completed successfully!
    echo You can now start the application with: npm start
) else (
    echo.
    echo Error: Database setup failed.
    echo Please check the error messages above and try again.
    exit /b 1
)

endlocal 