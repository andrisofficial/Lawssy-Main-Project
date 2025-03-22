import { format, parseISO, isSameDay, addDays, subDays } from 'date-fns';

// This is a mock service that would be replaced with actual API calls in a real application

// Sample events data
const mockEvents = [
  {
    id: 1,
    title: 'Client Meeting - Johnson Case',
    date: '2023-06-15T10:00:00',
    endDate: '2023-06-15T11:30:00',
    type: 'meeting',
    priority: 'high',
    matter: 'Johnson v. Smith',
    description: 'Discuss settlement options',
    location: 'Conference Room A',
    attendees: ['Sarah Johnson', 'Michael Smith', 'Client: John Johnson'],
    color: '#FF5252'
  },
  {
    id: 2,
    title: 'File Motion Deadline',
    date: '2023-06-20T17:00:00',
    endDate: '2023-06-20T17:00:00',
    type: 'deadline',
    priority: 'high',
    matter: 'Williams Case',
    description: 'File motion for summary judgment',
    color: '#FF5252'
  },
  {
    id: 3,
    title: 'Team Strategy Meeting',
    date: '2023-06-10T14:00:00',
    endDate: '2023-06-10T15:00:00',
    type: 'internal',
    priority: 'medium',
    matter: 'General',
    description: 'Weekly team strategy meeting',
    location: 'Conference Room B',
    attendees: ['Sarah Johnson', 'Michael Smith', 'Lisa Brown', 'David Wilson'],
    color: '#4CAF50'
  },
  {
    id: 4,
    title: 'Court Hearing - Davis Case',
    date: '2023-06-18T09:00:00',
    endDate: '2023-06-18T11:00:00',
    type: 'court',
    priority: 'high',
    matter: 'Davis v. State',
    description: 'Initial hearing',
    location: 'County Courthouse, Room 304',
    attendees: ['Sarah Johnson', 'Client: James Davis'],
    color: '#FF9800'
  },
  {
    id: 5,
    title: 'Client Call - Thompson',
    date: '2023-06-16T15:30:00',
    endDate: '2023-06-16T16:00:00',
    type: 'meeting',
    priority: 'medium',
    matter: 'Thompson Estate',
    description: 'Review estate planning documents',
    attendees: ['Sarah Johnson', 'Client: Mary Thompson'],
    color: '#2196F3'
  }
];

// Mock court rules for deadline calculation
const courtRules = [
  {
    id: 1,
    jurisdiction: 'Federal',
    name: 'Response to Motion',
    daysToAdd: 14,
    excludeWeekends: true,
    excludeHolidays: true
  },
  {
    id: 2,
    jurisdiction: 'State',
    name: 'File Answer',
    daysToAdd: 21,
    excludeWeekends: true,
    excludeHolidays: true
  },
  {
    id: 3,
    jurisdiction: 'Federal',
    name: 'Discovery Response',
    daysToAdd: 30,
    excludeWeekends: true,
    excludeHolidays: true
  }
];

// Mock holidays
const holidays = [
  { date: '2023-01-01', name: 'New Year\'s Day' },
  { date: '2023-01-16', name: 'Martin Luther King Jr. Day' },
  { date: '2023-02-20', name: 'Presidents\' Day' },
  { date: '2023-05-29', name: 'Memorial Day' },
  { date: '2023-06-19', name: 'Juneteenth' },
  { date: '2023-07-04', name: 'Independence Day' },
  { date: '2023-09-04', name: 'Labor Day' },
  { date: '2023-10-09', name: 'Columbus Day' },
  { date: '2023-11-11', name: 'Veterans Day' },
  { date: '2023-11-23', name: 'Thanksgiving Day' },
  { date: '2023-12-25', name: 'Christmas Day' }
];

// Helper function to check if a date is a weekend
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
};

// Helper function to check if a date is a holiday
const isHoliday = (date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return holidays.some(holiday => holiday.date === formattedDate);
};

// Helper function to calculate deadline based on court rules
const calculateDeadline = (startDate, ruleId) => {
  const rule = courtRules.find(r => r.id === ruleId);
  if (!rule) return null;
  
  let deadline = new Date(startDate);
  let daysAdded = 0;
  
  while (daysAdded < rule.daysToAdd) {
    deadline = addDays(deadline, 1);
    
    // Skip weekends and holidays if specified in the rule
    if ((rule.excludeWeekends && isWeekend(deadline)) || 
        (rule.excludeHolidays && isHoliday(deadline))) {
      continue;
    }
    
    daysAdded++;
  }
  
  return deadline;
};

// Get all events
const getAllEvents = () => {
  return Promise.resolve(mockEvents);
};

// Get events for a specific day
const getEventsByDay = (date) => {
  const events = mockEvents.filter(event => 
    isSameDay(parseISO(event.date), date)
  );
  return Promise.resolve(events);
};

// Get events for a specific month
const getEventsByMonth = (year, month) => {
  const events = mockEvents.filter(event => {
    const eventDate = parseISO(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month;
  });
  return Promise.resolve(events);
};

// Create a new event
const createEvent = (event) => {
  const newEvent = {
    ...event,
    id: Math.max(...mockEvents.map(e => e.id)) + 1
  };
  mockEvents.push(newEvent);
  return Promise.resolve(newEvent);
};

// Update an existing event
const updateEvent = (event) => {
  const index = mockEvents.findIndex(e => e.id === event.id);
  if (index === -1) return Promise.reject(new Error('Event not found'));
  
  mockEvents[index] = event;
  return Promise.resolve(event);
};

// Delete an event
const deleteEvent = (id) => {
  const index = mockEvents.findIndex(e => e.id === id);
  if (index === -1) return Promise.reject(new Error('Event not found'));
  
  mockEvents.splice(index, 1);
  return Promise.resolve({ success: true });
};

// Get court rules
const getCourtRules = () => {
  return Promise.resolve(courtRules);
};

// Calculate deadline based on a rule
const getCalculatedDeadline = (startDate, ruleId) => {
  const deadline = calculateDeadline(startDate, ruleId);
  return Promise.resolve({ deadline });
};

// Get holidays
const getHolidays = () => {
  return Promise.resolve(holidays);
};

export const calendarService = {
  getAllEvents,
  getEventsByDay,
  getEventsByMonth,
  createEvent,
  updateEvent,
  deleteEvent,
  getCourtRules,
  getCalculatedDeadline,
  getHolidays
}; 