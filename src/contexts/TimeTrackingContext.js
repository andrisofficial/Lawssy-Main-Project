import { createContext, useContext, useState } from 'react';

// Create a context
const TimeTrackingContext = createContext();

// Create a provider component
export const TimeTrackingProvider = ({ children }) => {
  const [timeEntries, setTimeEntries] = useState([]);
  
  // Add a time entry
  const addTimeEntry = (entry) => {
    setTimeEntries(prevEntries => [...prevEntries, entry]);
  };
  
  // Update a time entry
  const updateTimeEntry = (id, updatedEntry) => {
    setTimeEntries(prevEntries => 
      prevEntries.map(entry => 
        entry.id === id ? { ...entry, ...updatedEntry } : entry
      )
    );
  };
  
  // Delete a time entry
  const deleteTimeEntry = (id) => {
    setTimeEntries(prevEntries => 
      prevEntries.filter(entry => entry.id !== id)
    );
  };
  
  return (
    <TimeTrackingContext.Provider 
      value={{ 
        timeEntries, 
        addTimeEntry, 
        updateTimeEntry, 
        deleteTimeEntry 
      }}
    >
      {children}
    </TimeTrackingContext.Provider>
  );
};

// Custom hook to use the context
export const useTimeTracking = () => {
  const context = useContext(TimeTrackingContext);
  if (!context) {
    throw new Error('useTimeTracking must be used within a TimeTrackingProvider');
  }
  return context;
};

export default TimeTrackingContext; 