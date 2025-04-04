import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  IconButton, 
  Chip, 
  Tooltip, 
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Stack,
  Tabs,
  Tab
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  ViewWeek as ViewWeekIcon,
  CalendarViewMonth as CalendarViewMonthIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { useCalendar } from '../../contexts/CalendarContext';

const MonthView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [eventMenuAnchor, setEventMenuAnchor] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetailsOpen, setEventDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedEventType, setSelectedEventType] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [viewMode, setViewMode] = useState('month');
  
  const { events, createEvent, updateEvent, deleteEvent } = useCalendar();

  // Get color based on priority
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#FF5252'; // Red for high priority
      case 'medium':
        return '#FFA726'; // Orange for medium priority
      case 'low':
        return '#4CAF50'; // Green for low priority
      default:
        return '#A0AEC1'; // Default color
    }
  };

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: new Date(),
    endDate: new Date(),
    type: 'meeting',
    matter: '',
    description: '',
    color: '#A0AEC1',
    priority: 'medium',
    showInAgenda: false // Events created with "Add Event" don't show in Agenda
  });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setNewEvent({
      ...newEvent,
      date: date,
      endDate: date
    });
    setEventDialogOpen(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventMenuAnchor(e.currentTarget);
  };

  const handleEventDetailsClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setEventDetailsOpen(true);
  };

  const handleEventDetailsClose = () => {
    setEventDetailsOpen(false);
  };

  const handleEventMenuClose = () => {
    setEventMenuAnchor(null);
  };

  const handleEventDialogClose = () => {
    setEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleNewEventChange = (field, value) => {
    if (field === 'priority') {
      // Update color based on priority
      setNewEvent({
        ...newEvent,
        [field]: value,
        color: getPriorityColor(value)
      });
    } else {
      setNewEvent({
        ...newEvent,
        [field]: value
      });
    }
  };

  const handleSaveEvent = async () => {
    try {
      if (selectedEvent) {
        // Update existing event
        await updateEvent({
          ...newEvent,
          id: selectedEvent.id,
          date: format(newEvent.date, "yyyy-MM-dd'T'HH:mm:ss"),
          endDate: format(newEvent.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
          showInAgenda: false // Ensure events edited here don't show in Agenda
        });
      } else {
        // Add new event
        await createEvent({
          ...newEvent,
          date: format(newEvent.date, "yyyy-MM-dd'T'HH:mm:ss"),
          endDate: format(newEvent.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
          showInAgenda: false // Events created with "Add Event" don't show in Agenda
        });
      }
      setEventDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(selectedEvent.id);
      setEventDialogOpen(false);
      setSelectedEvent(null);
      setEventMenuAnchor(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEditEvent = () => {
    setNewEvent(selectedEvent);
    setEventDialogOpen(true);
    setEventMenuAnchor(null);
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day names for header
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(new Date(event.date), day));
  };

  const handleEventTypeChange = (event) => {
    setSelectedEventType(event.target.value);
    const filteredEvents = events.filter(event => {
      if (event.target.value === 'all') return true;
      return event.type === event.target.value;
    });
    setFilteredEvents(filteredEvents);
  };

  // Render tab content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Calendar tab
        return (
          <Box>
            {/* Filter controls */}
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Event Type</InputLabel>
                <Select
                  value={selectedEventType}
                  onChange={handleEventTypeChange}
                  label="Event Type"
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Events</MenuItem>
                  <MenuItem value="appointment">Appointments</MenuItem>
                  <MenuItem value="meeting">Meetings</MenuItem>
                  <MenuItem value="deadline">Deadlines</MenuItem>
                  <MenuItem value="reminder">Reminders</MenuItem>
                  <MenuItem value="document">Document Due</MenuItem>
                  <MenuItem value="adhoc">Ad Hoc</MenuItem>
                </Select>
              </FormControl>
              
              <Box>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={() => {
                    setNewEvent({
                      title: '',
                      date: new Date(),
                      endDate: new Date(),
                      type: 'meeting',
                      matter: '',
                      description: '',
                      color: '#A0AEC1',
                      priority: 'medium',
                      showInAgenda: false // Events created with "Add Event" don't show in Agenda
                    });
                    setEventDialogOpen(true);
                  }}
                  sx={{ 
                    textTransform: 'none',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    mr: 1
                  }}
                >
                  Add Event
                </Button>
                
                <IconButton 
                  onClick={() => setViewMode(viewMode === 'month' ? 'week' : 'month')}
                  color="primary"
                  sx={{ borderRadius: '8px' }}
                >
                  {viewMode === 'month' ? <ViewWeekIcon /> : <CalendarViewMonthIcon />}
                </IconButton>
              </Box>
            </Box>

            {/* Month view calendar */}
            <Grid container spacing={0.5}>
              {/* Day names header */}
              {dayNames.map((day, index) => (
                <Grid item xs={12/7} key={index}>
                  <Box sx={{ 
                    py: 0.25, 
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    color: index === 0 || index === 6 ? 'error.main' : 'text.primary'
                  }}>
                    {day}
                  </Box>
                </Grid>
              ))}
              
              {/* Calendar days */}
              {daysInMonth.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                return (
                  <Grid item xs={12/7} key={index}>
                    <Paper 
                      elevation={0}
                      onClick={() => handleDateClick(day)}
                      sx={{ 
                        p: 0.5, 
                        height: { xs: 50, sm: 60, md: 70 }, // Responsive height based on screen size
                        cursor: 'pointer',
                        backgroundColor: isToday(day) ? 'rgba(0, 105, 209, 0.1)' : 'background.paper',
                        border: isToday(day) ? '1px solid #0069d1' : '1px solid #E0E0E0',
                        borderRadius: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 0.25
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: '0.7rem',
                            fontWeight: isToday(day) ? 'bold' : 'normal',
                            color: !isSameMonth(day, currentDate) ? 'text.disabled' : 
                                   (index % 7 === 0 || index % 7 === 6) ? 'error.main' : 'text.primary'
                          }}
                        >
                          {format(day, 'd')}
                        </Typography>
                        {dayEvents.length > 0 && (
                          <Typography variant="caption" sx={{ color: 'primary.main', fontSize: '0.6rem' }}>
                            {dayEvents.length}
                          </Typography>
                        )}
                      </Box>
                      
                      <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
                        {dayEvents.slice(0, 1).map((event, idx) => (
                          <Tooltip key={idx} title={event.title} arrow>
                            <Chip
                              size="small"
                              label={event.title}
                              onClick={(e) => handleEventClick(event, e)}
                              onDoubleClick={(e) => handleEventDetailsClick(event, e)}
                              sx={{
                                mb: 0.25,
                                height: '16px',
                                width: '100%',
                                backgroundColor: getPriorityColor(event.priority),
                                color: 'white',
                                justifyContent: 'flex-start',
                                '& .MuiChip-label': {
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  fontSize: '0.6rem',
                                  padding: '0 4px'
                                }
                              }}
                            />
                          </Tooltip>
                        ))}
                        {dayEvents.length > 1 && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>
                            +{dayEvents.length - 1} more
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );
      
      case 1: // Events tab
        return (
          <Paper elevation={0} sx={{ 
            p: 2, 
            mt: 1, 
            borderRadius: 2, 
            flexGrow: 1, 
            overflow: 'auto',
            minHeight: { xs: '300px', sm: '350px', md: '400px' }, // Responsive min height
            maxHeight: { xs: '400px', sm: '450px', md: '500px' }, // Responsive max height
          }}>
            <Typography variant="h6" sx={{ 
              mb: 1, 
              fontWeight: 500,
              position: 'sticky',
              top: 0,
              backgroundColor: 'background.paper',
              zIndex: 1,
              pb: 1
            }}>
              Tasks
            </Typography>
            
            {filteredEvents.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                No tasks to display. Use "Add Event" to create tasks that will appear here.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {filteredEvents
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .map((event, index) => (
                    <Paper 
                      key={event.id} 
                      onClick={(e) => handleEventDetailsClick(event, e)}
                      sx={{ 
                        p: 1.5, 
                        mb: 1, 
                        cursor: 'pointer',
                        borderLeft: `4px solid ${getPriorityColor(event.priority)}`,
                        borderRadius: 1,
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ width: 'calc(100% - 40px)' }}> {/* Ensure text doesn't overlap with the menu button */}
                          <Typography variant="subtitle1" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                            {event.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {format(new Date(event.date), 'PPP p')}
                            {!isSameDay(new Date(event.date), new Date(event.endDate)) && 
                              ` - ${format(new Date(event.endDate), 'PPP p')}`}
                          </Typography>
                          {event.matter && (
                            <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-word' }}>
                              <strong>Matter:</strong> {event.matter}
                            </Typography>
                          )}
                        </Box>
                        <IconButton size="small" onClick={(e) => handleEventClick(event, e)}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
              </Box>
            )}
          </Paper>
        );
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Tabs for switching between calendar and events list */}
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ 
            mb: 2,
            '& .MuiTabs-flexContainer': {
              justifyContent: 'center'
            }
          }}
        >
          <Tab label="Calendar" />
          <Tab label="Events" />
        </Tabs>

        {/* Main content area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          {renderTabContent()}
        </Box>

        {/* Event Menu */}
        <Menu
          anchorEl={eventMenuAnchor}
          open={Boolean(eventMenuAnchor)}
          onClose={handleEventMenuClose}
        >
          <MenuItem onClick={handleEditEvent}>Edit</MenuItem>
          <MenuItem onClick={handleDeleteEvent} sx={{ color: 'error.main' }}>Delete</MenuItem>
        </Menu>

        {/* Event Details Dialog */}
        <Dialog open={eventDetailsOpen} onClose={handleEventDetailsClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ 
            backgroundColor: selectedEvent ? getPriorityColor(selectedEvent.priority) : '#A0AEC1',
            color: 'white'
          }}>
            {selectedEvent?.title}
            <IconButton 
              onClick={handleEventDetailsClose}
              sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            {selectedEvent && (
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={selectedEvent.priority || 'Medium'} 
                    size="small" 
                    sx={{ 
                      backgroundColor: getPriorityColor(selectedEvent.priority),
                      color: 'white'
                    }} 
                  />
                  <Chip 
                    label={selectedEvent.type || 'Meeting'} 
                    size="small" 
                    variant="outlined" 
                  />
                </Box>
                
                <Typography variant="body2">
                  <strong>Date:</strong> {format(new Date(selectedEvent.date), 'PPP')}
                  {!isSameDay(new Date(selectedEvent.date), new Date(selectedEvent.endDate)) && 
                    ` - ${format(new Date(selectedEvent.endDate), 'PPP')}`}
                </Typography>
                
                {selectedEvent.matter && (
                  <Typography variant="body2">
                    <strong>Matter/Case:</strong> {selectedEvent.matter}
                  </Typography>
                )}
                
                {selectedEvent.description && (
                  <>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Description:</Typography>
                    <Typography variant="body2">{selectedEvent.description}</Typography>
                  </>
                )}
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditEvent} color="primary">Edit</Button>
            <Button onClick={handleDeleteEvent} color="error">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Event Dialog */}
        <Dialog open={eventDialogOpen} onClose={handleEventDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedEvent ? 'Edit Event' : 'Add New Event'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Title"
                fullWidth
                value={newEvent.title}
                onChange={(e) => handleNewEventChange('title', e.target.value)}
              />
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Start Date"
                      value={newEvent.date}
                      onChange={(date) => handleNewEventChange('date', date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="End Date"
                      value={newEvent.endDate}
                      onChange={(date) => handleNewEventChange('endDate', date)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
              </Grid>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Task Type</InputLabel>
                    <Select
                      value={newEvent.type}
                      label="Task Type"
                      onChange={(e) => handleNewEventChange('type', e.target.value)}
                    >
                      <MenuItem value="meeting">Meeting</MenuItem>
                      <MenuItem value="deadline">Deadline</MenuItem>
                      <MenuItem value="court">Court Appearance</MenuItem>
                      <MenuItem value="internal">Internal</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                      <MenuItem value="reminder">Reminder</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={newEvent.priority}
                      label="Priority"
                      onChange={(e) => handleNewEventChange('priority', e.target.value)}
                    >
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <TextField
                label="Matter/Case"
                fullWidth
                value={newEvent.matter}
                onChange={(e) => handleNewEventChange('matter', e.target.value)}
              />
              
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newEvent.description}
                onChange={(e) => handleNewEventChange('description', e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEventDialogClose}>Cancel</Button>
            <Button 
              onClick={handleSaveEvent} 
              variant="contained" 
              disabled={!newEvent.title}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default MonthView; 