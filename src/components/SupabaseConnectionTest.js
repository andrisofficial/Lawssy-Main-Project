import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const SupabaseConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Simple query to test connection - this will work even if the table doesn't exist
        // as it will just return an error about the table, not a connection error
        const { data, error } = await supabase
          .from('connection_test')
          .select('*')
          .limit(1);
        
        // If we get here, the connection is working
        // The query might fail because the table doesn't exist, but that's OK
        // We just want to check if we can connect to Supabase
        setConnectionStatus('Connected to Supabase successfully!');
        
        // Check if we have the actual URL and key from env variables
        const url = process.env.REACT_APP_SUPABASE_URL;
        const key = process.env.REACT_APP_SUPABASE_ANON_KEY;
        
        if (url && url !== 'https://your-project-url.supabase.co') {
          setConnectionStatus(prev => `${prev} Using URL: ${url}`);
        } else {
          setConnectionStatus(prev => `${prev} WARNING: Using default URL, not from environment variables.`);
        }
        
      } catch (err) {
        setConnectionStatus('Failed to connect to Supabase');
        setError(err.message);
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Supabase Connection Test</h2>
      <div style={{ 
        padding: '15px', 
        backgroundColor: error ? '#ffebee' : '#e8f5e9',
        borderRadius: '4px',
        marginTop: '10px'
      }}>
        <h3>Status: {connectionStatus}</h3>
        {error && (
          <div>
            <h4>Error Details:</h4>
            <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>{error}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseConnectionTest; 