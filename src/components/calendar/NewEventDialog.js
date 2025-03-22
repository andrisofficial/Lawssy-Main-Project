import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip,
  Autocomplete,
  FormControlLabel,
  Checkbox,
  FormGroup
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useCalendar } from '../../contexts/CalendarContext';
import { format } from 'date-fns';

const eventTypes = [
  { value: 'appointment', label: 'Appointment', color: '#0069d1' },
  { value: 'meeting', label: 'Meeting', color: '#10B981' },
  { value: 'task', label: 'Task', color: '#3B82F6' },
  { value: 'deadline', label: 'Deadline', color: '#EF4444' },
  { value: 'reminder', label: 'Reminder', color: '#F59E0B' },
  { value: 'document', label: 'Document Due', color: '#8B5CF6' },
  { value: 'adhoc', label: 'Ad Hoc', color: '#6B7280' },
];

const priorityOptions = [
  { value: 'high', label: 'High', color: '#EF4444' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'low', label: 'Low', color: '#10B981' },
];

const recurrenceOptions = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const reminderTypes = [
  { value: 'email', label: 'Email' },
  { value: 'message', label: 'Message' },
  { value: 'popup', label: 'Popup' },
];

const timeUnitOptions = [
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'days', label: 'Days' },
  { value: 'weeks', label: 'Weeks' },
  { value: 'months', label: 'Months' },
];

const calendarOptions = [
  { value: 'personal', label: 'Personal Calendar' },
  { value: 'work', label: 'Work Calendar' },
  { value: 'firm', label: 'Firm Calendar' },
  { value: 'team', label: 'Team Calendar' },
  { value: 'client', label: 'Client Calendar' },
];

// Sample matters for autocomplete
const matterOptions = [
  { id: 1, label: 'Smith v. Johnson' },
  { id: 2, label: 'Estate of Williams' },
  { id: 3, label: 'Corporate Merger - ABC Inc.' },
  { id: 4, label: 'Patent Application #12345' },
  { id: 5, label: 'Real Estate Closing - 123 Main St' },
];

