import React, { createContext, useState, useEffect, useContext } from 'react';
import { calendarService } from '../services/calendarService';
import { parseISO } from 'date-fns';

// Create the Calendar context
const CalendarContext = createContext();

// Custom hook to use the Calendar context
export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

// Calendar Provider component
export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courtRules, setCourtRules] = useState([]);
  const [holidays, setHolidays] = useState([]);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await calendarService.getAllEvents();
      // Convert string dates to Date objects
      const eventsWithDateObjects = data.map(event => ({
        ...event,
        date: parseISO(event.date),
        endDate: parseISO(event.endDate)
      }));
      setEvents(eventsWithDateObjects);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch court rules
  const fetchCourtRules = async () => {
    try {
      const data = await calendarService.getCourtRules();
      setCourtRules(data);
    } catch (err) {
      console.error('Failed to fetch court rules:', err);
    }
  };

  // Fetch holidays
  const fetchHolidays = async () => {
    try {
      const data = await calendarService.getHolidays();
      setHolidays(data);
    } catch (err) {
      console.error('Failed to fetch holidays:', err);
    }
  };

  // Create a new event
  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      const newEvent = await calendarService.createEvent(eventData);
      // Convert string dates to Date objects
      const eventWithDateObjects = {
        ...newEvent,
        date: parseISO(newEvent.date),
        endDate: parseISO(newEvent.endDate)
      };
      setEvents([...events, eventWithDateObjects]);
      return eventWithDateObjects;
    } catch (err) {
      setError('Failed to create event');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing event
  const updateEvent = async (eventData) => {
    try {
      setLoading(true);
      const updatedEvent = await calendarService.updateEvent(eventData);
      // Convert string dates to Date objects
      const eventWithDateObjects = {
        ...updatedEvent,
        date: parseISO(updatedEvent.date),
        endDate: parseISO(updatedEvent.endDate)
      };
      setEvents(events.map(event => 
        event.id === eventWithDateObjects.id ? eventWithDateObjects : event
      ));
      return eventWithDateObjects;
    } catch (err) {
      setError('Failed to update event');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an event
  const deleteEvent = async (id) => {
    try {
      setLoading(true);
      await calendarService.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (err) {
      setError('Failed to delete event');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calculate deadline based on court rules
  const calculateDeadline = async (startDate, ruleId) => {
    try {
      const { deadline } = await calendarService.getCalculatedDeadline(startDate, ruleId);
      return deadline;
    } catch (err) {
      console.error('Failed to calculate deadline:', err);
      throw err;
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchEvents();
      await fetchCourtRules();
      await fetchHolidays();
    };
    
    loadInitialData();
  }, []);

  // Context value
  const value = {
    events,
    loading,
    error,
    courtRules,
    holidays,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    calculateDeadline
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarContext; 