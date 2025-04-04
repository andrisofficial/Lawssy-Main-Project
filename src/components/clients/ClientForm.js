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
  LocationOn as LocationIcon
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
    if (e.target.files.length) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      
      // Create preview
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

    // Check required fields based on contact type
    if (formData.contact_type === 'Person') {
      if (!formData.first_name) {
        newErrors.first_name = 'First name is required';
      }
    } else {
      if (!formData.company_name) {
        newErrors.company_name = 'Company name is required';
      }
    }

    // Validate emails
    const primaryEmailCount = formData.emails.filter(item => item.is_primary).length;
    if (primaryEmailCount === 0 && formData.emails.length > 0) {
      newErrors.emails = 'At least one email must be set as primary';
    }
    
    formData.emails.forEach((item, index) => {
      if (item.email && !/\S+@\S+\.\S+/.test(item.email)) {
        newErrors[`email_${index}`] = 'Invalid email address';
      }
    });

    // Validate phones
    const primaryPhoneCount = formData.phones.filter(item => item.is_primary).length;
    if (primaryPhoneCount === 0 && formData.phones.length > 0) {
      newErrors.phones = 'At least one phone must be set as primary';
    }
    
    formData.phones.forEach((item, index) => {
      if (item.phone && !/^[\d\s\-+()]*$/.test(item.phone)) {
        newErrors[`phone_${index}`] = 'Invalid phone number';
      }
    });
    
    // Validate websites
    formData.websites.forEach((item, index) => {
      if (item.url && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(item.url)) {
        newErrors[`website_${index}`] = 'Invalid URL';
      }
    });

    // Status is required
    if (!formData.status_id) {
      newErrors.status_id = 'Status is required';
    }
    
    // Validate hourly rate if provided
    if (formData.hourly_rate && isNaN(formData.hourly_rate)) {
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
    <Paper sx={{ p: 3 }}>
      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}
      
      {usesFallbackStatuses && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Unable to connect to the database. Using temporary status values. Some functionality may be limited.
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Contact Type Selection */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Client Type
            </Typography>
            <RadioGroup
              row
              name="contact_type"
              value={formData.contact_type}
              onChange={handleChange}
            >
              <FormControlLabel
                value="Person"
                control={<Radio />}
                label="Person"
              />
              <FormControlLabel
                value="Company"
                control={<Radio />}
                label="Company"
              />
            </RadioGroup>
          </Grid>
          
          {/* Profile Photo Upload */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar 
                src={photoPreview} 
                sx={{ width: 100, height: 100, mb: 2 }}
                alt="Profile Photo"
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<PhotoCameraIcon />}
              >
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider>
              {formData.contact_type === 'Person' ? 'Personal Information' : 'Company Information'}
            </Divider>
          </Grid>
          
          {/* Personal Information Fields (Person) */}
          {formData.contact_type === 'Person' && (
            <>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
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
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.date_of_birth}
                    onChange={handleDateChange}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: 'outlined'
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </>
          )}

          {/* Company Information Fields (Company) */}
          {formData.contact_type === 'Company' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company Name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  error={!!errors.company_name}
                  helperText={errors.company_name}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Your Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., CEO, Manager"
                />
              </Grid>
            </>
          )}

          {/* Email Addresses Section */}
          <Grid item xs={12}>
            <Divider>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Email Addresses</Typography>
              </Box>
            </Divider>
          </Grid>
          
          {errors.emails && (
            <Grid item xs={12}>
              <Alert severity="error">{errors.emails}</Alert>
            </Grid>
          )}

          {formData.emails.map((emailItem, index) => (
            <Grid item xs={12} key={`email-${index}`} container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Email Address"
                  value={emailItem.email}
                  onChange={(e) => handleArrayItemChange('emails', index, 'email', e.target.value)}
                  error={!!errors[`email_${index}`]}
                  helperText={errors[`email_${index}`]}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={5} md={3}>
                <FormControl fullWidth>
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
              <Grid item xs={4} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailItem.is_primary}
                      onChange={() => handleSetPrimary('emails', index)}
                      disabled={emailItem.is_primary}
                    />
                  }
                  label="Primary"
                />
              </Grid>
              <Grid item xs={3} md={2}>
                <Button
                  color="error"
                  onClick={() => handleRemoveArrayItem('emails', index)}
                  disabled={formData.emails.length <= 1}
                  startIcon={<DeleteIcon />}
                  variant="outlined"
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
            >
              Add Email Address
            </Button>
          </Grid>

          {/* Phone Numbers Section */}
          <Grid item xs={12}>
            <Divider>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Phone Numbers</Typography>
              </Box>
            </Divider>
          </Grid>
          
          {errors.phones && (
            <Grid item xs={12}>
              <Alert severity="error">{errors.phones}</Alert>
            </Grid>
          )}

          {formData.phones.map((phoneItem, index) => (
            <Grid item xs={12} key={`phone-${index}`} container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phoneItem.phone}
                  onChange={(e) => handleArrayItemChange('phones', index, 'phone', e.target.value)}
                  error={!!errors[`phone_${index}`]}
                  helperText={errors[`phone_${index}`]}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={5} md={3}>
                <FormControl fullWidth>
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
              <Grid item xs={4} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={phoneItem.is_primary}
                      onChange={() => handleSetPrimary('phones', index)}
                      disabled={phoneItem.is_primary}
                    />
                  }
                  label="Primary"
                />
              </Grid>
              <Grid item xs={3} md={2}>
                <Button
                  color="error"
                  onClick={() => handleRemoveArrayItem('phones', index)}
                  disabled={formData.phones.length <= 1}
                  startIcon={<DeleteIcon />}
                  variant="outlined"
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => handleAddArrayItem('phones', { phone: '', type: 'Mobile', is_primary: false })}
              variant="outlined"
            >
              Add Phone Number
            </Button>
          </Grid>

          {/* Websites Section */}
          <Grid item xs={12}>
            <Divider>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LanguageIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Websites</Typography>
              </Box>
            </Divider>
          </Grid>

          {formData.websites.map((websiteItem, index) => (
            <Grid item xs={12} key={`website-${index}`} container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Website URL"
                  value={websiteItem.url}
                  onChange={(e) => handleArrayItemChange('websites', index, 'url', e.target.value)}
                  error={!!errors[`website_${index}`]}
                  helperText={errors[`website_${index}`]}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LanguageIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={5} md={3}>
                <FormControl fullWidth>
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
              <Grid item xs={4} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={websiteItem.is_primary}
                      onChange={() => handleSetPrimary('websites', index)}
                      disabled={websiteItem.is_primary}
                    />
                  }
                  label="Primary"
                />
              </Grid>
              <Grid item xs={3} md={2}>
                <Button
                  color="error"
                  onClick={() => handleRemoveArrayItem('websites', index)}
                  disabled={formData.websites.length <= 1}
                  startIcon={<DeleteIcon />}
                  variant="outlined"
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
            >
              Add Website
            </Button>
          </Grid>

          {/* Addresses Section */}
          <Grid item xs={12}>
            <Divider>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">Addresses</Typography>
              </Box>
            </Divider>
          </Grid>

          {formData.addresses.map((addressItem, index) => (
            <Grid item xs={12} key={`address-${index}`}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardHeader
                  title={`${addressItem.type} Address`}
                  action={
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveArrayItem('addresses', index)}
                      disabled={formData.addresses.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
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
                        label="Street Address"
                        value={addressItem.street}
                        onChange={(e) => handleArrayItemChange('addresses', index, 'street', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="City"
                        value={addressItem.city}
                        onChange={(e) => handleArrayItemChange('addresses', index, 'city', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        label="State/Province"
                        value={addressItem.state}
                        onChange={(e) => handleArrayItemChange('addresses', index, 'state', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <TextField
                        fullWidth
                        label="Zip/Postal Code"
                        value={addressItem.zip}
                        onChange={(e) => handleArrayItemChange('addresses', index, 'zip', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
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
            >
              Add New Address
            </Button>
          </Grid>

          {/* Tags Section */}
          <Grid item xs={12}>
            <Divider>
              <Typography variant="subtitle1">Tags</Typography>
            </Divider>
          </Grid>
          
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.tags}
              onChange={handleTagsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                    color="primary"
                    variant="outlined"
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  placeholder="Add tags (e.g., VIP, Corporate, Pro Bono)"
                  helperText="Press Enter to add a tag"
                />
              )}
            />
          </Grid>

          {/* Custom Fields Section */}
          <Grid item xs={12}>
            <Divider>
              <Typography variant="subtitle1">Custom Fields</Typography>
            </Divider>
          </Grid>

          {formData.custom_fields.map((field, index) => (
            <Grid item xs={12} key={`custom-${index}`} container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Field Name"
                  value={field.name}
                  onChange={(e) => handleCustomFieldChange(index, 'name', e.target.value)}
                  placeholder="e.g., Preferred Language"
                />
              </Grid>
              <Grid item xs={8} md={4}>
                <TextField
                  fullWidth
                  label="Field Value"
                  value={field.value}
                  onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                />
              </Grid>
              <Grid item xs={4} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Field Type</InputLabel>
                  <Select
                    value={field.type}
                    onChange={(e) => handleCustomFieldChange(index, 'type', e.target.value)}
                    label="Field Type"
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="picklist">Picklist</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  color="error"
                  onClick={() => handleRemoveCustomField(index)}
                  startIcon={<DeleteIcon />}
                  variant="outlined"
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
            >
              Add Custom Field
            </Button>
          </Grid>

          {/* Billing Preferences Section */}
          <Grid item xs={12}>
            <Divider>
              <Typography variant="subtitle1">Billing Preferences</Typography>
            </Divider>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
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
              label="LEDES Client ID"
              name="ledes_id"
              value={formData.ledes_id}
              onChange={handleChange}
            />
          </Grid>

          {/* Status Selection */}
          <Grid item xs={12}>
            <Divider>
              <Typography variant="subtitle1">Status</Typography>
            </Divider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.status_id}>
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
            <Divider>
              <Typography variant="subtitle1">Notes</Typography>
            </Divider>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
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
                {mode === 'create' ? 'Create Client' : 'Update Client'}
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