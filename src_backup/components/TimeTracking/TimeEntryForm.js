import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Autocomplete,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

const TimeEntryForm = ({ onSubmit, initialData, clients, matters }) => {
  const [formData, setFormData] = useState(initialData || {
    startTime: new Date(),
    endTime: new Date(),
    description: '',
    clientId: '',
    matterId: '',
    activityType: '',
    billable: true,
    rate: 0,
  });

  const activityTypes = [
    'Research',
    'Client Call',
    'Court Appearance',
    'Document Review',
    'Contract Drafting',
    'Meeting',
    'Other',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Time Entry
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Time"
                value={formData.startTime}
                onChange={(newValue) =>
                  setFormData({ ...formData, startTime: newValue })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="End Time"
                value={formData.endTime}
                onChange={(newValue) =>
                  setFormData({ ...formData, endTime: newValue })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={clients || []}
              getOptionLabel={(option) => option.name}
              value={clients?.find((c) => c.id === formData.clientId) || null}
              onChange={(_, newValue) =>
                setFormData({ ...formData, clientId: newValue?.id })
              }
              renderInput={(params) => (
                <TextField {...params} label="Client" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={matters || []}
              getOptionLabel={(option) => option.name}
              value={matters?.find((m) => m.id === formData.matterId) || null}
              onChange={(_, newValue) =>
                setFormData({ ...formData, matterId: newValue?.id })
              }
              renderInput={(params) => (
                <TextField {...params} label="Matter" fullWidth />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Activity Type"
              value={formData.activityType}
              onChange={handleChange('activityType')}
            >
              {activityTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Rate (per hour)"
              value={formData.rate}
              onChange={handleChange('rate')}
              InputProps={{
                startAdornment: '$',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" type="reset">
                Clear
              </Button>
              <Button variant="contained" type="submit">
                Save Entry
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TimeEntryForm; 