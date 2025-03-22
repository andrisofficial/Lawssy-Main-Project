import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { format, isSameDay, addDays, subDays, isToday } from 'date-fns';
import NewEventDialog from './NewEventDialog';
import { useCalendar } from '../../contexts/CalendarContext';

const AgendaView = ({ currentDate, events }) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [eventMenuAnchor, setEventMenuAnchor] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const { deleteEvent } = useCalendar();

  const handlePrevDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  const handleEventMenuOpen = (event, calendarEvent) => {
    event.stopPropagation();
    setSelectedEvent(calendarEvent);
    setEventMenuAnchor(event.currentTarget);
  };

  const handleEventMenuClose = () => {
    setEventMenuAnchor(null);
  };

  const handleEditEvent = () => {
    setEditDialogOpen(true);
    handleEventMenuClose();
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(selectedEvent.id);
      handleEventMenuClose();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedEvent(null);
  };

  // Filter events for the selected date
  const filteredEvents = events.filter(event => 
    isSameDay(new Date(event.date), selectedDate)
  );

  // Sort events by time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  // Group events by time
  const groupedEvents = sortedEvents.reduce((groups, event) => {
    const time = format(new Date(event.date), 'HH:mm');
    if (!groups[time]) {
      groups[time] = [];
    }
    groups[time].push(event);
    return groups;
  }, {});

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'appointment':
        return '#0069d1';
      case 'meeting':
        return '#10B981';
      case 'task':
        return '#3B82F6';
      case 'deadline':
        return '#EF4444';
      case 'reminder':
        return '#F59E0B';
      case 'document':
        return '#8B5CF6';
      case 'adhoc':
        return '#6B7280';
      default:
        return '#0069d1';
    }
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'appointment':
        return 'Appointment';
      case 'meeting':
        return 'Meeting';
      case 'task':
        return 'Task';
      case 'deadline':
        return 'Deadline';
      case 'reminder':
        return 'Reminder';
      case 'document':
        return 'Document Due';
      case 'adhoc':
        return 'Ad Hoc';
      default:
        return 'Event';
    }
  };

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

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high':
        return 'High';
      case 'medium':
        return 'Medium';
      case 'low':
        return 'Low';
      default:
        return 'Medium';
    }
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="div">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            {isToday(selectedDate) && (
              <Chip 
                label="Today" 
                size="small" 
                color="primary" 
                sx={{ ml: 1, height: 24 }} 
              />
            )}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {Object.keys(groupedEvents).length > 0 ? (
          Object.entries(groupedEvents).map(([time, timeEvents]) => (
            <Box key={time} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="subtitle2" color="text.secondary">
                  {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                </Typography>
              </Box>
              
              <List disablePadding>
                {timeEvents.map((event) => (
                  <ListItem 
                    key={event.id} 
                    sx={{ 
                      pl: 4, 
                      pr: 1, 
                      py: 1.5, 
                      mb: 1, 
                      borderLeft: `4px solid ${event.color || getEventTypeColor(event.type)}`,
                      borderRadius: 1,
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      }
                    }}
                    secondaryAction={
                      <IconButton 
                        edge="end" 
                        size="small"
                        onClick={(e) => handleEventMenuOpen(e, event)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
                            {event.title}
                          </Typography>
                          <Chip 
                            label={getEventTypeLabel(event.type)} 
                            size="small" 
                            sx={{ 
                              ml: 1, 
                              bgcolor: event.color || getEventTypeColor(event.type),
                              color: 'white',
                              height: 20,
                              fontSize: '0.7rem'
                            }} 
                          />
                          {event.priority && (
                            <Chip 
                              label={getPriorityLabel(event.priority)} 
                              size="small" 
                              sx={{ 
                                ml: 1, 
                                bgcolor: getPriorityColor(event.priority),
                                color: 'white',
                                height: 20,
                                fontSize: '0.7rem'
                              }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          {event.matter && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              Matter: {event.matter}
                            </Typography>
                          )}
                          
                          {event.location && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                              <LocationOnIcon fontSize="small" sx={{ mr: 0.5, fontSize: '0.9rem', color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {event.location}
                              </Typography>
                            </Box>
                          )}
                          
                          {event.description && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                              <DescriptionIcon fontSize="small" sx={{ mr: 0.5, mt: 0.2, fontSize: '0.9rem', color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary" sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}>
                                {event.description}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No events scheduled
            </Typography>
            <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
              There are no events scheduled for this day
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Event Menu */}
      <Menu
        anchorEl={eventMenuAnchor}
        open={Boolean(eventMenuAnchor)}
        onClose={handleEventMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            width: 180,
          },
        }}
      >
        <MenuItem onClick={handleEditEvent}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteEvent}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Edit Event Dialog */}
      {selectedEvent && (
        <NewEventDialog
          open={editDialogOpen}
          onClose={handleEditDialogClose}
          currentDate={selectedDate}
          editEvent={selectedEvent}
        />
      )}
    </Box>
  );
};

export default AgendaView; 