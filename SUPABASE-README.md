# Supabase Integration for Legal SaaS

This document provides comprehensive instructions for integrating Supabase with your Legal SaaS application.

## What is Supabase?

[Supabase](https://supabase.com/) is an open-source Firebase alternative that provides:
- PostgreSQL Database
- Authentication
- Real-time subscriptions
- Storage
- Serverless functions
- API auto-generation

It's perfect for our Legal SaaS application because it offers:
- Powerful database features of PostgreSQL
- Built-in authentication for user management
- Storage for client documents and photos
- Real-time capabilities for collaborative features

## Setup Process

### 1. Create a Supabase Account and Project

1. Sign up at [supabase.com](https://supabase.com/)
2. Create a new project
3. Choose a name and strong password
4. Select a region closest to your users
5. Wait for the project to be initialized (may take a few minutes)

### 2. Get Your API Credentials

1. From your project dashboard, go to Project Settings → API
2. Copy the following:
   - **Project URL** (looks like `https://xxxxxxxx.supabase.co`)
   - **anon/public** key (a long string)

### 3. Configure Your Local Environment

1. Create or edit the `.env` file in your project root
2. Add your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=https://your-project-url.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Test Your Connection

Run the connection test script:

**Windows:**
```
test-supabase-connection.bat
```

**macOS/Linux:**
```
chmod +x test-supabase-connection.sh
./test-supabase-connection.sh
```

This will verify that your credentials are correct and that you can connect to your Supabase project.

### 5. Initialize Database Schema

Run the database setup script:

**Windows:**
```
setup-client-db.bat
```

**macOS/Linux:**
```
chmod +x setup-client-db.sh
./setup-client-db.sh
```

This script will:
- Create all necessary tables
- Set up relationships and constraints
- Add default values for statuses and other reference data

### 6. Configure Storage Buckets

1. In the Supabase dashboard, go to Storage
2. Create the following buckets:
   - `client-photos` - For storing client profile photos
   - `documents` - For storing legal documents
3. Set appropriate permissions:
   - For client-photos: 
     ```sql
     -- Allow public read access but restrict write
     CREATE POLICY "Public Read Access"
     ON storage.objects FOR SELECT
     USING (bucket_id = 'client-photos');
     
     -- Allow authenticated users to upload
     CREATE POLICY "Authenticated Create Access"
     ON storage.objects FOR INSERT
     WITH CHECK (bucket_id = 'client-photos' AND auth.role() = 'authenticated');
     ```

## Database Structure

Our application uses the following tables:

1. **clients** - Core client information
2. **client_statuses** - Client status reference data
3. **client_emails** - Multiple email addresses per client
4. **client_phones** - Multiple phone numbers per client
5. **client_websites** - Multiple websites per client
6. **client_addresses_direct** - Multiple addresses per client
7. **client_contacts** - Additional contacts for clients
8. **client_addresses** - Addresses for contacts
9. **client_cases** - Links between clients and cases
10. **audit_logs** - Tracking changes to client data

## Authentication Setup

For user authentication:

1. In Supabase dashboard, go to Authentication → Settings
2. Configure your preferred auth providers:
   - Email (with or without magic links)
   - Google, Microsoft, etc.
   - Phone auth

## Security Best Practices

For production use:

1. **Row Level Security (RLS)**: Set up RLS policies on all tables
2. **Service Role**: Use a service role for backend operations
3. **Storage**: Configure bucket policies appropriately
4. **API Rate Limiting**: Set up rate limiting for API endpoints
5. **Backups**: Enable daily backups of your database

## Troubleshooting

Common issues and solutions:

1. **Connection Failures**:
   - Double-check your URL and API key
   - Ensure you're not behind a restrictive firewall
   - Check your network connection

2. **Permission Errors**:
   - Review your RLS policies
   - Check if you're using the correct API key

3. **Schema Issues**:
   - Run the setup script again
   - Check for errors in the console output

4. **Storage Problems**:
   - Verify bucket names match the code
   - Check storage permissions

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Client Library](https://supabase.com/docs/reference/javascript)
- [Authentication Docs](https://supabase.com/docs/guides/auth)
- [Storage Docs](https://supabase.com/docs/guides/storage)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security) 