const NewEventDialog = ({ open, onClose, currentDate, editEvent = null }) => {
  const { createEvent, updateEvent, deleteEvent } = useCalendar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'appointment',
    priority: 'medium',
    startDate: currentDate,
    endDate: currentDate,
    location: '',
    matter: '',
    participants: [],
    isAllDay: false,
    reminders: [{ time: 15, unit: 'minutes', type: 'popup' }],
    color: '#0069d1',
    recurrence: 'none',
    selectedCalendar: 'personal',
    addToFirmCalendar: false
  });

  useEffect(() => {
    if (editEvent) {
      setFormData({
        ...editEvent,
        startDate: new Date(editEvent.startDate || editEvent.date),
        endDate: new Date(editEvent.endDate || editEvent.date),
        priority: editEvent.priority || 'medium',
        recurrence: editEvent.recurrence || 'none',
        selectedCalendar: editEvent.selectedCalendar || 'personal',
        addToFirmCalendar: editEvent.addToFirmCalendar || false,
        reminders: editEvent.reminders.map(r => ({
          ...r,
          type: r.type || 'popup'
        }))
      });
    } else {
      // Reset form for new event
      setFormData({
        title: '',
        description: '',
        type: 'appointment',
        priority: 'medium',
        startDate: currentDate,
        endDate: currentDate,
        location: '',
        matter: '',
        participants: [],
        isAllDay: false,
        reminders: [{ time: 15, unit: 'minutes', type: 'popup' }],
        color: '#0069d1',
        recurrence: 'none',
        selectedCalendar: 'personal',
        addToFirmCalendar: false
      });
    }
  }, [editEvent, currentDate, open]);

  const handleChange = (field, value) => {
    // For date fields, ensure we have a valid date object
    if (field === 'startDate' || field === 'endDate') {
      const validDate = value ? 
        (value instanceof Date && !isNaN(value.getTime()) ? value : null) : null;
      
      setFormData({
        ...formData,
        [field]: validDate
      });
      return;
    }

    setFormData({
      ...formData,
      [field]: value
    });

    // Update color when type changes
    if (field === 'type') {
      const selectedType = eventTypes.find(type => type.value === value);
      if (selectedType) {
        setFormData(prev => ({
          ...prev,
          type: value,
          color: selectedType.color
        }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validate form
      if (!formData.title.trim()) {
        setError('Title is required');
        return;
      }

      const eventData = {
        ...formData,
        date: formData.startDate, // For backward compatibility
      };

      if (editEvent) {
        await updateEvent(eventData);
      } else {
        await createEvent(eventData);
      }

      onClose();
    } catch (err) {
      setError('Failed to save event. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editEvent || !editEvent.id) return;

    try {
      setIsSubmitting(true);
      await deleteEvent(editEvent.id);
      onClose();
    } catch (err) {
      setError('Failed to delete event. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReminder = () => {
    handleChange('reminders', [...formData.reminders, { time: 15, unit: 'minutes', type: 'popup' }]);
  };

  const handleReminderChange = (index, field, value) => {
    const newReminders = [...formData.reminders];
    newReminders[index] = { ...newReminders[index], [field]: value };
    handleChange('reminders', newReminders);
  };

  const handleRemoveReminder = (index) => {
    const newReminders = [...formData.reminders];
    newReminders.splice(index, 1);
    handleChange('reminders', newReminders);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h5">
            {editEvent ? 'Edit Event' : 'New Event'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <Divider />
        
        <DialogContent sx={{ py: 3 }}>
          {error && (
            <Box sx={{ mb: 2, p: 1, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Title"
                fullWidth
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
                variant="outlined"
                placeholder="Add title"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Autocomplete
                freeSolo
                options={eventTypes}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                value={eventTypes.find(type => type.value === formData.type) || null}
                onChange={(_, newValue) => {
                  if (newValue) {
                    if (typeof newValue === 'string') {
                      // Handle custom input
                      handleChange('type', newValue.toLowerCase().replace(/\s+/g, '_'));
                      handleChange('color', '#6B7280'); // Default color for custom types
                    } else {
                      handleChange('type', newValue.value);
                      handleChange('color', newValue.color);
                    }
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Event Type" variant="outlined" fullWidth />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: option.color,
                        mr: 1 
                      }} 
                    />
                    {option.label}
                  </Box>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Autocomplete
                freeSolo
                options={matterOptions}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                value={formData.matter}
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleChange('matter', typeof newValue === 'string' ? newValue : newValue.label);
                  } else {
                    handleChange('matter', '');
                  }
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Matter" variant="outlined" fullWidth placeholder="Related matter" />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  label="Priority"
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 12, 
                            height: 12, 
                            borderRadius: '50%', 
                            bgcolor: option.color,
                            mr: 1 
                          }} 
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="Start Date & Time"
                value={formData.startDate}
                onChange={(date) => handleChange('startDate', date)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true 
                  } 
                }}
                ampm={true}
                format="MMM d, yyyy h:mm a"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                label="End Date & Time"
                value={formData.endDate}
                onChange={(date) => handleChange('endDate', date)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true 
                  } 
                }}
                ampm={true}
                format="MMM d, yyyy h:mm a"
                minDateTime={formData.startDate}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.isAllDay}
                      onChange={(e) => handleChange('isAllDay', e.target.checked)}
                    />
                  }
                  label="All Day"
                />
                
                <FormControl sx={{ ml: 2, minWidth: 200 }}>
                  <InputLabel>Repeat</InputLabel>
                  <Select
                    value={formData.recurrence}
                    onChange={(e) => handleChange('recurrence', e.target.value)}
                    label="Repeat"
                  >
                    {recurrenceOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </FormGroup>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Location"
                fullWidth
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                variant="outlined"
                placeholder="Add location"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Reminders
              </Typography>
              
              {formData.reminders.map((reminder, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
                  <TextField
                    label="Time"
                    type="number"
                    value={reminder.time}
                    onChange={(e) => handleReminderChange(index, 'time', parseInt(e.target.value) || 0)}
                    variant="outlined"
                    size="small"
                    sx={{ width: 80 }}
                  />
                  
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Unit</InputLabel>
                    <Select
                      value={reminder.unit}
                      onChange={(e) => handleReminderChange(index, 'unit', e.target.value)}
                      label="Unit"
                    >
                      {timeUnitOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Typography variant="body2" sx={{ mx: 1 }}>
                    before via
                  </Typography>
                  
                  <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Method</InputLabel>
                    <Select
                      value={reminder.type}
                      onChange={(e) => handleReminderChange(index, 'type', e.target.value)}
                      label="Method"
                    >
                      {reminderTypes.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => handleRemoveReminder(index)}
                    sx={{ ml: 'auto' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
              
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddReminder}
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              >
                Add Reminder
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Calendar</InputLabel>
                <Select
                  value={formData.selectedCalendar}
                  onChange={(e) => handleChange('selectedCalendar', e.target.value)}
                  label="Select Calendar"
                >
                  {calendarOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.addToFirmCalendar}
                    onChange={(e) => handleChange('addToFirmCalendar', e.target.checked)}
                  />
                }
                label="Add this event to the Firm calendar as well as the selected calendar"
                sx={{ mt: 1 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                variant="outlined"
                placeholder="Add description"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          {editEvent ? (
            <Button 
              onClick={handleDelete} 
              color="error" 
              startIcon={<DeleteIcon />}
              disabled={isSubmitting}
            >
              Delete
            </Button>
          ) : (
            <Box /> // Empty box for spacing
          )}
          
          <Box>
            <Button onClick={onClose} sx={{ mr: 1 }} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editEvent ? 'Update' : 'Create'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default NewEventDialog; 