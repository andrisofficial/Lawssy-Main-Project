import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper, 
  CircularProgress, 
  IconButton, 
  Button, 
  Menu, 
  MenuItem, 
  Divider, 
  Grid, 
  FormGroup, 
  FormControlLabel, 
  Checkbox,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Popover
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import AgendaView from '../components/calendar/AgendaView';
import DayView from '../components/calendar/DayView';
import WeekView from '../components/calendar/WeekView';
import WorkWeekView from '../components/calendar/WorkWeekView';
import MonthView from '../components/calendar/MonthView';
import { useCalendar } from '../contexts/CalendarContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Add, 
  Refresh, 
  Settings, 
  Sync, 
  Print, 
  RssFeed,
  ArrowDropDown
} from '@mui/icons-material';
import { format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import CalendarMiniMonth from '../components/calendar/CalendarMiniMonth';
import NewEventDialog from '../components/calendar/NewEventDialog';

const CalendarPage = () => {
  const [activeTab, setActiveTab] = useState(4); // Default to Month view
  const { loading, error, events, fetchEvents } = useCalendar();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false);
  const [calendarFilters, setCalendarFilters] = useState({
    personal: true,
    firm: true,
    bookings: true,
    tasks: true,
    statutes: true
  });
  
  // Add state for calendar colors
  const [calendarColors, setCalendarColors] = useState({
    personal: '#0069d1',
    firm: '#10B981',
    bookings: '#F59E0B',
    tasks: '#3B82F6',
    statutes: '#EF4444'
  });
  
  // Add state for color picker
  const [colorPickerAnchorEl, setColorPickerAnchorEl] = useState(null);
  const [currentCalendarType, setCurrentCalendarType] = useState(null);
  
  // Predefined colors for the color picker
  const colorOptions = [
    '#fdb39b', '#52768f', '#f2e1cd', '#C4D865', '#ab8f77', 
    '#6ccdf4', '#ffd800', '#F97316', '#9b958d', '#14A36F',
    '#6366F1', '#FFDAB9', '#D946EF', '#B0E0E6', 
    '#626866', '#3B82F6', '#DCD0FF',  '#202020'
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePrevious = () => {
    switch (activeTab) {
      case 0: // Agenda
      case 1: // Day
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 2: // Week
      case 3: // Work Week
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 4: // Month
        setCurrentDate(subMonths(currentDate, 1));
        break;
      default:
        setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    switch (activeTab) {
      case 0: // Agenda
      case 1: // Day
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 2: // Week
      case 3: // Work Week
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 4: // Month
        setCurrentDate(addMonths(currentDate, 1));
        break;
      default:
        setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleRefresh = () => {
    fetchEvents();
  };

  const handleNewEvent = () => {
    setNewEventDialogOpen(true);
  };

  const handleNewEventDialogClose = () => {
    setNewEventDialogOpen(false);
  };

  const handleCalendarFilterChange = (filter) => {
    setCalendarFilters({
      ...calendarFilters,
      [filter]: !calendarFilters[filter]
    });
  };
  
  // Add handlers for color picker
  const handleColorPickerOpen = (event, calendarType) => {
    setColorPickerAnchorEl(event.currentTarget);
    setCurrentCalendarType(calendarType);
  };
  
  const handleColorPickerClose = () => {
    setColorPickerAnchorEl(null);
    setCurrentCalendarType(null);
  };
  
  const handleColorSelect = (color) => {
    if (currentCalendarType) {
      setCalendarColors({
        ...calendarColors,
        [currentCalendarType]: color
      });
      handleColorPickerClose();
    }
  };
  
  // Add handler for adding new calendar
  const [newCalendarDialogOpen, setNewCalendarDialogOpen] = useState(false);
  
  const handleAddNewCalendar = () => {
    // This would typically open a dialog to add a new calendar
    // For now, we'll just log to console
    console.log('Add new calendar clicked');
    // You could implement a full dialog here
    setNewCalendarDialogOpen(true);
  };

  const getDateRangeText = () => {
    switch (activeTab) {
      case 0: // Agenda
        return format(currentDate, 'MMMM d, yyyy');
      case 1: // Day
        return format(currentDate, 'MMMM d, yyyy');
      case 2: // Week
      case 3: // Work Week
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${format(startOfWeek, 'MMM d')} - ${format(endOfWeek, 'MMM d, yyyy')}`;
      case 4: // Month
        return format(currentDate, 'MMMM yyyy');
      default:
        return format(currentDate, 'MMMM d, yyyy');
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Please try again later or contact support if the problem persists.
          </Typography>
        </Box>
      );
    }

    // Filter events based on calendar filters
    const filteredEvents = events.filter(event => {
      if (event.type === 'personal' && !calendarFilters.personal) return false;
      if (event.type === 'firm' && !calendarFilters.firm) return false;
      if (event.type === 'booking' && !calendarFilters.bookings) return false;
      if (event.type === 'task' && !calendarFilters.tasks) return false;
      if (event.type === 'statute' && !calendarFilters.statutes) return false;
      return true;
    });

    switch (activeTab) {
      case 0:
        return <AgendaView currentDate={currentDate} events={filteredEvents} />;
      case 1:
        return <DayView currentDate={currentDate} events={filteredEvents} />;
      case 2:
        return <WeekView currentDate={currentDate} events={filteredEvents} />;
      case 3:
        return <WorkWeekView currentDate={currentDate} events={filteredEvents} />;
      case 4:
        return <MonthView currentDate={currentDate} events={filteredEvents} />;
      default:
        return <MonthView currentDate={currentDate} events={filteredEvents} />;
    }
  };

  return (
    <MainLayout title="Calendar">
      <Box sx={{ p: 3, width: '100%' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={handlePrevious} size="small" sx={{ mr: 1 }}>
                  <ChevronLeft />
                </IconButton>
                <IconButton onClick={handleNext} size="small" sx={{ mr: 2 }}>
                  <ChevronRight />
                </IconButton>
                <Typography variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
                  {getDateRangeText()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Refresh">
                  <IconButton onClick={handleRefresh} size="small" sx={{ mr: 1 }}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Calendar Settings">
                  <IconButton onClick={handleSettingsClick} size="small" sx={{ mr: 1 }}>
                    <Settings />
                  </IconButton>
                </Tooltip>
                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  onClick={handleNewEvent}
                  sx={{ ml: 1 }}
                >
                  New Event
                </Button>
              </Box>
            </Box>

            <Paper elevation={0} sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  aria-label="calendar view tabs"
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ 
                    '& .MuiTab-root': { 
                      minWidth: 100,
                      py: 2
                    } 
                  }}
                >
                  <Tab label="Agenda" />
                  <Tab label="Day" />
                  <Tab label="Week" />
                  <Tab label="Work Week" />
                  <Tab label="Month" />
                </Tabs>
              </Box>
            </Paper>
            
            <Box sx={{ mt: 2 }}>
              {renderTabContent()}
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
              <CalendarMiniMonth 
                currentDate={currentDate} 
                onDateChange={setCurrentDate}
              />
            </Paper>
            
            <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  My Calendars
                </Typography>
                <Tooltip title="Add new calendar">
                  <IconButton size="small" onClick={handleAddNewCalendar}>
                    <Add fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <FormGroup>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={calendarFilters.personal} 
                        onChange={() => handleCalendarFilterChange('personal')}
                        size="small"
                        sx={{ 
                          color: calendarColors.personal,
                          '&.Mui-checked': {
                            color: calendarColors.personal,
                          },
                        }}
                      />
                    } 
                    label="Personal" 
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleColorPickerOpen(e, 'personal')}
                    sx={{ ml: 1 }}
                  >
                    <ArrowDropDown />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={calendarFilters.firm} 
                        onChange={() => handleCalendarFilterChange('firm')}
                        size="small"
                        sx={{ 
                          color: calendarColors.firm,
                          '&.Mui-checked': {
                            color: calendarColors.firm,
                          },
                        }}
                      />
                    } 
                    label="Firm" 
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleColorPickerOpen(e, 'firm')}
                    sx={{ ml: 1 }}
                  >
                    <ArrowDropDown />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={calendarFilters.bookings} 
                        onChange={() => handleCalendarFilterChange('bookings')}
                        size="small"
                        sx={{ 
                          color: calendarColors.bookings,
                          '&.Mui-checked': {
                            color: calendarColors.bookings,
                          },
                        }}
                      />
                    } 
                    label="Boardroom Bookings" 
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleColorPickerOpen(e, 'bookings')}
                    sx={{ ml: 1 }}
                  >
                    <ArrowDropDown />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={calendarFilters.tasks} 
                        onChange={() => handleCalendarFilterChange('tasks')}
                        size="small"
                        sx={{ 
                          color: calendarColors.tasks,
                          '&.Mui-checked': {
                            color: calendarColors.tasks,
                          },
                        }}
                      />
                    } 
                    label="Tasks" 
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleColorPickerOpen(e, 'tasks')}
                    sx={{ ml: 1 }}
                  >
                    <ArrowDropDown />
                  </IconButton>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <FormControlLabel 
                    control={
                      <Checkbox 
                        checked={calendarFilters.statutes} 
                        onChange={() => handleCalendarFilterChange('statutes')}
                        size="small"
                        sx={{ 
                          color: calendarColors.statutes,
                          '&.Mui-checked': {
                            color: calendarColors.statutes,
                          },
                        }}
                      />
                    } 
                    label="Statute of Limitations" 
                  />
                  <IconButton 
                    size="small" 
                    onClick={(e) => handleColorPickerOpen(e, 'statutes')}
                    sx={{ ml: 1 }}
                  >
                    <ArrowDropDown />
                  </IconButton>
                </Box>
              </FormGroup>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Calendar Settings Menu */}
      <Menu
        anchorEl={settingsAnchorEl}
        open={Boolean(settingsAnchorEl)}
        onClose={handleSettingsClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            width: 220,
          },
        }}
      >
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add new calendar</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Calendar settings</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <Sync fontSize="small" />
          </ListItemIcon>
          <ListItemText>Calendar sync</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <RssFeed fontSize="small" />
          </ListItemIcon>
          <ListItemText>Calendar feeds</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleSettingsClose}>
          <ListItemIcon>
            <Print fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
      </Menu>

      {/* New Event Dialog */}
      <NewEventDialog 
        open={newEventDialogOpen} 
        onClose={handleNewEventDialogClose} 
        currentDate={currentDate}
      />
      
      {/* Color Picker Popover */}
      <Popover
        open={Boolean(colorPickerAnchorEl)}
        anchorEl={colorPickerAnchorEl}
        onClose={handleColorPickerClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 220 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select Color
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {colorOptions.map((color, index) => (
              <Box
                key={index}
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '4px',
                  bgcolor: color,
                  cursor: 'pointer',
                  border: color === calendarColors[currentCalendarType] ? '2px solid #000' : 'none',
                }}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </Box>
        </Box>
      </Popover>
    </MainLayout>
  );
};

export default CalendarPage; 