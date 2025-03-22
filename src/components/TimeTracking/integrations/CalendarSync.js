import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  IconButton,
  Alert,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  Sync as SyncIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Google as GoogleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// Sample calendar events
const sampleCalendarEvents = [
  {
    id: 1,
    title: 'Client Meeting - Acme Corp',
    start: new Date('2023-03-10T10:00:00'),
    end: new Date('2023-03-10T11:00:00'),
    calendarId: 'google',
    type: 'client_meeting',
    description: 'Discuss contract terms with CEO',
    location: 'Conference Room A',
    synced: true,
  },
  {
    id: 2,
    title: 'Court Appearance - Smith v. Jones',
    start: new Date('2023-03-12T09:30:00'),
    end: new Date('2023-03-12T12:00:00'),
    calendarId: 'google',
    type: 'court_date',
    description: 'Motion hearing',
    location: 'County Courthouse, Room 304',
    synced: true,
  },
  {
    id: 3,
    title: 'Document Review - Wayne Enterprises',
    start: new Date('2023-03-15T14:00:00'),
    end: new Date('2023-03-15T16:00:00'),
    calendarId: 'outlook',
    type: 'document_review',
    description: 'Review merger documents',
    location: 'Office',
    synced: true,
  },
  {
    id: 4,
    title: 'Filing Deadline - Stark Industries Patent',
    start: new Date('2023-03-20T17:00:00'),
    end: new Date('2023-03-20T17:00:00'),
    calendarId: 'outlook',
    type: 'deadline',
    description: 'Patent application filing deadline',
    location: '',
    synced: true,
  },
];

