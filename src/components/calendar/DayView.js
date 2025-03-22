import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip, 
  Button,
  Divider
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { format, addDays, subDays, isToday, isSameDay } from 'date-fns';

const DayView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample events data - in a real app, this would come from an API
  const [events] = useState([
    {
      id: 1,
      title: 'Client Meeting - Johnson Case',
      date: new Date(2023, 5, 15, 10, 0),
      endDate: new Date(2023, 5, 15, 11, 30),
      type: 'meeting',
      priority: 'high',
      matter: 'Johnson v. Smith',
      description: 'Discuss settlement options',
      color: '#FF5252'
    },
    {
      id: 2,
      title: 'File Motion Deadline',
      date: new Date(2023, 5, 20, 17, 0),
      endDate: new Date(2023, 5, 20, 17, 0),
      type: 'deadline',
      priority: 'high',
      matter: 'Williams Case',
      description: 'File motion for summary judgment',
      color: '#FF5252'
    },
    {
      id: 3,
      title: 'Team Strategy Meeting',
      date: new Date(2023, 5, 10, 14, 0),
      endDate: new Date(2023, 5, 10, 15, 0),
      type: 'internal',
      priority: 'medium',
      matter: 'General',
      description: 'Weekly team strategy meeting',
      color: '#4CAF50'
    }
  ]);

  const handlePrevDay = () => {
    setCurrentDate(subDays(currentDate, 1));
  };

  const handleNextDay = () => {
    setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for the current day
  const getDayEvents = () => {
    return events.filter(event => isSameDay(new Date(event.date), currentDate));
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#F59E0B'; // Default to medium
    }
  };

  // Generate time slots
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = getDayEvents();

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handlePrevDay}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h5" sx={{ mx: 2, fontWeight: 500 }}>
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </Typography>
            <IconButton onClick={handleNextDay}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {!isToday(currentDate) && (
              <Button 
                variant="outlined" 
                onClick={handleToday}
              >
                Today
              </Button>
            )}
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => {
                // This would open the event dialog in a real implementation
              }}
            >
              Add Event
            </Button>
          </Box>
        </Box>

        {/* Day View Grid */}
        <Box sx={{ display: 'flex', height: 'calc(100vh - 250px)', overflow: 'auto' }}>
          {/* Time column */}
          <Box sx={{ width: 60, flexShrink: 0, pr: 1, borderRight: '1px solid', borderColor: 'divider' }}>
            {timeSlots.map((hour) => (
              <Box 
                key={hour} 
                sx={{ 
                  height: 60, 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  justifyContent: 'flex-end',
                  pr: 1,
                  position: 'relative',
                  '&:not(:last-child)': {
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }
                }}
              >
                <Typography variant="caption" sx={{ pt: 0.5 }}>
                  {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Day column */}
          <Box sx={{ flexGrow: 1, position: 'relative' }}>
            {/* Time slots */}
            {timeSlots.map((hour) => (
              <Box 
                key={hour} 
                sx={{ 
                  height: 60, 
                  position: 'relative',
                  '&:not(:last-child)': {
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }
                }}
              />
            ))}

            {/* Events */}
            {dayEvents.map((event, eventIndex) => {
              const eventDate = new Date(event.date);
              const eventHour = eventDate.getHours();
              const eventMinute = eventDate.getMinutes();
              const eventEndDate = new Date(event.endDate);
              const eventDuration = (eventEndDate - eventDate) / (1000 * 60 * 60); // in hours
              
              return (
                <Tooltip title={`${event.title} - ${format(eventDate, 'h:mm a')} to ${format(eventEndDate, 'h:mm a')}`} key={eventIndex}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: `${eventHour * 60 + eventMinute}px`,
                      left: '4px',
                      right: '4px',
                      height: `${Math.max(eventDuration * 60, 30)}px`,
                      backgroundColor: event.color || '#4CAF50',
                      color: 'white',
                      borderRadius: 1,
                      p: 1,
                      overflow: 'hidden',
                      zIndex: 2,
                      cursor: 'pointer',
                      '&:hover': {
                        opacity: 0.9
                      }
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {format(eventDate, 'h:mm a')} - {format(eventEndDate, 'h:mm a')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {event.title}
                    </Typography>
                    {eventDuration > 0.5 && (
                      <>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {event.matter}
                        </Typography>
                        {event.priority && (
                          <Box 
                            sx={{ 
                              display: 'inline-block',
                              px: 1,
                              py: 0.25,
                              mt: 0.5,
                              borderRadius: 1,
                              backgroundColor: getPriorityColor(event.priority),
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                          >
                            {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} Priority
                          </Box>
                        )}
                      </>
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        </Box>
      </Paper>

      {/* Current time indicator */}
      {isToday(currentDate) && (
        <Box
          sx={{
            position: 'absolute',
            left: 60,
            right: 0,
            top: `${new Date().getHours() * 60 + new Date().getMinutes() + 200}px`, // Adjust the 200px offset based on your layout
            height: '2px',
            backgroundColor: 'error.main',
            zIndex: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '-5px',
              top: '-4px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'error.main'
            }
          }}
        />
      )}
    </Box>
  );
};

export default DayView; 