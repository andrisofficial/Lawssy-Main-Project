const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase credentials not found in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createClientStatusesTable() {
    console.log('Creating client_statuses table...');
    const { error } = await supabase
        .from('client_statuses')
        .insert([
            { status: 'Active', description: 'Currently active client' },
            { status: 'Inactive', description: 'Temporarily inactive client' },
            { status: 'Pending', description: 'Awaiting activation' },
            { status: 'Archived', description: 'Historical client record' }
        ])
        .select();
        
    if (error) {
        if (error.code === '42P01') {
            // Table doesn't exist, create it first
            console.log('Table does not exist, creating it first...');
            const { error: createError } = await supabase.rpc('exec_sql', {
                sql_query: `
                CREATE TABLE IF NOT EXISTS client_statuses (
                    id SERIAL PRIMARY KEY,
                    status TEXT NOT NULL UNIQUE,
                    description TEXT,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                );
                `
            });
            
            if (createError) {
                console.error('Error creating table:', createError);
                // Try direct SQL if RPC fails
                try {
                    const { error: directError } = await supabase.auth.admin.queryDb({
                        query: `
                        CREATE TABLE IF NOT EXISTS client_statuses (
                            id SERIAL PRIMARY KEY,
                            status TEXT NOT NULL UNIQUE,
                            description TEXT,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                        );
                        `
                    });
                    
                    if (directError) {
                        throw directError;
                    }
                    
                    // Try inserting again after table creation
                    await supabase
                        .from('client_statuses')
                        .insert([
                            { status: 'Active', description: 'Currently active client' },
                            { status: 'Inactive', description: 'Temporarily inactive client' },
                            { status: 'Pending', description: 'Awaiting activation' },
                            { status: 'Archived', description: 'Historical client record' }
                        ]);
                } catch (err) {
                    console.error('Error with direct SQL execution:', err);
                    return false;
                }
            } else {
                // Try inserting again after table creation
                await supabase
                    .from('client_statuses')
                    .insert([
                        { status: 'Active', description: 'Currently active client' },
                        { status: 'Inactive', description: 'Temporarily inactive client' },
                        { status: 'Pending', description: 'Awaiting activation' },
                        { status: 'Archived', description: 'Historical client record' }
                    ]);
            }
        } else {
            console.error('Error inserting into client_statuses:', error);
            return false;
        }
    }
    
    return true;
}

async function setupDatabase() {
    try {
        console.log('Setting up Supabase database...');
        
        // Create a simple test table for connection verification
        const statusResult = await createClientStatusesTable();
        
        if (statusResult) {
            console.log('✅ Client statuses table created successfully!');
        }
        
        console.log('Database setup completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error setting up database:', error);
        process.exit(1);
    }
}

setupDatabase(); 