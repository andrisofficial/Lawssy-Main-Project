import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Autocomplete,
  useTheme,
  Divider,
  Alert
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import InfoIcon from '@mui/icons-material/Info';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';

const NewMatterForm = ({ onSubmit }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    template: '',
    client: null,
    matterName: '',
    matterNumber: '',
    clientReferenceNumber: '',
    practiceArea: '',
    status: 'Active',
    matterStage: '',
    location: '',
    openDate: new Date(),
    closedDate: null,
    pendingDate: null,
    description: '',
    responsibleAttorney: '',
    referringAttorney: '',
    billingType: 'Hourly',
    billingRate: '',
    retainerAmount: '',
    courtJurisdiction: '',
    statuteOfLimitations: null
  });
  
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample data for dropdowns
  const practiceAreas = [
    'Litigation',
    'Corporate',
    'Intellectual Property',
    'Employment',
    'Real Estate',
    'Tax',
    'Bankruptcy',
    'Estate Planning',
    'Immigration',
    'Compliance'
  ];

  const statuses = [
    'Active',
    'Pending',
    'On Hold',
    'Closed'
  ];
  
  const matterStages = [
    'Initial Consultation',
    'Case Assessment',
    'Pre-filing',
    'Discovery',
    'Negotiation',
    'Trial Preparation',
    'Trial',
    'Settlement',
    'Appeal',
    'Post-Resolution'
  ];
  
  const locations = [
    'Main Office',
    'Satellite Office',
    'Remote',
    'Court',
    'Client Site'
  ];

  const billingTypes = [
    'Hourly',
    'Flat Fee',
    'Contingency',
    'Hybrid'
  ];

  const clients = [
    { id: 1, name: 'Acme Corporation', email: 'contact@acme.com' },
    { id: 2, name: 'Global Industries', email: 'info@globalindustries.com' },
    { id: 3, name: 'Tech Innovations', email: 'legal@techinnovations.com' },
    { id: 4, name: 'Smith & Co', email: 'office@smithco.com' },
    { id: 5, name: 'Johnson Family Trust', email: 'trust@johnsonfamily.com' }
  ];

  const attorneys = [
    'Sarah Johnson',
    'Michael Brown',
    'Emily Chen',
    'David Wilson',
    'Lauren Taylor'
  ];

  // Sample templates
  const templates = [
    'Contract Review Template',
    'Corporate Formation Template',
    'Litigation Template',
    'Estate Planning Template',
    'Intellectual Property Template'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };

  const handleClientChange = (event, newValue) => {
    setFormData({
      ...formData,
      client: newValue
    });
  };

  const handleReferringAttorneyChange = (event, newValue) => {
    setFormData({
      ...formData,
      referringAttorney: newValue
    });
  };

  const handleTemplateChange = (event, newValue) => {
    setFormData({
      ...formData,
      template: newValue
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation for required fields
    if (!formData.matterName) {
      newErrors.matterName = 'Matter name is required';
    }
    
    if (!formData.practiceArea) {
      newErrors.practiceArea = 'Practice area is required';
    }
    
    if (!formData.client) {
      newErrors.client = 'Client is required';
    }
    
    if (!formData.responsibleAttorney) {
      newErrors.responsibleAttorney = 'Responsible attorney is required';
    }
    
    // Validate billing rate if provided
    if (formData.billingRate && isNaN(parseFloat(formData.billingRate))) {
      newErrors.billingRate = 'Billing rate must be a number';
    }
    
    // Validate retainer amount if provided
    if (formData.retainerAmount && isNaN(parseFloat(formData.retainerAmount))) {
      newErrors.retainerAmount = 'Retainer amount must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    navigate('/matters');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Here you would submit the form data to your backend
    console.log('Form submitted with data:', formData);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // If there's an onSubmit prop, call it
      if (onSubmit) {
        onSubmit(formData);
      } else {
        // Navigate back to matters list
        navigate('/matters');
      }
    }, 1000);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {submitError && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            </Grid>
          )}
          
          {/* Template Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
              <DescriptionIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'text-bottom' }} />
              Template Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Autocomplete
              options={templates}
              value={formData.template}
              onChange={handleTemplateChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Existing Template"
                  fullWidth
                  size="small"
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Button 
              variant="outlined" 
              fullWidth
              size="small"
              sx={{ 
                py: 1.2, 
                borderColor: '#E5E7EB',
                color: 'text.primary',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'rgba(0, 105, 209, 0.04)'
                }
              }}
            >
              Create New Template
            </Button>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Matter Information Section (renamed from Client Information) */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
              <BusinessCenterIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'text-bottom' }} />
              Matter Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} container spacing={2} alignItems="center">
            <Grid item xs={12} sm={7}>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.name}
                value={formData.client}
                onChange={handleClientChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Client"
                    required
                    fullWidth
                    size="small"
                    error={!!errors.client}
                    helperText={errors.client}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                OR
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                variant="contained" 
                fullWidth
                size="small"
                onClick={() => navigate('/clients/new')}
                sx={{ 
                  py: 1, 
                  backgroundColor: theme.palette.primary.light,
                  color: 'white',
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 500,
                  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.main,
                  }
                }}
              >
                Create New Client
              </Button>
            </Grid>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Matter Name"
              name="matterName"
              value={formData.matterName}
              onChange={handleChange}
              fullWidth
              required
              placeholder="e.g., Johnson v. Smith"
              size="small"
              error={!!errors.matterName}
              helperText={errors.matterName}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Matter Number"
              name="matterNumber"
              value={formData.matterNumber}
              onChange={handleChange}
              fullWidth
              placeholder="e.g., LIT-2023-001 (Auto-generated if left blank)"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    #
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Client Reference Number"
              name="clientReferenceNumber"
              value={formData.clientReferenceNumber}
              onChange={handleChange}
              fullWidth
              placeholder="Client's internal reference number"
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              {locations.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Practice Area"
              name="practiceArea"
              value={formData.practiceArea}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              error={!!errors.practiceArea}
              helperText={errors.practiceArea}
            >
              {practiceAreas.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            >
              {statuses.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Matter Stage"
              name="matterStage"
              value={formData.matterStage}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              {matterStages.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Open Date"
                value={formData.openDate}
                onChange={(newValue) => handleDateChange('openDate', newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: "small",
                    required: true 
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Closed Date"
                value={formData.closedDate}
                onChange={(newValue) => handleDateChange('closedDate', newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: "small"
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Pending Date"
                value={formData.pendingDate}
                onChange={(newValue) => handleDateChange('pendingDate', newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: "small"
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Matter Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              placeholder="Enter a brief description of the matter..."
              size="small"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Team Assignment Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
              <GroupIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'text-bottom' }} />
              Team Assignment
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Responsible Attorney"
              name="responsibleAttorney"
              value={formData.responsibleAttorney}
              onChange={handleChange}
              fullWidth
              required
              size="small"
              error={!!errors.responsibleAttorney}
              helperText={errors.responsibleAttorney}
            >
              {attorneys.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Referring Attorney"
              name="referringAttorney"
              value={formData.referringAttorney}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              {attorneys.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Billing Information Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
              <PaymentIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'text-bottom' }} />
              Billing Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Billing Type"
              name="billingType"
              value={formData.billingType}
              onChange={handleChange}
              fullWidth
              required
              size="small"
            >
              {billingTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              label="Billing Rate"
              name="billingRate"
              value={formData.billingRate}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.billingRate}
              helperText={errors.billingRate}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              label="Retainer Amount"
              name="retainerAmount"
              value={formData.retainerAmount}
              onChange={handleChange}
              fullWidth
              size="small"
              error={!!errors.retainerAmount}
              helperText={errors.retainerAmount}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    $
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
          </Grid>
          
          {/* Additional Details Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
              <InfoIcon sx={{ mr: 1, fontSize: 20, verticalAlign: 'text-bottom' }} />
              Additional Details
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Court/Jurisdiction"
              name="courtJurisdiction"
              value={formData.courtJurisdiction}
              onChange={handleChange}
              fullWidth
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Statute of Limitations"
                value={formData.statuteOfLimitations}
                onChange={(newValue) => handleDateChange('statuteOfLimitations', newValue)}
                slotProps={{ 
                  textField: { 
                    fullWidth: true,
                    size: "small"
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'rgba(254, 249, 195, 0.5)', borderRadius: '4px', display: 'flex', alignItems: 'flex-start', mt: 1 }}>
              <InfoIcon sx={{ color: '#FBBF24', mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="#92400E">
                  Matter Creation Reminder
                </Typography>
                <Typography variant="body2">
                  After creating this matter, remember to upload relevant documents and set up initial tasks to get started.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          {/* Form Actions */}
          <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              sx={{ 
                mr: 2,
                borderColor: '#E5E7EB',
                color: 'text.primary',
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  backgroundColor: 'rgba(0, 105, 209, 0.04)'
                }
              }}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              {loading ? 'Creating...' : 'Create Matter'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default NewMatterForm; 