const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Supabase credentials not found in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadDatabaseFunctions() {
    try {
        console.log('Reading SQL functions file...');
        const sqlFunctions = fs.readFileSync('database-functions.sql', 'utf8');

        console.log('Uploading SQL functions to Supabase...');
        
        // Split the SQL file into individual function definitions
        const functionDefinitions = sqlFunctions.split(';').filter(sql => sql.trim());

        // Execute each function definition
        for (const functionDef of functionDefinitions) {
            if (functionDef.trim()) {
                try {
                    await supabase.rpc('exec_sql', { sql: functionDef + ';' });
                    console.log('Successfully uploaded function:', functionDef.substring(0, 50) + '...');
                } catch (error) {
                    console.error('Error uploading function:', error.message);
                    console.error('Function definition:', functionDef);
                }
            }
        }

        console.log('All SQL functions uploaded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

uploadDatabaseFunctions(); 