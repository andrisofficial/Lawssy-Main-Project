import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip, 
  Button
} from '@mui/material';
import { 
  ChevronLeft as ChevronLeftIcon, 
  ChevronRight as ChevronRightIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay, addDays } from 'date-fns';

const WorkWeekView = () => {
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

  const handlePrevWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  // Generate work week days (Monday to Friday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1 = Monday
  const weekEnd = addDays(weekStart, 4); // Add 4 days to get to Friday
  const daysInWorkWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Get events for a specific day
  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(new Date(event.date), day));
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

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handlePrevWeek}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h5" sx={{ mx: 2, fontWeight: 500 }}>
              {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
            </Typography>
            <IconButton onClick={handleNextWeek}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box>
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

        {/* Work Week View Grid */}
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

          {/* Days columns */}
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            {daysInWorkWeek.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isToday(day);
              
              return (
                <Box 
                  key={dayIndex} 
                  sx={{ 
                    flexGrow: 1, 
                    width: 0, 
                    borderRight: dayIndex < 4 ? '1px solid' : 'none',
                    borderColor: 'divider',
                    backgroundColor: isCurrentDay ? 'rgba(0, 105, 209, 0.04)' : 'transparent'
                  }}
                >
                  {/* Day header */}
                  <Box 
                    sx={{ 
                      p: 1, 
                      textAlign: 'center', 
                      borderBottom: '1px solid', 
                      borderColor: 'divider',
                      backgroundColor: isCurrentDay ? 'rgba(0, 105, 209, 0.08)' : 'transparent',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: isCurrentDay ? 'bold' : 'normal',
                        color: isCurrentDay ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {format(day, 'EEE')}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: isCurrentDay ? 'bold' : 'normal',
                        color: isCurrentDay ? 'primary.main' : 'text.primary'
                      }}
                    >
                      {format(day, 'd')}
                    </Typography>
                  </Box>

                  {/* Time slots */}
                  <Box sx={{ position: 'relative' }}>
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
                              p: 0.5,
                              overflow: 'hidden',
                              fontSize: '0.75rem',
                              zIndex: 2,
                              cursor: 'pointer',
                              '&:hover': {
                                opacity: 0.9
                              }
                            }}
                          >
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                              {format(eventDate, 'h:mm a')}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {event.title}
                            </Typography>
                            {event.priority && eventDuration > 0.5 && (
                              <Box 
                                sx={{ 
                                  display: 'inline-block',
                                  px: 0.5,
                                  mt: 0.25,
                                  borderRadius: 0.5,
                                  backgroundColor: getPriorityColor(event.priority),
                                  fontSize: '0.6rem',
                                  fontWeight: 'bold'
                                }}
                              >
                                {event.priority.charAt(0).toUpperCase()}
                              </Box>
                            )}
                          </Box>
                        </Tooltip>
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default WorkWeekView; 