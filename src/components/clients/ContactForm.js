import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Grid,
  TextField,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  CircularProgress,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const ADDRESS_TYPES = [
  { value: 'Home', label: 'Home' },
  { value: 'Work', label: 'Work' },
  { value: 'Mailing', label: 'Mailing' },
  { value: 'Other', label: 'Other' }
];

const EMPTY_ADDRESS = {
  address_type: 'Work',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: 'USA'
};

const ContactForm = ({ 
  contact = null, 
  onSubmit, 
  onCancel, 
  isPrimary = false,
  isBilling = false,
  mode = 'create'
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    role: '',
    email: '',
    phone: '',
    is_primary: isPrimary,
    is_billing: isBilling,
    notes: '',
    addresses: [{ ...EMPTY_ADDRESS }]
  });

  // Form validation errors
  const [errors, setErrors] = useState({});

  // Populate form with contact data when editing
  useEffect(() => {
    if (contact && mode === 'edit') {
      // Ensure addresses is an array
      const addresses = Array.isArray(contact.addresses) && contact.addresses.length > 0
        ? contact.addresses
        : [{ ...EMPTY_ADDRESS }];

      setFormData({
        first_name: contact.first_name || '',
        last_name: contact.last_name || '',
        role: contact.role || '',
        email: contact.email || '',
        phone: contact.phone || '',
        is_primary: contact.is_primary || isPrimary,
        is_billing: contact.is_billing || isBilling,
        notes: contact.notes || '',
        addresses
      });
    }
  }, [contact, mode, isPrimary, isBilling]);

  // Handle input changes for contact info
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox fields
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // Handle regular inputs
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

  // Handle address changes
  const handleAddressChange = (index, field, value) => {
    setFormData(prev => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [field]: value
      };
      
      return {
        ...prev,
        addresses: updatedAddresses
      };
    });

    // Clear validation error
    if (errors[`addresses[${index}].${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`addresses[${index}].${field}`]: ''
      }));
    }
  };

  // Add new address
  const handleAddAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { ...EMPTY_ADDRESS }]
    }));
  };

  // Remove address
  const handleRemoveAddress = (index) => {
    setFormData(prev => {
      const updatedAddresses = [...prev.addresses];
      updatedAddresses.splice(index, 1);
      
      // Ensure at least one address
      if (updatedAddresses.length === 0) {
        updatedAddresses.push({ ...EMPTY_ADDRESS });
      }
      
      return {
        ...prev,
        addresses: updatedAddresses
      };
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // First name is required
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    // Validate email if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Validate phone if provided
    if (formData.phone && !/^[\d\s\-+()]*$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    // Validate addresses
    formData.addresses.forEach((address, index) => {
      if (address.address_type === '') {
        newErrors[`addresses[${index}].address_type`] = 'Address type is required';
      }
      
      if (address.street.trim() !== '' || address.city.trim() !== '' || address.state.trim() !== '' || address.zip.trim() !== '') {
        if (address.street.trim() === '') {
          newErrors[`addresses[${index}].street`] = 'Street is required when other address fields are filled';
        }
        if (address.city.trim() === '') {
          newErrors[`addresses[${index}].city`] = 'City is required when other address fields are filled';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      
      // Clean empty addresses
      const cleanedData = {
        ...formData,
        addresses: formData.addresses.filter(addr => 
          addr.street.trim() !== '' || 
          addr.city.trim() !== '' || 
          addr.state.trim() !== '' || 
          addr.zip.trim() !== ''
        )
      };

      // If all addresses are empty, provide empty array
      if (cleanedData.addresses.length === 0) {
        cleanedData.addresses = [];
      }
      
      // Call the parent component's onSubmit function
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError(error.message || 'An error occurred while saving the contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Contact Basic Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Role / Relationship"
              name="role"
              placeholder="e.g., CEO, Legal Representative, Spouse"
              value={formData.role}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_primary}
                    onChange={handleChange}
                    name="is_primary"
                  />
                }
                label="Primary Contact"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_billing}
                    onChange={handleChange}
                    name="is_billing"
                  />
                }
                label="Billing Contact"
              />
            </Box>
          </Grid>

          {/* Addresses Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Addresses
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {/* Address Forms */}
          {formData.addresses.map((address, index) => (
            <Grid item xs={12} key={index}>
              <Paper variant="outlined" sx={{ p: 2, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  {formData.addresses.length > 1 && (
                    <IconButton 
                      size="small" 
                      onClick={() => handleRemoveAddress(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      select
                      fullWidth
                      label="Address Type"
                      value={address.address_type}
                      onChange={(e) => handleAddressChange(index, 'address_type', e.target.value)}
                      error={!!errors[`addresses[${index}].address_type`]}
                      helperText={errors[`addresses[${index}].address_type`]}
                      required
                    >
                      {ADDRESS_TYPES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={address.street}
                      onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                      error={!!errors[`addresses[${index}].street`]}
                      helperText={errors[`addresses[${index}].street`]}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="City"
                      value={address.city}
                      onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      error={!!errors[`addresses[${index}].city`]}
                      helperText={errors[`addresses[${index}].city`]}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3} md={4}>
                    <TextField
                      fullWidth
                      label="State / Province"
                      value={address.state}
                      onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={6} sm={3} md={4}>
                    <TextField
                      fullWidth
                      label="ZIP / Postal Code"
                      value={address.zip}
                      onChange={(e) => handleAddressChange(index, 'zip', e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={address.country}
                      onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                      placeholder="USA"
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button 
              startIcon={<AddIcon />} 
              onClick={handleAddAddress}
              variant="outlined"
              size="small"
            >
              Add Another Address
            </Button>
          </Grid>

          {/* Notes */}
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
                startIcon={<CloseIcon />}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {mode === 'create' ? 'Add Contact' : 'Update Contact'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

ContactForm.propTypes = {
  contact: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isPrimary: PropTypes.bool,
  isBilling: PropTypes.bool,
  mode: PropTypes.oneOf(['create', 'edit'])
};

export default ContactForm; 