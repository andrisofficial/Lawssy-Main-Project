import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import caseService from '../../services/caseService/caseService';
import clientService from '../../services/clientService/clientService';

const CaseForm = ({ caseData, onSubmit, mode = 'create' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  // Form data state
  const [formData, setFormData] = useState({
    title: '',
    case_number: '',
    case_type: '',
    client_id: '',
    status_id: '',
    filed_date: null,
    court_name: '',
    judge_name: '',
    attorney_name: '',
    opposing_counsel: '',
    description: ''
  });

  // Form validation errors
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Load statuses and clients on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch case statuses
        const statusesData = await caseService.getCaseStatuses();
        setStatuses(statusesData);
        
        // Set default status for new cases (Open)
        if (mode === 'create' && statusesData.length > 0) {
          const defaultStatus = statusesData.find(status => status.name === 'Open');
          if (defaultStatus) {
            setFormData(prev => ({
              ...prev,
              status_id: defaultStatus.id
            }));
          }
        }

        // Fetch clients for the dropdown
        const clientsData = await clientService.getAllClients();
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [mode]);

  // Populate form with case data when editing
  useEffect(() => {
    if (caseData && mode === 'edit') {
      setFormData({
        title: caseData.title || '',
        case_number: caseData.case_number || '',
        case_type: caseData.case_type || '',
        client_id: caseData.client_id || '',
        status_id: caseData.status_id || '',
        filed_date: caseData.filed_date ? new Date(caseData.filed_date) : null,
        court_name: caseData.court_name || '',
        judge_name: caseData.judge_name || '',
        attorney_name: caseData.attorney_name || '',
        opposing_counsel: caseData.opposing_counsel || '',
        description: caseData.description || ''
      });

      // Set the selected client
      if (caseData.client_id) {
        const client = clients.find(c => c.id === caseData.client_id);
        setSelectedClient(client || null);
      }
    }
  }, [caseData, mode, clients]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      filed_date: date
    }));

    if (errors.filed_date) {
      setErrors(prev => ({
        ...prev,
        filed_date: ''
      }));
    }
  };

  // Handle client selection
  const handleClientChange = (event, newValue) => {
    setSelectedClient(newValue);
    setFormData(prev => ({
      ...prev,
      client_id: newValue ? newValue.id : ''
    }));

    if (errors.client_id) {
      setErrors(prev => ({
        ...prev,
        client_id: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Title is required
    if (!formData.title) {
      newErrors.title = 'Case title is required';
    }

    // Case type is required
    if (!formData.case_type) {
      newErrors.case_type = 'Case type is required';
    }

    // Status is required
    if (!formData.status_id) {
      newErrors.status_id = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Call the parent component's onSubmit function
      await onSubmit(formData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'An error occurred while saving the case');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate('/cases');
  };

  // Get client display name
  const getClientName = (client) => {
    if (!client) return '';
    
    if (client.client_type === 'Individual') {
      return `${client.first_name} ${client.last_name || ''}`.trim();
    }
    return client.organization_name;
  };

  return (
    <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Case Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Basic Information
            </Typography>
          </Grid>

          {/* Title */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Case Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Grid>

          {/* Case Number */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Case Number"
              name="case_number"
              value={formData.case_number}
              onChange={handleChange}
              error={!!errors.case_number}
              helperText={errors.case_number}
            />
          </Grid>

          {/* Case Type */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.case_type} required>
              <InputLabel>Case Type</InputLabel>
              <Select
                name="case_type"
                value={formData.case_type}
                onChange={handleChange}
                label="Case Type"
              >
                <MenuItem value="Litigation">Litigation</MenuItem>
                <MenuItem value="Corporate">Corporate</MenuItem>
                <MenuItem value="Family">Family</MenuItem>
                <MenuItem value="Real Estate">Real Estate</MenuItem>
                <MenuItem value="Criminal">Criminal</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
              {errors.case_type && <FormHelperText>{errors.case_type}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.status_id} required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status_id"
                value={formData.status_id}
                onChange={handleChange}
                label="Status"
              >
                {statuses.map((status) => (
                  <MenuItem key={status.id} value={status.id}>
                    {status.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.status_id && <FormHelperText>{errors.status_id}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Client */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              id="client-select"
              options={clients}
              getOptionLabel={(option) => getClientName(option)}
              value={selectedClient}
              onChange={handleClientChange}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Associated Client"
                  name="client_id"
                  error={!!errors.client_id}
                  helperText={errors.client_id}
                />
              )}
            />
          </Grid>

          {/* Filed Date */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Filed Date"
                value={formData.filed_date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.filed_date,
                    helperText: errors.filed_date
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Additional Details Section */}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Additional Details
            </Typography>
          </Grid>

          {/* Attorney Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Attorney Name"
              name="attorney_name"
              value={formData.attorney_name}
              onChange={handleChange}
            />
          </Grid>

          {/* Court Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Court"
              name="court_name"
              value={formData.court_name}
              onChange={handleChange}
            />
          </Grid>

          {/* Judge Name */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Judge"
              name="judge_name"
              value={formData.judge_name}
              onChange={handleChange}
            />
          </Grid>

          {/* Opposing Counsel */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Opposing Counsel"
              name="opposing_counsel"
              value={formData.opposing_counsel}
              onChange={handleChange}
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Case Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : mode === 'create' ? (
                'Create Case'
              ) : (
                'Update Case'
              )}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

CaseForm.propTypes = {
  caseData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['create', 'edit'])
};

export default CaseForm; 