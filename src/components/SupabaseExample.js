import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const SupabaseExample = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newItem, setNewItem] = useState('');

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Replace 'your_table' with your actual table name
        const { data, error } = await supabase
          .from('your_table')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setData(data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Insert a new item
  const handleInsert = async (e) => {
    e.preventDefault();
    
    if (!newItem.trim()) return;
    
    try {
      setLoading(true);
      
      // Replace 'your_table' with your actual table name
      const { error } = await supabase
        .from('your_table')
        .insert([{ name: newItem }]);
        
      if (error) throw error;
      
      // Refresh the data
      const { data, error: fetchError } = await supabase
        .from('your_table')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (fetchError) throw fetchError;
      
      setData(data || []);
      setNewItem('');
    } catch (error) {
      console.error('Error inserting data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supabase-example">
      <h2>Supabase Example</h2>
      
      {/* Form to add new item */}
      <form onSubmit={handleInsert}>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
        />
        <button type="submit" disabled={loading}>
          Add Item
        </button>
      </form>
      
      {/* Display error if any */}
      {error && <p className="error">Error: {error}</p>}
      
      {/* Display loading state */}
      {loading && <p>Loading...</p>}
      
      {/* Display data */}
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SupabaseExample; 