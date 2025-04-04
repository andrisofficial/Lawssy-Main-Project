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
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Chip,
  Stack,
  Switch,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  PhotoCamera as PhotoCameraIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import clientService from '../../services/clientService/clientService';

// Fallback statuses in case the API call fails
const FALLBACK_STATUSES = [
  { id: 'pending-status', name: 'Pending', color: '#FFC107' },
  { id: 'active-status', name: 'Active', color: '#4CAF50' },
  { id: 'inactive-status', name: 'Inactive', color: '#9E9E9E' },
  { id: 'consultation-status', name: 'Consultation', color: '#2196F3' },
  { id: 'closed-status', name: 'Closed', color: '#F44336' },
  { id: 'archived-status', name: 'Archived', color: '#607D8B' }
];

const PHONE_TYPES = ['Work', 'Mobile', 'Home', 'Other'];
const EMAIL_TYPES = ['Work', 'Personal', 'Other'];
const WEBSITE_TYPES = ['Work', 'Personal', 'Portfolio', 'Other'];
const ADDRESS_TYPES = ['Work', 'Home', 'Mailing', 'Other'];
const NAME_PREFIXES = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Esq.'];

const ClientForm = ({ client, onSubmit, mode = 'create' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState([]);
  const [statusLoading, setStatusLoading] = useState(true);
  const [usesFallbackStatuses, setUsesFallbackStatuses] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  // Form data state with new fields
  const [formData, setFormData] = useState({
    // Contact type (Person or Company toggle)
    contact_type: 'Person',
    
    // Personal Information (Person)
    prefix: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: null,
    
    // Company Information
    company_name: '',
    title: '',
    
    // Email addresses (array of objects)
    emails: [{ email: '', type: 'Work', is_primary: true }],
    
    // Phone numbers (array of objects)
    phones: [{ phone: '', type: 'Work', is_primary: true }],
    
    // Websites (array of objects)
    websites: [{ url: '', type: 'Work', is_primary: true }],
    
    // Addresses (array of objects)
    addresses: [{ 
      street: '', 
      city: '', 
      state: '', 
      zip: '', 
      country: 'USA', 
      type: 'Work' 
    }],
    
    // Tags
    tags: [],
    
    // Custom fields (array of objects)
    custom_fields: [],
    
    // Billing preferences
    payment_type: 'Default',
    hourly_rate: '',
    ledes_id: '',
    
    // Status
    status_id: '',
    
    // Notes
    notes: ''
  });

  // Form validation errors
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  // Load statuses on component mount
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        setStatusLoading(true);
        console.log('Fetching client statuses...');
        const data = await clientService.getClientStatuses();
        console.log('Fetched statuses:', data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          setStatuses(data);
          setUsesFallbackStatuses(false);
          
          // Set default status for new clients (Pending)
          if (mode === 'create') {
            const pendingStatus = data.find(status => status.name === 'Pending');
            if (pendingStatus) {
              console.log('Setting default pending status:', pendingStatus.id);
              setFormData(prev => ({
                ...prev,
                status_id: pendingStatus.id
              }));
            } else {
              // If no Pending status found, use the first status
              console.log('No Pending status found, using first status:', data[0].id);
              setFormData(prev => ({
                ...prev,
                status_id: data[0].id
              }));
            }
          }
        } else {
          console.error('No statuses returned from API or data format is incorrect. Using fallback statuses.');
          handleFallbackStatuses();
        }
      } catch (error) {
        console.error('Error fetching statuses:', error);
        handleFallbackStatuses();
      } finally {
        setStatusLoading(false);
      }
    };

    const handleFallbackStatuses = () => {
      console.log('Using fallback statuses');
      setStatuses(FALLBACK_STATUSES);
      setUsesFallbackStatuses(true);
      
      if (mode === 'create') {
        const pendingStatus = FALLBACK_STATUSES.find(status => status.name === 'Pending');
        if (pendingStatus) {
          console.log('Setting default pending status from fallback:', pendingStatus.id);
          setFormData(prev => ({
            ...prev,
            status_id: pendingStatus.id
          }));
        }
      }
    };

    fetchStatuses();
  }, [mode]);

  // Populate form with client data when editing
  useEffect(() => {
    if (client && mode === 'edit') {
      // Transform client data to match our new form structure
      const transformedData = {
        contact_type: client.client_type === 'Individual' ? 'Person' : 'Company',
        prefix: client.prefix || '',
        first_name: client.first_name || '',
        middle_name: client.middle_name || '',
        last_name: client.last_name || '',
        date_of_birth: client.date_of_birth ? new Date(client.date_of_birth) : null,
        company_name: client.organization_name || '',
        title: client.title || '',
        status_id: client.status_id || '',
        notes: client.notes || '',
        payment_type: client.payment_type || 'Default',
        hourly_rate: client.hourly_rate || '',
        ledes_id: client.ledes_id || '',
        tags: client.tags ? (Array.isArray(client.tags) ? client.tags : JSON.parse(client.tags)) : [],
        custom_fields: client.custom_fields ? (Array.isArray(client.custom_fields) ? client.custom_fields : JSON.parse(client.custom_fields)) : [],
        
        // Initialize arrays with defaults if empty
        emails: [],
        phones: [],
        websites: [],
        addresses: []
      };
      
      // Handle emails
      if (client.primary_email) {
        transformedData.emails.push({
          email: client.primary_email,
          type: 'Work',
          is_primary: true
        });
      }
      
      // Handle phones
      if (client.primary_phone) {
        transformedData.phones.push({
          phone: client.primary_phone,
          type: 'Work',
          is_primary: true
        });
      }
      
      // Handle contacts data if available
      if (client.contacts && Array.isArray(client.contacts)) {
        client.contacts.forEach(contact => {
          // Add email if available
          if (contact.email) {
            transformedData.emails.push({
              email: contact.email,
              type: 'Work',
              is_primary: contact.is_primary || false
            });
          }
          
          // Add phone if available
          if (contact.phone) {
            transformedData.phones.push({
              phone: contact.phone,
              type: 'Work',
              is_primary: contact.is_primary || false
            });
          }
          
          // Add addresses if available
          if (contact.addresses && Array.isArray(contact.addresses)) {
            contact.addresses.forEach(address => {
              transformedData.addresses.push({
                street: address.street || '',
                city: address.city || '',
                state: address.state || '',
                zip: address.zip || '',
                country: address.country || 'USA',
                type: address.address_type || 'Work'
              });
            });
          }
        });
      }
      
      // If no email entries, add an empty one
      if (transformedData.emails.length === 0) {
        transformedData.emails = [{ email: '', type: 'Work', is_primary: true }];
      }
      
      // If no phone entries, add an empty one
      if (transformedData.phones.length === 0) {
        transformedData.phones = [{ phone: '', type: 'Work', is_primary: true }];
      }
      
      // If no website entries, add an empty one
      if (transformedData.websites.length === 0) {
        transformedData.websites = [{ url: '', type: 'Work', is_primary: true }];
      }
      
      // If no address entries, add an empty one
      if (transformedData.addresses.length === 0) {
        transformedData.addresses = [{ 
          street: '', 
          city: '', 
          state: '', 
          zip: '', 
          country: 'USA', 
          type: 'Work' 
        }];
      }
      
      setFormData(transformedData);
      
      // Set profile photo if available
      if (client.profile_photo_url) {
        setPhotoPreview(client.profile_photo_url);
      }
    }
  }, [client, mode]);

  // Handle simple input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle contact type switch
    if (name === 'contact_type') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Clear company fields if switching to Person
        ...(value === 'Person' && {
          company_name: '',
          title: ''
        }),
        // Clear person fields if switching to Company
        ...(value === 'Company' && {
          prefix: '',
          first_name: '',
          middle_name: '',
          last_name: '',
          date_of_birth: null
        })
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear validation error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle profile photo upload
  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle date of birth change
  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      date_of_birth: date
    }));
  };
  
  // Handle array field changes (emails, phones, websites, addresses)
  const handleArrayItemChange = (type, index, field, value) => {
    setFormData(prev => {
      const items = [...prev[type]];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, [type]: items };
    });
  };
  
  // Handle adding a new item to an array field
  const handleAddArrayItem = (type, defaultItem) => {
    setFormData(prev => {
      // Make sure only one item is primary if adding a primary item
      let items = [...prev[type]];
      if (defaultItem.is_primary) {
        items = items.map(item => ({ ...item, is_primary: false }));
      }
      
      return {
        ...prev,
        [type]: [...items, defaultItem]
      };
    });
  };
  
  // Handle removing an item from an array field
  const handleRemoveArrayItem = (type, index) => {
    setFormData(prev => {
      const items = [...prev[type]];
      items.splice(index, 1);
      
      // Ensure at least one item is primary if we're removing a primary item
      if (items.length > 0 && prev[type][index].is_primary) {
        items[0].is_primary = true;
      }
      
      return { ...prev, [type]: items };
    });
  };
  
  // Handle setting an item as primary
  const handleSetPrimary = (type, index) => {
    setFormData(prev => {
      const items = prev[type].map((item, i) => ({
        ...item,
        is_primary: i === index
      }));
      
      return { ...prev, [type]: items };
    });
  };
  
  // Handle tags change
  const handleTagsChange = (event, newTags) => {
    setFormData(prev => ({
      ...prev,
      tags: newTags
    }));
  };
  
  // Handle custom field addition
  const handleAddCustomField = () => {
    setFormData(prev => ({
      ...prev,
      custom_fields: [
        ...prev.custom_fields,
        { name: '', value: '', type: 'text' }
      ]
    }));
  };
  
  // Handle custom field change
  const handleCustomFieldChange = (index, field, value) => {
    setFormData(prev => {
      const customFields = [...prev.custom_fields];
      customFields[index] = { ...customFields[index], [field]: value };
      return { ...prev, custom_fields: customFields };
    });
  };
  
  // Handle custom field removal
  const handleRemoveCustomField = (index) => {
    setFormData(prev => {
      const customFields = [...prev.custom_fields];
      customFields.splice(index, 1);
      return { ...prev, custom_fields: customFields };
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation for required fields
    if (formData.contact_type === 'Person') {
      if (!formData.first_name) {
        newErrors.first_name = 'First name is required';
      }
    } else {
      if (!formData.company_name) {
        newErrors.company_name = 'Company name is required';
      }
    }
    
    // Validate at least one email or phone is provided
    if (formData.emails.length === 0 || !formData.emails[0].email) {
      if (formData.phones.length === 0 || !formData.phones[0].phone) {
        newErrors.contact = 'At least one email or phone number is required';
      }
    }
    
    // Validate emails
    formData.emails.forEach((item, index) => {
      if (item.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) {
        newErrors[`email_${index}`] = 'Invalid email format';
      }
    });
    
    // Validate status
    if (!formData.status_id) {
      newErrors.status_id = 'Status is required';
    }
    
    // Validate hourly rate if provided
    if (formData.hourly_rate && isNaN(parseFloat(formData.hourly_rate))) {
      newErrors.hourly_rate = 'Hourly rate must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Prepare form data for API submission
  const prepareDataForSubmission = () => {
    // Get primary email and phone
    const primaryEmail = formData.emails.find(email => email.is_primary);
    const primaryPhone = formData.phones.find(phone => phone.is_primary);
    
    // Convert our form structure to match the API expectations
    const apiData = {
      client_type: formData.contact_type === 'Person' ? 'Individual' : 'Organization',
      prefix: formData.contact_type === 'Person' ? formData.prefix : null,
      first_name: formData.contact_type === 'Person' ? formData.first_name : null,
      middle_name: formData.contact_type === 'Person' ? formData.middle_name : null,
      last_name: formData.contact_type === 'Person' ? formData.last_name : null,
      date_of_birth: formData.date_of_birth ? formData.date_of_birth.toISOString().split('T')[0] : null,
      organization_name: formData.contact_type === 'Company' ? formData.company_name : null,
      title: formData.contact_type === 'Company' ? formData.title : null,
      primary_email: primaryEmail ? primaryEmail.email : null,
      primary_phone: primaryPhone ? primaryPhone.phone : null,
      status_id: formData.status_id,
      notes: formData.notes,
      payment_type: formData.payment_type,
      hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      ledes_id: formData.ledes_id,
      tags: JSON.stringify(formData.tags),
      custom_fields: JSON.stringify(formData.custom_fields),
      // Include additional contact data to be processed on the backend
      contacts_data: JSON.stringify({
        emails: formData.emails,
        phones: formData.phones,
        websites: formData.websites,
        addresses: formData.addresses
      })
    };
    
    return apiData;
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
      
      // Prepare data for submission
      const submissionData = prepareDataForSubmission();
      
      // If we're using fallback statuses, replace with "Pending" status
      if (usesFallbackStatuses) {
        // In a real app, we would handle this more robustly
        alert("Using temporary status values since the database connection isn't available. The client will be created with 'Pending' status once the connection is restored.");
      }
      
      // Check if email already exists for new clients or if changed in edit mode
      if (formData.emails.length > 0) {
        const primaryEmail = formData.emails.find(email => email.is_primary);
        if (primaryEmail && primaryEmail.email) {
          try {
            const emailExists = await clientService.checkEmailExists(
              primaryEmail.email,
              mode === 'edit' ? client.id : null
            );
            
            if (emailExists) {
              setErrors(prev => ({
                ...prev,
                [`email_${formData.emails.findIndex(e => e.is_primary)}`]: 'This email is already registered with another client'
              }));
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error('Error checking email:', error);
            // Continue anyway since we can't verify
          }
        }
      }
      
      // Handle profile photo upload if needed
      if (profilePhoto) {
        // In a real implementation, we'd upload the photo first and get a URL
        // For now, we'll assume this would happen here
        console.log('Profile photo would be uploaded here');
        
        // Add the photo URL to the submission data
        // submissionData.profile_photo_url = uploadedPhotoUrl;
      }
      
      // Call the parent component's onSubmit function
      await onSubmit(submissionData);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error.message || 'An error occurred while saving the client');
    } finally {
      setLoading(false);
    }
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

          {usesFallbackStatuses && (
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Using offline client status values.
              </Alert>
            </Grid>
          )}

          {/* Is this a person or company selector */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant={formData.contact_type === 'Person' ? 'contained' : 'outlined'}
                  onClick={() => setFormData({ ...formData, contact_type: 'Person' })}
                  startIcon={<Avatar sx={{ width: 24, height: 24, bgcolor: formData.contact_type === 'Person' ? 'primary.main' : 'grey.400' }}><PersonIcon fontSize="small" /></Avatar>}
                  sx={{ borderRadius: 1, px: 3 }}
                >
                  Person
                </Button>
                <Button
                  variant={formData.contact_type === 'Company' ? 'contained' : 'outlined'}
                  onClick={() => setFormData({ ...formData, contact_type: 'Company' })}
                  startIcon={<Avatar sx={{ width: 24, height: 24, bgcolor: formData.contact_type === 'Company' ? 'primary.main' : 'grey.400' }}><BusinessIcon fontSize="small" /></Avatar>}
                  sx={{ borderRadius: 1, px: 3 }}
                >
                  Company
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Personal Information or Company Information Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mb: 1 }}>
              {formData.contact_type === 'Person' ? 'Personal Information' : 'Company Information'}
            </Typography>
          </Grid>

          {/* Profile Photo - Smaller and moved inside personal information */}
          <Grid item xs={12} container spacing={2} alignItems="flex-start">
            <Grid item xs={12} sm={2}>
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Avatar
                  src={photoPreview}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    margin: '0 auto', 
                    mb: 1,
                    bgcolor: 'grey.300' 
                  }}
                />
                <Button
                  component="label"
                  size="small"
                  variant="outlined"
                  startIcon={<PhotoCameraIcon />}
                >
                  Upload Photo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} sm={10} container spacing={2}>
              {formData.contact_type === 'Person' ? (
                // Person Fields
                <>
                  <Grid item xs={12} sm={3}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="prefix-label">Prefix</InputLabel>
                      <Select
                        labelId="prefix-label"
                        name="prefix"
                        value={formData.prefix}
                        onChange={handleChange}
                        label="Prefix"
                      >
                        <MenuItem value="">None</MenuItem>
                        {NAME_PREFIXES.map(prefix => (
                          <MenuItem key={prefix} value={prefix}>{prefix}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="First Name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={!!errors.first_name}
                      helperText={errors.first_name}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Middle Name"
                      name="middle_name"
                      value={formData.middle_name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Last Name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Date of Birth"
                        value={formData.date_of_birth}
                        onChange={handleDateChange}
                        slotProps={{ 
                          textField: { 
                            fullWidth: true,
                            size: "small",
                            name: "date_of_birth"
                          }
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>
                </>
              ) : (
                // Company Fields
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Company Name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      error={!!errors.company_name}
                      helperText={errors.company_name}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Your Title/Position"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>

          {/* Email Addresses Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
              <EmailIcon sx={{ mr: 1, fontSize: 20 }} />
              Email Addresses
            </Typography>
          </Grid>

          {formData.emails.map((emailItem, index) => (
            <Grid item xs={12} key={`email-${index}`} container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Email Address"
                  value={emailItem.email}
                  onChange={(e) => handleArrayItemChange('emails', index, 'email', e.target.value)}
                  error={!!errors[`email_${index}`]}
                  helperText={errors[`email_${index}`]}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={9} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={emailItem.type}
                    onChange={(e) => handleArrayItemChange('emails', index, 'type', e.target.value)}
                    label="Type"
                  >
                    {EMAIL_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3} md={2}>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  disabled={formData.emails.length === 1}
                  onClick={() => handleRemoveArrayItem('emails', index)}
                  fullWidth
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddArrayItem('emails', { email: '', type: 'Work', is_primary: false })}
              variant="outlined"
              size="small"
            >
              Add Email Address
            </Button>
          </Grid>

          {/* Phone Numbers Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
              <PhoneIcon sx={{ mr: 1, fontSize: 20 }} />
              Phone Numbers
            </Typography>
          </Grid>

          {formData.phones.map((phoneItem, index) => (
            <Grid item xs={12} key={`phone-${index}`} container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number"
                  value={phoneItem.phone}
                  onChange={(e) => handleArrayItemChange('phones', index, 'phone', e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={9} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={phoneItem.type}
                    onChange={(e) => handleArrayItemChange('phones', index, 'type', e.target.value)}
                    label="Type"
                  >
                    {PHONE_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3} md={2}>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  disabled={formData.phones.length === 1}
                  onClick={() => handleRemoveArrayItem('phones', index)}
                  fullWidth
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddArrayItem('phones', { phone: '', type: 'Work', is_primary: false })}
              variant="outlined"
              size="small"
            >
              Add Phone Number
            </Button>
          </Grid>

          {/* Websites Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
              <LanguageIcon sx={{ mr: 1, fontSize: 20 }} />
              Websites
            </Typography>
          </Grid>

          {formData.websites.map((websiteItem, index) => (
            <Grid item xs={12} key={`website-${index}`} container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Website URL"
                  value={websiteItem.url}
                  onChange={(e) => handleArrayItemChange('websites', index, 'url', e.target.value)}
                  error={!!errors[`website_${index}`]}
                  helperText={errors[`website_${index}`]}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={9} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={websiteItem.type}
                    onChange={(e) => handleArrayItemChange('websites', index, 'type', e.target.value)}
                    label="Type"
                  >
                    {WEBSITE_TYPES.map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3} md={2}>
                <Button
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => handleRemoveArrayItem('websites', index)}
                  disabled={formData.websites.length <= 1}
                  fullWidth
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddArrayItem('websites', { url: '', type: 'Work', is_primary: false })}
              variant="outlined"
              size="small"
            >
              Add Website
            </Button>
          </Grid>

          {/* Addresses Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
              <LocationIcon sx={{ mr: 1, fontSize: 20 }} />
              Addresses
            </Typography>
          </Grid>

          {formData.addresses.map((addressItem, index) => (
            <Grid item xs={12} key={`address-${index}`}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader
                  title={`${addressItem.type} Address`}
                  action={
                    <Button 
                      color="error" 
                      variant="outlined"
                      size="small"
                      onClick={() => handleRemoveArrayItem('addresses', index)}
                      disabled={formData.addresses.length <= 1}
                      sx={{ mr: 1 }}
                    >
                      Remove
                    </Button>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                          value={addressItem.type}
                          onChange={(e) => handleArrayItemChange('addresses', index, 'type', e.target.value)}
                          label="Type"
                        >
                          {ADDRESS_TYPES.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Street Address"
                        value={addressItem.street}
                        onChange={(e) => handleArrayItemChange('addresses', index, 'street', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="City"
                        value={addressItem.city}
                        onChange={(e) => handleArrayItemChange('addresses', index, 'city', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="State/Province"
                        value={addressItem.state}
                        onChange={(e) => handleArrayItemChange('addresses', index, 'state', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Zip/Postal Code"
                        value={addressItem.zip}
                        onChange={(e) => handleArrayItemChange('addresses', index, 'zip', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label="Country"
                        value={addressItem.country}
                        onChange={(e) => handleArrayItemChange('addresses', index, 'country', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddArrayItem('addresses', { 
                street: '', 
                city: '', 
                state: '', 
                zip: '', 
                country: 'USA', 
                type: 'Work' 
              })}
              variant="outlined"
              size="small"
            >
              Add New Address
            </Button>
          </Grid>

          {/* Tags Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
              Tags
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.tags}
              onChange={handleTagsChange}
              size="small"
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  size="small"
                  placeholder="Add tags (e.g., VIP, Corporate, Pro Bono)"
                  helperText="Press Enter to add a tag"
                />
              )}
            />
          </Grid>

          {/* Custom Fields Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
              Custom Fields
            </Typography>
          </Grid>

          {formData.custom_fields.map((field, index) => (
            <Grid item xs={12} key={`custom-${index}`} container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Field Name"
                  value={field.name}
                  onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                  placeholder="e.g., Preferred Language"
                />
              </Grid>
              <Grid item xs={8} md={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Field Value"
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                />
              </Grid>
              <Grid item xs={4} md={3}>
                <Button
                  fullWidth
                  color="error"
                  variant="outlined"
                  size="small"
                  onClick={() => handleRemoveCustomField(index)}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddCustomField}
              variant="outlined"
              size="small"
            >
              Add Custom Field
            </Button>
          </Grid>

          {/* Billing Preferences Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
              Billing Preferences
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Payment Type</InputLabel>
              <Select
                name="payment_type"
                value={formData.payment_type}
                onChange={handleChange}
                label="Payment Type"
              >
                <MenuItem value="Default">Default</MenuItem>
                <MenuItem value="Discount">Discount</MenuItem>
                <MenuItem value="Pro Bono">Pro Bono</MenuItem>
                <MenuItem value="Flat Fee">Flat Fee</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Hourly Rate"
              name="hourly_rate"
              value={formData.hourly_rate}
              onChange={handleChange}
              error={!!errors.hourly_rate}
              helperText={errors.hourly_rate}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="LEDES Client ID"
              name="ledes_id"
              value={formData.ledes_id}
              onChange={handleChange}
            />
          </Grid>

          {/* Status Selection */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
              Status
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small" error={!!errors.status_id}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                name="status_id"
                value={formData.status_id}
                onChange={handleChange}
                label="Status"
                required
                disabled={statusLoading}
              >
                {statusLoading ? (
                  <MenuItem value="" disabled>
                    Loading statuses...
                  </MenuItem>
                ) : (
                  statuses.length > 0 ? 
                  statuses.map((status) => (
                    <MenuItem key={status.id} value={status.id}>
                      {status.name}
                    </MenuItem>
                  )) : 
                  <MenuItem value="" disabled>
                    No statuses available
                  </MenuItem>
                )}
              </Select>
              {errors.status_id && <FormHelperText>{errors.status_id}</FormHelperText>}
            </FormControl>
          </Grid>

          {/* Notes */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="medium" sx={{ mt: 2, mb: 1 }}>
              Notes
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              label="Notes"
              name="notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/clients')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || statusLoading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {mode === 'create' ? 'Create Contact' : 'Update Contact'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

ClientForm.propTypes = {
  client: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['create', 'edit'])
};

export default ClientForm; 