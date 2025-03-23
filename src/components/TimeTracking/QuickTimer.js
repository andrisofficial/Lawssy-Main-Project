import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import { useBillingRates } from '../billing/BillingRateManager';
import { useTimeTracking } from '../../contexts/TimeTrackingContext';

const QuickTimer = ({ clients = [], matters = [], practiceAreas = [], activityTypes = [] }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [billableType, setBillableType] = useState('billable');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState(null);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [hourlyRate, setHourlyRate] = useState(0);
  
  const timerRef = useRef(null);
  const { lookupRate } = useBillingRates();
  const { addTimeEntry } = useTimeTracking();
  
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    
    return () => clearInterval(timerRef.current);
  }, [isRunning]);
  
  // Formats the time as HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  // Handle starting the timer
  const handleStart = () => {
    setIsRunning(true);
  };
  
  // Handle pausing the timer
  const handlePause = () => {
    setIsRunning(false);
  };
  
  // Handle stopping the timer
  const handleStop = () => {
    setIsRunning(false);
    setDialogOpen(true);
  };
  
  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    setSelectedClient(null);
    setSelectedMatter(null);
    setDescription('');
    setBillableType('billable');
    setSelectedPracticeArea(null);
    setSelectedActivityType(null);
    setHourlyRate(0);
  };
  
  // Handle saving the time entry
  const handleSaveTimeEntry = () => {
    const newTimeEntry = {
      id: Date.now(),
      client: selectedClient,
      matter: selectedMatter,
      description,
      seconds,
      date: new Date(),
      billableType,
      practiceArea: selectedPracticeArea,
      activityType: selectedActivityType,
      hourlyRate
    };
    
    addTimeEntry(newTimeEntry);
    setDialogOpen(false);
    resetTimer();
  };
  
  // Handle client change
  const handleClientChange = (_, newValue) => {
    setSelectedClient(newValue);
    setSelectedMatter(null);
    // Reset rate when client changes
    if (newValue) {
      fetchBillingRate(newValue.id, null);
    } else {
      setHourlyRate(0);
    }
  };
  
  // Handle matter change
  const handleMatterChange = (_, newValue) => {
    setSelectedMatter(newValue);
    // Update billing rate when matter changes
    if (selectedClient && newValue) {
      fetchBillingRate(selectedClient.id, newValue.id);
    }
  };
  
  // Fetch the billing rate based on client and matter
  const fetchBillingRate = (clientId, matterId) => {
    if (clientId) {
      const rate = lookupRate(clientId, matterId);
      setHourlyRate(rate || 0);
    } else {
      setHourlyRate(0);
    }
  };
  
  return (
    <>
      <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={isRunning ? handlePause : handleStart}
          sx={{ 
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            height: '40px'
          }}
        >
          {formatTime(seconds)}
        </Button>
        {isRunning && (
          <IconButton 
            color="error" 
            onClick={handleStop}
            size="small"
            sx={{ ml: 1 }}
          >
            <StopIcon />
          </IconButton>
        )}
      </Box>
      
      {/* Dialog for entering details after stopping the timer */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Save Time Entry</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Time recorded: <strong>{formatTime(seconds)}</strong>
            </Typography>
            
            <Autocomplete
              id="client-select"
              options={clients}
              getOptionLabel={(option) => option.name}
              value={selectedClient}
              onChange={handleClientChange}
              renderInput={(params) => <TextField {...params} label="Client" margin="normal" required />}
              sx={{ mb: 2 }}
            />
            
            <Autocomplete
              id="matter-select"
              options={matters.filter(matter => !selectedClient || matter.clientId === selectedClient.id)}
              getOptionLabel={(option) => option.name}
              value={selectedMatter}
              onChange={handleMatterChange}
              disabled={!selectedClient}
              renderInput={(params) => <TextField {...params} label="Matter" margin="normal" required />}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              required
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Billable Type</InputLabel>
              <Select
                value={billableType}
                onChange={(e) => setBillableType(e.target.value)}
                label="Billable Type"
              >
                <MenuItem value="billable">Billable</MenuItem>
                <MenuItem value="non-billable">Non-Billable</MenuItem>
                <MenuItem value="no-charge">No Charge</MenuItem>
              </Select>
            </FormControl>
            
            <Autocomplete
              id="practice-area-select"
              options={practiceAreas}
              getOptionLabel={(option) => option.name}
              value={selectedPracticeArea}
              onChange={(_, newValue) => setSelectedPracticeArea(newValue)}
              renderInput={(params) => <TextField {...params} label="Practice Area" margin="normal" />}
              sx={{ mb: 2 }}
            />
            
            <Autocomplete
              id="activity-type-select"
              options={activityTypes}
              getOptionLabel={(option) => option.name}
              value={selectedActivityType}
              onChange={(_, newValue) => setSelectedActivityType(newValue)}
              renderInput={(params) => <TextField {...params} label="Activity Type" margin="normal" />}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Hourly Rate"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveTimeEntry} 
            variant="contained" 
            color="primary"
            disabled={!selectedClient || !selectedMatter || !description}
          >
            Save Time Entry
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default QuickTimer; 