const CalendarSync = () => {
  const [connectedCalendars, setConnectedCalendars] = useState([
    { id: 'google', name: 'Google Calendar', connected: true, email: 'john.smith@example.com' },
    { id: 'outlook', name: 'Microsoft Outlook', connected: true, email: 'john.smith@example.com' },
  ]);
  const [calendarEvents, setCalendarEvents] = useState(sampleCalendarEvents);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('hourly');
  const [eventMappings, setEventMappings] = useState({
    client_meeting: { createTimeEntry: true, defaultActivity: 'Meeting' },
    court_date: { createTimeEntry: true, defaultActivity: 'Court Appearance' },
    document_review: { createTimeEntry: true, defaultActivity: 'Document Review' },
    deadline: { createTimeEntry: false, defaultActivity: '' },
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [newCalendar, setNewCalendar] = useState({ type: 'google', email: '' });

  const handleConnectCalendar = () => {
    // In a real application, this would initiate OAuth flow
    if (newCalendar.email.trim() === '') {
      alert('Please enter an email address');
      return;
    }
    
    const newCalendarObj = {
      id: newCalendar.type + '_' + Date.now(),
      name: newCalendar.type === 'google' ? 'Google Calendar' : 'Microsoft Outlook',
      connected: true,
      email: newCalendar.email,
    };
    
    setConnectedCalendars([...connectedCalendars, newCalendarObj]);
    setNewCalendar({ type: 'google', email: '' });
    setConnectDialogOpen(false);
    
    alert(`Connected to ${newCalendarObj.name} for ${newCalendarObj.email}`);
  };

  const handleDisconnectCalendar = (calendarId) => {
    if (window.confirm('Are you sure you want to disconnect this calendar?')) {
      setConnectedCalendars(
        connectedCalendars.map((cal) =>
          cal.id === calendarId ? { ...cal, connected: false } : cal
        )
      );
      
      // Remove events from this calendar
      setCalendarEvents(calendarEvents.filter((event) => event.calendarId !== calendarId));
    }
  };

  const handleSyncNow = () => {
    // In a real application, this would trigger a sync with the calendar APIs
    alert('Calendar sync initiated. This may take a few moments.');
    
    // Simulate new events being added
    setTimeout(() => {
      alert('Calendar sync completed. 2 new events imported.');
    }, 1500);
  };

  const handleAutoSyncToggle = () => {
    setAutoSync(!autoSync);
  };

  const handleSyncFrequencyChange = (event) => {
    setSyncFrequency(event.target.value);
  };

  const handleEventMappingChange = (eventType, field, value) => {
    setEventMappings({
      ...eventMappings,
      [eventType]: {
        ...eventMappings[eventType],
        [field]: value,
      },
    });
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventTypeLabel = (type) => {
    switch (type) {
      case 'client_meeting':
        return 'Client Meeting';
      case 'court_date':
        return 'Court Date';
      case 'document_review':
        return 'Document Review';
      case 'deadline':
        return 'Deadline';
      default:
        return type;
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'client_meeting':
        return 'primary';
      case 'court_date':
        return 'error';
      case 'document_review':
        return 'info';
      case 'deadline':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getCalendarName = (calendarId) => {
    const calendar = connectedCalendars.find((cal) => cal.id === calendarId);
    return calendar ? calendar.name : 'Unknown Calendar';
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Connected Calendars
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => setConnectDialogOpen(true)}
                >
                  Connect
                </Button>
              </Box>

              <List>
                {connectedCalendars.length === 0 ? (
                  <ListItem>
                    <ListItemText
                      primary="No calendars connected"
                      secondary="Click the Connect button to add a calendar"
                    />
                  </ListItem>
                ) : (
                  connectedCalendars.map((calendar) => (
                    <React.Fragment key={calendar.id}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {calendar.name === 'Google Calendar' ? (
                                <GoogleIcon sx={{ mr: 1, color: '#4285F4' }} />
                              ) : (
                                <CalendarIcon sx={{ mr: 1, color: '#0078D4' }} />
                              )}
                              {calendar.name}
                              {!calendar.connected && (
                                <Chip
                                  label="Disconnected"
                                  size="small"
                                  color="error"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          }
                          secondary={calendar.email}
                        />
                        {calendar.connected && (
                          <ListItemSecondaryAction>
                            <Button
                              variant="outlined"
                              size="small"
                              color="error"
                              onClick={() => handleDisconnectCalendar(calendar.id)}
                            >
                              Disconnect
                            </Button>
                          </ListItemSecondaryAction>
                        )}
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                )}
              </List>

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  startIcon={<SyncIcon />}
                  fullWidth
                  onClick={handleSyncNow}
                  disabled={connectedCalendars.filter((cal) => cal.connected).length === 0}
                >
                  Sync Now
                </Button>

                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoSync}
                        onChange={handleAutoSyncToggle}
                        disabled={connectedCalendars.filter((cal) => cal.connected).length === 0}
                      />
                    }
                    label="Auto-sync"
                  />

                  {autoSync && (
                    <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                      <InputLabel>Sync Frequency</InputLabel>
                      <Select
                        value={syncFrequency}
                        label="Sync Frequency"
                        onChange={handleSyncFrequencyChange}
                      >
                        <MenuItem value="hourly">Hourly</MenuItem>
                        <MenuItem value="daily">Daily</MenuItem>
                        <MenuItem value="manual">Manual Only</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Box>
              </Box>

              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => setSettingsDialogOpen(true)}
              >
                Event Mapping Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Upcoming Calendar Events
              </Typography>

              {calendarEvents.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No calendar events found. Connect a calendar and sync to import events.
                </Alert>
              ) : (
                <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto', mt: 2 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Calendar</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calendarEvents.map((event) => (
                        <TableRow key={event.id} hover>
                          <TableCell>{event.title}</TableCell>
                          <TableCell>
                            <Chip
                              label={getEventTypeLabel(event.type)}
                              size="small"
                              color={getEventTypeColor(event.type)}
                            />
                          </TableCell>
                          <TableCell>{formatDateTime(event.start)}</TableCell>
                          <TableCell>{getCalendarName(event.calendarId)}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleViewEvent(event)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Connect Calendar Dialog */}
      <Dialog open={connectDialogOpen} onClose={() => setConnectDialogOpen(false)}>
        <DialogTitle>Connect Calendar</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Calendar Type</InputLabel>
                <Select
                  value={newCalendar.type}
                  label="Calendar Type"
                  onChange={(e) => setNewCalendar({ ...newCalendar, type: e.target.value })}
                >
                  <MenuItem value="google">Google Calendar</MenuItem>
                  <MenuItem value="outlook">Microsoft Outlook</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                value={newCalendar.email}
                onChange={(e) => setNewCalendar({ ...newCalendar, email: e.target.value })}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                You will be redirected to {newCalendar.type === 'google' ? 'Google' : 'Microsoft'} to
                authorize access to your calendar.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConnectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConnectCalendar} variant="contained" color="primary">
            Connect
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Mapping Settings Dialog */}
      <Dialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Event Mapping Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
            Configure how calendar events are mapped to time entries. For each event type, you can
            specify whether to automatically create a time entry and set the default activity type.
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Client Meetings
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={eventMappings.client_meeting.createTimeEntry}
                          onChange={(e) =>
                            handleEventMappingChange(
                              'client_meeting',
                              'createTimeEntry',
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Automatically create time entry"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Default Activity</InputLabel>
                      <Select
                        value={eventMappings.client_meeting.defaultActivity}
                        label="Default Activity"
                        onChange={(e) =>
                          handleEventMappingChange(
                            'client_meeting',
                            'defaultActivity',
                            e.target.value
                          )
                        }
                        disabled={!eventMappings.client_meeting.createTimeEntry}
                      >
                        <MenuItem value="Meeting">Meeting</MenuItem>
                        <MenuItem value="Phone Call">Phone Call</MenuItem>
                        <MenuItem value="Consultation">Consultation</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Court Dates
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={eventMappings.court_date.createTimeEntry}
                          onChange={(e) =>
                            handleEventMappingChange(
                              'court_date',
                              'createTimeEntry',
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Automatically create time entry"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Default Activity</InputLabel>
                      <Select
                        value={eventMappings.court_date.defaultActivity}
                        label="Default Activity"
                        onChange={(e) =>
                          handleEventMappingChange(
                            'court_date',
                            'defaultActivity',
                            e.target.value
                          )
                        }
                        disabled={!eventMappings.court_date.createTimeEntry}
                      >
                        <MenuItem value="Court Appearance">Court Appearance</MenuItem>
                        <MenuItem value="Hearing">Hearing</MenuItem>
                        <MenuItem value="Trial">Trial</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Document Reviews
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={eventMappings.document_review.createTimeEntry}
                          onChange={(e) =>
                            handleEventMappingChange(
                              'document_review',
                              'createTimeEntry',
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Automatically create time entry"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Default Activity</InputLabel>
                      <Select
                        value={eventMappings.document_review.defaultActivity}
                        label="Default Activity"
                        onChange={(e) =>
                          handleEventMappingChange(
                            'document_review',
                            'defaultActivity',
                            e.target.value
                          )
                        }
                        disabled={!eventMappings.document_review.createTimeEntry}
                      >
                        <MenuItem value="Document Review">Document Review</MenuItem>
                        <MenuItem value="Research">Research</MenuItem>
                        <MenuItem value="Analysis">Analysis</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Deadlines
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={eventMappings.deadline.createTimeEntry}
                          onChange={(e) =>
                            handleEventMappingChange(
                              'deadline',
                              'createTimeEntry',
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Automatically create time entry"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Default Activity</InputLabel>
                      <Select
                        value={eventMappings.deadline.defaultActivity}
                        label="Default Activity"
                        onChange={(e) =>
                          handleEventMappingChange(
                            'deadline',
                            'defaultActivity',
                            e.target.value
                          )
                        }
                        disabled={!eventMappings.deadline.createTimeEntry}
                      >
                        <MenuItem value="Filing">Filing</MenuItem>
                        <MenuItem value="Submission">Submission</MenuItem>
                        <MenuItem value="Deadline">Deadline</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => setSettingsDialogOpen(false)}
            variant="contained"
            color="primary"
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* View/Edit Event Dialog */}
      {selectedEvent && (
        <Dialog
          open={eventDialogOpen}
          onClose={() => setEventDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Event Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  label="Event Title"
                  value={selectedEvent.title}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Time"
                    value={selectedEvent.start}
                    readOnly
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="End Time"
                    value={selectedEvent.end}
                    readOnly
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={selectedEvent.description}
                  fullWidth
                  multiline
                  rows={3}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Location"
                  value={selectedEvent.location}
                  fullWidth
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Event Type</InputLabel>
                  <Select
                    value={selectedEvent.type}
                    label="Event Type"
                    InputProps={{ readOnly: true }}
                  >
                    <MenuItem value="client_meeting">Client Meeting</MenuItem>
                    <MenuItem value="court_date">Court Date</MenuItem>
                    <MenuItem value="document_review">Document Review</MenuItem>
                    <MenuItem value="deadline">Deadline</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={eventMappings[selectedEvent.type]?.createTimeEntry || false}
                      disabled
                    />
                  }
                  label="Create Time Entry"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEventDialogOpen(false)}>Close</Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckIcon />}
              onClick={() => {
                alert('Time entry created from calendar event');
                setEventDialogOpen(false);
              }}
              disabled={!eventMappings[selectedEvent.type]?.createTimeEntry}
            >
              Create Time Entry
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default CalendarSync; 