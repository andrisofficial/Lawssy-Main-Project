import React, { useState, useEffect } from 'react';
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
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Divider,
  Paper
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  ContentCopy as DuplicateIcon
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { useBillingRates } from '../billing/BillingRateManager';
import { useTimeTracking } from '../../contexts/TimeTrackingContext';

const ManualTimeEntry = ({ 
  clients = [], 
  matters = [], 
  practiceAreas = [],
  activityTypes = [],
}) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date(new Date().setHours(new Date().getHours() + 1)));
  const [description, setDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [billableType, setBillableType] = useState('billable');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState(null);
  const [selectedActivityType, setSelectedActivityType] = useState(null);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [rateOverridden, setRateOverridden] = useState(false);
  const [rateConfirmOpen, setRateConfirmOpen] = useState(false);
  const [pendingRateChange, setPendingRateChange] = useState(null);
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [bulkEditField, setBulkEditField] = useState('');
  const [bulkEditValue, setBulkEditValue] = useState('');
  const { lookupRate } = useBillingRates();
  const { timeEntries, addTimeEntry, deleteTimeEntry } = useTimeTracking();

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

  // Filter matters based on selected client
  const filteredMatters = selectedClient
    ? defaultMatters.filter(matter => matter.clientId === selectedClient.id)
    : [];

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date(new Date().setHours(new Date().getHours() + 1)));
    setDescription('');
    setSelectedClient(null);
    setSelectedMatter(null);
    setBillableType('billable');
    setSelectedPracticeArea(null);
    setSelectedActivityType(null);
  };

  const calculateDuration = () => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    // Apply rounding to 6-minute increments (0.1 hour)
    return Math.round(diffHours * 10) / 10;
  };

  // Function to fetch billing rate based on client, matter, practice area and activity type
  const fetchBillingRate = () => {
    if (!selectedClient) return;
    
    const options = {
      clientId: selectedClient?.id,
      matterId: selectedMatter?.id,
      practiceAreaId: selectedPracticeArea?.id,
      activityTypeId: selectedActivityType?.id
    };
    
    // Only update rate if it hasn't been manually overridden
    if (!rateOverridden) {
      const rate = lookupRate(options);
      setHourlyRate(rate);
    }
  };

  // Handle rate change with confirmation for override
  const handleRateChange = (newRate) => {
    // If first time setting or user already confirmed override
    if (hourlyRate === 0 || rateOverridden) {
      setHourlyRate(newRate);
      setRateOverridden(true);
    } else {
      // Ask for confirmation before overriding the default rate
      setPendingRateChange(newRate);
      setRateConfirmOpen(true);
    }
  };
  
  // Confirm rate override
  const confirmRateOverride = () => {
    setHourlyRate(pendingRateChange);
    setRateOverridden(true);
    setRateConfirmOpen(false);
  };
  
  // Cancel rate override
  const cancelRateOverride = () => {
    setPendingRateChange(null);
    setRateConfirmOpen(false);
  };
  
  // Reset rate override
  const resetRateOverride = () => {
    setRateOverridden(false);
    fetchBillingRate(); // Fetch the default rate again
  };

  // Call fetchBillingRate when relevant selections change
  useEffect(() => {
    if (!rateOverridden) {
      fetchBillingRate();
    }
  }, [selectedClient, selectedMatter, selectedPracticeArea, selectedActivityType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate duration in hours
    const durationInHours = calculateDuration();
    
    // Create the new time entry
    const timeEntry = {
      id: Date.now(),
      client: selectedClient,
      matter: selectedMatter,
      description,
      duration: durationInHours,
      seconds: durationInHours * 3600, // Convert hours to seconds
      startTime: startTime,
      endTime: endTime,
      date: selectedDate,
      billableType,
      practiceArea: selectedPracticeArea,
      activityType: selectedActivityType,
      hourlyRate
    };
    
    // Add to time entries
    addTimeEntry(timeEntry);
    
    // Reset form
    resetForm();
  };

  // Handle deleting an entry
  const handleDeleteEntry = (id) => {
    deleteTimeEntry(id);
  };

  const handleDuplicateEntry = (entry) => {
    // Create a deep copy of the entry with new ID and current date
    const duplicatedEntry = {
      ...entry,
      id: Date.now(),
      date: new Date(),
    };
    
    // Make sure duration and seconds are properly set
    if (duplicatedEntry.duration && !duplicatedEntry.seconds) {
      duplicatedEntry.seconds = duplicatedEntry.duration * 3600;
    } else if (duplicatedEntry.seconds && !duplicatedEntry.duration) {
      duplicatedEntry.duration = duplicatedEntry.seconds / 3600;
    }
    
    // Make sure startTime and endTime are properly set
    if (!duplicatedEntry.startTime || !duplicatedEntry.endTime) {
      const end = new Date();
      const start = duplicatedEntry.duration 
        ? new Date(end.getTime() - (duplicatedEntry.duration * 3600 * 1000))
        : new Date(end.getTime() - (duplicatedEntry.seconds * 1000));
      
      duplicatedEntry.startTime = start;
      duplicatedEntry.endTime = end;
    }
    
    addTimeEntry(duplicatedEntry);
  };

  const handleEditEntry = (entry) => {
    setSelectedDate(new Date(entry.date));
    
    // Handle start and end times
    if (entry.startTime && entry.endTime) {
      setStartTime(new Date(entry.startTime));
      setEndTime(new Date(entry.endTime));
    } else if (entry.seconds) {
      // If we only have seconds, calculate approximate start and end times
      const end = new Date();
      const start = new Date(end.getTime() - (entry.seconds * 1000));
      setStartTime(start);
      setEndTime(end);
    } else {
      // Default to current time with 1 hour difference
      setStartTime(new Date());
      setEndTime(new Date(new Date().setHours(new Date().getHours() + 1)));
    }
    
    setDescription(entry.description || '');
    
    // Handle client selection
    if (entry.client) {
      if (typeof entry.client === 'object') {
        setSelectedClient(entry.client);
      } else {
        setSelectedClient(defaultClients.find(client => client.name === entry.client) || null);
      }
    } else {
      setSelectedClient(null);
    }
    
    // Handle matter selection
    if (entry.matter) {
      if (typeof entry.matter === 'object') {
        setSelectedMatter(entry.matter);
      } else {
        setSelectedMatter(defaultMatters.find(matter => matter.name === entry.matter) || null);
      }
    } else {
      setSelectedMatter(null);
    }
    
    setBillableType(entry.billableType || 'billable');
    
    // Handle practice area
    if (entry.practiceArea) {
      if (typeof entry.practiceArea === 'object') {
        setSelectedPracticeArea(entry.practiceArea);
      } else {
        setSelectedPracticeArea(defaultPracticeAreas.find(area => area.name === entry.practiceArea) || null);
      }
    } else {
      setSelectedPracticeArea(null);
    }
    
    // Handle activity type
    if (entry.activityType) {
      if (typeof entry.activityType === 'object') {
        setSelectedActivityType(entry.activityType);
      } else {
        setSelectedActivityType(defaultActivityTypes.find(type => type.name === entry.activityType) || null);
      }
    } else {
      setSelectedActivityType(null);
    }
    
    // Set hourly rate
    setHourlyRate(entry.hourlyRate || 0);
    
    // Delete the old entry
    deleteTimeEntry(entry.id);
    
    // Open the dialog
    setOpen(true);
  };

  const toggleEntrySelection = (entryId) => {
    if (selectedEntries.includes(entryId)) {
      setSelectedEntries(selectedEntries.filter(id => id !== entryId));
    } else {
      setSelectedEntries([...selectedEntries, entryId]);
    }
  };

  const handleBulkEdit = () => {
    if (!bulkEditField || selectedEntries.length === 0) return;
    
    const updatedEntries = timeEntries.map(entry => {
      if (selectedEntries.includes(entry.id)) {
        switch (bulkEditField) {
          case 'billableType':
            return { ...entry, billableType: bulkEditValue };
          case 'practiceArea':
            return { ...entry, practiceArea: bulkEditValue };
          case 'activityType':
            return { ...entry, activityType: bulkEditValue };
          default:
            return entry;
        }
      }
      return entry;
    });
    
    updatedEntries.forEach(entry => addTimeEntry(entry));
    setBulkEditMode(false);
    setSelectedEntries([]);
    setBulkEditField('');
    setBulkEditValue('');
  };

  const handleBulkDelete = () => {
    if (selectedEntries.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedEntries.length} entries?`)) {
      selectedEntries.forEach(id => deleteTimeEntry(id));
      setSelectedEntries([]);
      setBulkEditMode(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight="600">
          Manual Time Entries
        </Typography>
        <Stack direction="row" spacing={2}>
          {bulkEditMode ? (
            <>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleBulkDelete}
                disabled={selectedEntries.length === 0}
              >
                Delete Selected
              </Button>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Field to Edit</InputLabel>
                <Select
                  value={bulkEditField}
                  label="Field to Edit"
                  onChange={(e) => setBulkEditField(e.target.value)}
                  size="small"
                >
                  <MenuItem value="billableType">Billable Type</MenuItem>
                  <MenuItem value="practiceArea">Practice Area</MenuItem>
                  <MenuItem value="activityType">Activity Type</MenuItem>
                </Select>
              </FormControl>
              {bulkEditField === 'billableType' && (
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Billable Type</InputLabel>
                  <Select
                    value={bulkEditValue}
                    label="Billable Type"
                    onChange={(e) => setBulkEditValue(e.target.value)}
                    size="small"
                  >
                    <MenuItem value="billable">Billable</MenuItem>
                    <MenuItem value="non-billable">Non-Billable</MenuItem>
                    <MenuItem value="no-charge">No Charge</MenuItem>
                  </Select>
                </FormControl>
              )}
              {bulkEditField === 'practiceArea' && (
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Practice Area</InputLabel>
                  <Select
                    value={bulkEditValue}
                    label="Practice Area"
                    onChange={(e) => setBulkEditValue(e.target.value)}
                    size="small"
                  >
                    {defaultPracticeAreas.map(area => (
                      <MenuItem key={area.id} value={area.name}>{area.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {bulkEditField === 'activityType' && (
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Activity Type</InputLabel>
                  <Select
                    value={bulkEditValue}
                    label="Activity Type"
                    onChange={(e) => setBulkEditValue(e.target.value)}
                    size="small"
                  >
                    {defaultActivityTypes.map(type => (
                      <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <Button 
                variant="contained" 
                onClick={handleBulkEdit}
                disabled={!bulkEditField || selectedEntries.length === 0}
              >
                Apply
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setBulkEditMode(false);
                  setSelectedEntries([]);
                }}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outlined" 
                onClick={() => setBulkEditMode(true)}
                disabled={timeEntries.length === 0}
              >
                Bulk Edit
              </Button>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />} 
                onClick={handleOpen}
              >
                Add Time Entry
              </Button>
            </>
          )}
        </Stack>
      </Box>

      {/* Time Entries List */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        {timeEntries.length > 0 ? (
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  {bulkEditMode && (
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedEntries.length === timeEntries.length}
                        onChange={() => {
                          if (selectedEntries.length === timeEntries.length) {
                            setSelectedEntries([]);
                          } else {
                            setSelectedEntries(timeEntries.map(entry => entry.id));
                          }
                        }}
                      />
                    </th>
                  )}
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Time</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Duration</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Client</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Matter</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Description</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Practice Area</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Activity Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timeEntries.map((entry) => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    {bulkEditMode && (
                      <td style={{ padding: '12px 16px' }}>
                        <input 
                          type="checkbox" 
                          checked={selectedEntries.includes(entry.id)}
                          onChange={() => toggleEntrySelection(entry.id)}
                        />
                      </td>
                    )}
                    <td style={{ padding: '12px 16px' }}>{formatDate(entry.date)}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {entry.startTime && entry.endTime ? `${formatTime(entry.startTime)} - ${formatTime(entry.endTime)}` : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {entry.duration ? entry.duration.toFixed(1) : 
                       (entry.seconds ? (entry.seconds / 3600).toFixed(1) : '0.0')}h
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {entry.client && typeof entry.client === 'object' ? entry.client.name : entry.client}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {entry.matter && typeof entry.matter === 'object' ? entry.matter.name : entry.matter}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{entry.description}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {entry.practiceArea ? 
                        (typeof entry.practiceArea === 'object' ? entry.practiceArea.name : entry.practiceArea) 
                        : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {entry.activityType ? 
                        (typeof entry.activityType === 'object' ? entry.activityType.name : entry.activityType) 
                        : '-'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        backgroundColor: entry.billableType === 'billable' ? '#e3f2fd' : 
                                        entry.billableType === 'non-billable' ? '#fff3e0' : '#ffebee',
                        color: entry.billableType === 'billable' ? '#1976d2' : 
                              entry.billableType === 'non-billable' ? '#f57c00' : '#d32f2f',
                        fontSize: '0.75rem',
                        fontWeight: 500
                      }}>
                        {entry.billableType === 'billable' ? 'Billable' : 
                         entry.billableType === 'non-billable' ? 'Non-Billable' : 'No Charge'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => handleEditEntry(entry)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Duplicate">
                          <IconButton size="small" onClick={() => handleDuplicateEntry(entry)}>
                            <DuplicateIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDeleteEntry(entry.id)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="textSecondary">No time entries yet. Click "Add Time Entry" to create one.</Typography>
          </Box>
        )}
      </Paper>

      {/* Add/Edit Time Entry Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="600">
            Add Time Entry
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(newValue) => setStartTime(newValue)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                  slotProps={{ textField: { fullWidth: true, required: true } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
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
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={filteredMatters}
                  getOptionLabel={(option) => option.name}
                  value={selectedMatter}
                  onChange={(event, newValue) => {
                    setSelectedMatter(newValue);
                  }}
                  disabled={!selectedClient}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  placeholder="What did you work on?"
                  fullWidth
                  multiline
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Billable Type</InputLabel>
                  <Select
                    value={billableType}
                    label="Billable Type"
                    onChange={(e) => setBillableType(e.target.value)}
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
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="textSecondary">
                    Duration: {calculateDuration().toFixed(1)} hours
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    (Rounded to nearest 6-minute increment)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Billing Rate ($/hr)"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => handleRateChange(parseFloat(e.target.value))}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <Tooltip title={rateOverridden ? "Reset to default rate" : "Using default rate"}>
                        <IconButton 
                          size="small" 
                          onClick={resetRateOverride}
                          disabled={!rateOverridden}
                          sx={{ mr: 1 }}
                        >
                          {rateOverridden ? <EditIcon color="primary" /> : <EditIcon color="disabled" />}
                        </IconButton>
                      </Tooltip>
                    )
                  }}
                  disabled={billableType !== 'billable'}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={!selectedClient || !selectedMatter || !description}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rate Override Confirmation Dialog */}
      <Dialog open={rateConfirmOpen} onClose={cancelRateOverride}>
        <DialogTitle>Override Billing Rate?</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to change the billing rate from ${hourlyRate}/hr to ${pendingRateChange}/hr for this time entry.
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            This will override the default rate for this time entry only and will not affect future entries.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelRateOverride}>Cancel</Button>
          <Button onClick={confirmRateOverride} variant="contained" color="primary">
            Override Rate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManualTimeEntry; 