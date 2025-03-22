import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Stack, 
  Card, 
  CardContent,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Paper,
  Grid,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Pause as PauseIcon, 
  Stop as StopIcon,
  RestartAlt as ResetIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Alarm as AlarmIcon,
  AlarmOff as AlarmOffIcon,
  MoreVert as MoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  NotificationsActive as NotificationIcon,
  EventNote as EventIcon,
  Description as DocumentIcon
} from '@mui/icons-material';

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const IDLE_CHECK_INTERVAL = 60 * 1000; // Check every minute

const AutomaticTimer = ({ 
  clients = [], 
  matters = [], 
  timeEntries = [], 
  setTimeEntries,
  practiceAreas = [],
  activityTypes = [],
  roundingIncrement = 0.1, // Default to 6-minute increments (0.1 hour)
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [description, setDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [billableType, setBillableType] = useState('billable');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState(null);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [recentTimeEntries, setRecentTimeEntries] = useState([]);
  const [idleDialogOpen, setIdleDialogOpen] = useState(false);
  const [idleTime, setIdleTime] = useState(0);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const [backgroundTracking, setBackgroundTracking] = useState(false);
  const [backgroundEvents, setBackgroundEvents] = useState([]);
  const [showBackgroundEvents, setShowBackgroundEvents] = useState(false);
  const [idleDetectionEnabled, setIdleDetectionEnabled] = useState(true);

  const timerRef = useRef(null);
  const idleCheckRef = useRef(null);

  // Example clients data if not provided
  const defaultClients = clients.length > 0 ? clients : [
    { id: 1, name: 'Acme Corporation' },
    { id: 2, name: 'Wayne Enterprises' },
    { id: 3, name: 'Stark Industries' },
  ];

  // Example matters data if not provided
  const defaultMatters = matters.length > 0 ? matters : [
    { id: 1, name: 'Corporate Restructuring', clientId: 1, caseNumber: 'ACM-2023-001' },
    { id: 2, name: 'Patent Infringement', clientId: 1, caseNumber: 'ACM-2023-002' },
    { id: 3, name: 'Merger Review', clientId: 2, caseNumber: 'WE-2023-001' },
    { id: 4, name: 'Intellectual Property', clientId: 3, caseNumber: 'SI-2023-001' },
  ];

  // Default practice areas if not provided
  const defaultPracticeAreas = practiceAreas.length > 0 ? practiceAreas : [
    { id: 1, name: 'Contract Review' },
    { id: 2, name: 'Litigation' },
    { id: 3, name: 'Corporate Law' },
    { id: 4, name: 'Intellectual Property' },
    { id: 5, name: 'Real Estate' }
  ];

  // Default activity types if not provided
  const defaultActivityTypes = activityTypes.length > 0 ? activityTypes : [
    { id: 1, name: 'Research' },
    { id: 2, name: 'Client Call' },
    { id: 3, name: 'Document Drafting' },
    { id: 4, name: 'Court Appearance' },
    { id: 5, name: 'Meeting' }
  ];

  // Mock background events (in a real app, these would come from integrations)
  const mockBackgroundEvents = [
    { 
      id: 1, 
      type: 'document', 
      title: 'Contract_Draft_v2.docx', 
      startTime: new Date(new Date().setHours(new Date().getHours() - 2)),
      duration: 45, // minutes
      description: 'Edited document'
    },
    { 
      id: 2, 
      type: 'email', 
      title: 'RE: Case Strategy', 
      startTime: new Date(new Date().setHours(new Date().getHours() - 1)),
      duration: 15, // minutes
      description: 'Email correspondence'
    },
    { 
      id: 3, 
      type: 'calendar', 
      title: 'Client Status Call', 
      startTime: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
      duration: 30, // minutes
      description: 'Video conference'
    }
  ];

  // Filter matters based on selected client
  const filteredMatters = selectedClient
    ? defaultMatters.filter(matter => matter.clientId === selectedClient.id)
    : [];

  useEffect(() => {
    // Initialize background events
    setBackgroundEvents(mockBackgroundEvents);
    
    // Set up activity tracking for idle detection
    const trackActivity = () => {
      setLastActivityTime(Date.now());
    };
    
    window.addEventListener('mousemove', trackActivity);
    window.addEventListener('keydown', trackActivity);
    window.addEventListener('click', trackActivity);
    
    return () => {
      window.removeEventListener('mousemove', trackActivity);
      window.removeEventListener('keydown', trackActivity);
      window.removeEventListener('click', trackActivity);
    };
  }, []);

  useEffect(() => {
    // Timer for counting seconds
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    // Idle detection
    if (isRunning && idleDetectionEnabled) {
      idleCheckRef.current = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - lastActivityTime;
        
        if (timeSinceLastActivity >= IDLE_TIMEOUT) {
          setIdleTime(Math.floor(timeSinceLastActivity / 1000));
          setIsRunning(false);
          setIdleDialogOpen(true);
          clearInterval(idleCheckRef.current);
        }
      }, IDLE_CHECK_INTERVAL);
    } else if (idleCheckRef.current) {
      clearInterval(idleCheckRef.current);
    }

    return () => {
      if (idleCheckRef.current) {
        clearInterval(idleCheckRef.current);
      }
    };
  }, [isRunning, lastActivityTime, idleDetectionEnabled]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatTimeShort = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const applyRounding = (seconds) => {
    const hours = seconds / 3600;
    // Round to the nearest increment (e.g., 0.1 for 6-minute increments)
    return Math.round(hours / roundingIncrement) * roundingIncrement;
  };

  const handleStart = () => {
    if (!selectedClient || !selectedMatter) {
      alert('Please select a client and matter before starting the timer');
      return;
    }
    
    setIsRunning(true);
    setLastActivityTime(Date.now());
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    
    if (seconds > 0) {
      saveTimeEntry(seconds);
    }
  };

  const saveTimeEntry = (durationInSeconds) => {
    if (!selectedClient || !selectedMatter || !description) {
      alert('Please fill in all required fields');
      return;
    }
    
    const roundedHours = applyRounding(durationInSeconds);
    
    const newEntry = {
      id: Date.now(),
      date: new Date(),
      startTime: new Date(Date.now() - (durationInSeconds * 1000)),
      endTime: new Date(),
      duration: roundedHours,
      description,
      client: selectedClient.name,
      clientId: selectedClient.id,
      matter: selectedMatter.name,
      matterId: selectedMatter.id,
      caseNumber: selectedMatter.caseNumber,
      billableType,
      practiceArea: selectedPracticeArea?.name || '',
      activityType: selectedActivityType?.name || '',
      status: 'unbilled',
      automatic: true
    };
    
    setTimeEntries([newEntry, ...timeEntries]);
    setRecentTimeEntries([newEntry, ...recentTimeEntries.slice(0, 4)]);
    resetTimer();
  };

  const resetTimer = () => {
    setSeconds(0);
    setDescription('');
    setSelectedPracticeArea(null);
    setSelectedActivityType(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    resetTimer();
  };

  const handleKeepIdleTime = () => {
    saveTimeEntry(idleTime);
    setIdleDialogOpen(false);
  };

  const handleDiscardIdleTime = () => {
    resetTimer();
    setIdleDialogOpen(false);
  };

  const handleBackgroundEventSelect = (event) => {
    // Pre-fill the timer with the background event details
    setDescription(`${event.title}: ${event.description}`);
    setSeconds(event.duration * 60); // Convert minutes to seconds
    
    // If the event has a specific client/matter association, we could set those too
    // For this example, we'll leave the current client/matter selection
  };

  const handleDeleteEntry = (id) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
    setRecentTimeEntries(recentTimeEntries.filter(entry => entry.id !== id));
  };

  const getBackgroundEventIcon = (type) => {
    switch (type) {
      case 'document':
        return <DocumentIcon />;
      case 'email':
        return <NotificationIcon />;
      case 'calendar':
        return <EventIcon />;
      default:
        return <MoreIcon />;
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Timer Display */}
          <Card sx={{ mb: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" align="center" fontWeight="600" sx={{ mb: 2 }}>
                {formatTime(seconds)}
              </Typography>
              
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
                {!isRunning ? (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PlayIcon />}
                    onClick={handleStart}
                    disabled={!selectedClient || !selectedMatter}
                  >
                    Start
                  </Button>
                ) : (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<PauseIcon />}
                    onClick={handlePause}
                  >
                    Pause
                  </Button>
                )}
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  startIcon={<StopIcon />}
                  onClick={handleStop}
                  disabled={seconds === 0}
                >
                  Stop
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  startIcon={<ResetIcon />}
                  onClick={handleReset}
                  disabled={seconds === 0}
                >
                  Reset
                </Button>
              </Stack>
              
              <Stack spacing={2}>
                <Autocomplete
                  options={defaultClients}
                  getOptionLabel={(option) => option.name}
                  value={selectedClient}
                  onChange={(event, newValue) => {
                    setSelectedClient(newValue);
                    setSelectedMatter(null);
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Client" 
                      variant="outlined" 
                      fullWidth 
                      required
                    />
                  )}
                  disabled={isRunning}
                />
                
                <Autocomplete
                  options={filteredMatters}
                  getOptionLabel={(option) => option.name}
                  value={selectedMatter}
                  onChange={(event, newValue) => {
                    setSelectedMatter(newValue);
                  }}
                  disabled={!selectedClient || isRunning}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Matter" 
                      variant="outlined" 
                      fullWidth 
                      required
                    />
                  )}
                />
                
                <TextField
                  label="Description"
                  placeholder="What are you working on?"
                  fullWidth
                  multiline
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Billable Type</InputLabel>
                      <Select
                        value={billableType}
                        label="Billable Type"
                        onChange={(e) => setBillableType(e.target.value)}
                        disabled={isRunning}
                      >
                        <MenuItem value="billable">Billable</MenuItem>
                        <MenuItem value="non-billable">Non-Billable</MenuItem>
                        <MenuItem value="no-charge">No Charge</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      options={defaultPracticeAreas}
                      getOptionLabel={(option) => option.name}
                      value={selectedPracticeArea}
                      onChange={(event, newValue) => {
                        setSelectedPracticeArea(newValue);
                      }}
                      disabled={isRunning}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          label="Practice Area" 
                          variant="outlined" 
                          fullWidth 
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Autocomplete
                      options={defaultActivityTypes}
                      getOptionLabel={(option) => option.name}
                      value={selectedActivityType}
                      onChange={(event, newValue) => {
                        setSelectedActivityType(newValue);
                      }}
                      disabled={isRunning}
                      renderInput={(params) => (
                        <TextField 
                          {...params} 
                          label="Activity Type" 
                          variant="outlined" 
                          fullWidth 
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={idleDetectionEnabled}
                        onChange={(e) => setIdleDetectionEnabled(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Idle Detection"
                  />
                  
                  <Typography variant="caption" color="textSecondary">
                    Time will be rounded to {roundingIncrement}-hour increments
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
          
          {/* Recent Time Entries */}
          {recentTimeEntries.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                  Recent Time Entries
                </Typography>
                
                <Stack spacing={2}>
                  {recentTimeEntries.map((entry) => (
                    <Paper key={entry.id} sx={{ p: 2, borderRadius: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="600">
                            {entry.description}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {entry.client} • {entry.matter}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {formatDate(entry.date)} • {entry.duration.toFixed(1)} hours
                          </Typography>
                        </Box>
                        <IconButton size="small" color="error" onClick={() => handleDeleteEntry(entry.id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Background Activity Tracking */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="600">
                  Background Activity
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={backgroundTracking}
                      onChange={(e) => setBackgroundTracking(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Enable"
                />
              </Box>
              
              {backgroundTracking ? (
                <>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Automatically track time spent in documents, emails, and calendar events.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2">
                      Recent Activities
                    </Typography>
                    <Button
                      size="small"
                      startIcon={showBackgroundEvents ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      onClick={() => setShowBackgroundEvents(!showBackgroundEvents)}
                    >
                      {showBackgroundEvents ? 'Hide' : 'Show'}
                    </Button>
                  </Box>
                  
                  {showBackgroundEvents && (
                    <Stack spacing={1} sx={{ mb: 2 }}>
                      {backgroundEvents.map((event) => (
                        <Paper 
                          key={event.id} 
                          sx={{ 
                            p: 1.5, 
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                          onClick={() => handleBackgroundEventSelect(event)}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getBackgroundEventIcon(event.type)}
                            <Box>
                              <Typography variant="body2" fontWeight="600">
                                {event.title}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {formatTimeShort(event.startTime)} • {event.duration} min
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                  
                  <Alert severity="info" sx={{ mt: 2 }}>
                    Click on an activity to create a time entry from it.
                  </Alert>
                </>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="textSecondary">
                    Enable background tracking to automatically capture your work activities.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Time Rounding Settings */}
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
                Time Rounding Settings
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Rounding Increment</InputLabel>
                <Select
                  value={roundingIncrement}
                  label="Rounding Increment"
                  onChange={(e) => {}}
                >
                  <MenuItem value={0.1}>6-minute increments (0.1 hour)</MenuItem>
                  <MenuItem value={0.25}>15-minute increments (0.25 hour)</MenuItem>
                  <MenuItem value={0.5}>30-minute increments (0.5 hour)</MenuItem>
                  <MenuItem value={1}>Full hour increments (1.0 hour)</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="textSecondary">
                Time entries will be automatically rounded to the nearest increment according to your firm's billing policy.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Idle Detection Dialog */}
      <Dialog open={idleDialogOpen} onClose={() => setIdleDialogOpen(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlarmIcon color="warning" />
            <Typography variant="h6">Idle Time Detected</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You've been idle for {Math.floor(idleTime / 60)} minutes and {idleTime % 60} seconds.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Would you like to keep this time or discard it?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscardIdleTime} color="error">
            Discard Time
          </Button>
          <Button onClick={handleKeepIdleTime} variant="contained">
            Keep Time
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutomaticTimer; 