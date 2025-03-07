import React, { useState } from 'react';
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

const ManualTimeEntry = ({ 
  clients = [], 
  matters = [], 
  timeEntries = [], 
  setTimeEntries,
  practiceAreas = [],
  activityTypes = []
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
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [bulkEditField, setBulkEditField] = useState('');
  const [bulkEditValue, setBulkEditValue] = useState('');

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

  const handleSave = () => {
    if (!selectedClient || !selectedMatter || !description) return;
    
    const duration = calculateDuration();
    
    if (duration <= 0) {
      alert('End time must be after start time');
      return;
    }
    
    const newEntry = {
      id: Date.now(),
      date: selectedDate,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
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
    };
    
    setTimeEntries([newEntry, ...timeEntries]);
    handleClose();
  };

  const handleDeleteEntry = (id) => {
    setTimeEntries(timeEntries.filter(entry => entry.id !== id));
  };

  const handleDuplicateEntry = (entry) => {
    const duplicatedEntry = {
      ...entry,
      id: Date.now(),
      date: new Date(),
    };
    
    setTimeEntries([duplicatedEntry, ...timeEntries]);
  };

  const handleEditEntry = (entry) => {
    setSelectedDate(new Date(entry.date));
    setStartTime(new Date(entry.startTime));
    setEndTime(new Date(entry.endTime));
    setDescription(entry.description);
    setSelectedClient(defaultClients.find(client => client.id === entry.clientId));
    setSelectedMatter(defaultMatters.find(matter => matter.id === entry.matterId));
    setBillableType(entry.billableType);
    setSelectedPracticeArea(defaultPracticeAreas.find(area => area.name === entry.practiceArea));
    setSelectedActivityType(defaultActivityTypes.find(type => type.name === entry.activityType));
    
    // Delete the old entry
    setTimeEntries(timeEntries.filter(e => e.id !== entry.id));
    
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
    
    setTimeEntries(updatedEntries);
    setBulkEditMode(false);
    setSelectedEntries([]);
    setBulkEditField('');
    setBulkEditValue('');
  };

  const handleBulkDelete = () => {
    if (selectedEntries.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedEntries.length} entries?`)) {
      setTimeEntries(timeEntries.filter(entry => !selectedEntries.includes(entry.id)));
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
                      {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                    </td>
                    <td style={{ padding: '12px 16px' }}>{entry.duration.toFixed(1)}h</td>
                    <td style={{ padding: '12px 16px' }}>{entry.client}</td>
                    <td style={{ padding: '12px 16px' }}>{entry.matter}</td>
                    <td style={{ padding: '12px 16px' }}>{entry.description}</td>
                    <td style={{ padding: '12px 16px' }}>{entry.practiceArea || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>{entry.activityType || '-'}</td>
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
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TimePicker
                  label="Start Time"
                  value={startTime}
                  onChange={(newValue) => setStartTime(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TimePicker
                  label="End Time"
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
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
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!selectedClient || !selectedMatter || !description}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManualTimeEntry; 