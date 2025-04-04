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
  FormHelperText,
  CircularProgress,
  Autocomplete,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Alert
} from '@mui/material';
import caseService from '../../services/caseService/caseService';

const CLIENT_ROLES = [
  { value: 'plaintiff', label: 'Plaintiff' },
  { value: 'defendant', label: 'Defendant' },
  { value: 'petitioner', label: 'Petitioner' },
  { value: 'respondent', label: 'Respondent' },
  { value: 'appellant', label: 'Appellant' },
  { value: 'appellee', label: 'Appellee' },
  { value: 'witness', label: 'Witness' },
  { value: 'expert', label: 'Expert Witness' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'interested_party', label: 'Interested Party' },
  { value: 'other', label: 'Other' }
];

const LinkCaseDialog = ({ open, onClose, onSubmit, clientId, clientName }) => {
  const [availableCases, setAvailableCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCase, setSelectedCase] = useState(null);
  const [formData, setFormData] = useState({
    role: 'plaintiff',
    is_primary: true,
    notes: ''
  });
  const [inputValue, setInputValue] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Load available cases when dialog opens
  useEffect(() => {
    if (open) {
      loadAvailableCases();
    }
  }, [open]);

  const loadAvailableCases = async () => {
    setLoading(true);
    setError('');
    try {
      // Get all cases except archived ones
      const cases = await caseService.getAllCases({}, false);
      
      // Filter out cases that might already be associated with this client
      // This could be enhanced to filter at the API level
      setAvailableCases(cases);
    } catch (err) {
      console.error('Error loading cases:', err);
      setError('Failed to load available cases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!selectedCase) {
      errors.case = 'Please select a case';
    }
    
    if (!formData.role) {
      errors.role = 'Please select a role';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    onSubmit({
      caseId: selectedCase.id,
      associationData: {
        role: formData.role,
        is_primary: formData.is_primary,
        notes: formData.notes
      }
    });
  };

  const handleCancel = () => {
    // Reset form
    setSelectedCase(null);
    setFormData({
      role: 'plaintiff',
      is_primary: true,
      notes: ''
    });
    setInputValue('');
    setValidationErrors({});
    onClose();
  };

  const getCaseOptionLabel = (option) => {
    if (!option) return '';
    return `${option.case_number} - ${option.title || 'Untitled Case'}`;
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Link Case to {clientName}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Autocomplete
            fullWidth
            options={availableCases}
            loading={loading}
            value={selectedCase}
            onChange={(event, newValue) => {
              setSelectedCase(newValue);
              if (validationErrors.case) {
                setValidationErrors({
                  ...validationErrors,
                  case: ''
                });
              }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            getOptionLabel={getCaseOptionLabel}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Case"
                variant="outlined"
                error={!!validationErrors.case}
                helperText={validationErrors.case}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography variant="body1">
                    {option.case_number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {option.title || 'Untitled Case'}
                  </Typography>
                </Box>
              </li>
            )}
          />
        </Box>
        
        <FormControl 
          fullWidth 
          margin="normal" 
          error={!!validationErrors.role}
        >
          <InputLabel id="client-role-label">Client Role</InputLabel>
          <Select
            labelId="client-role-label"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            label="Client Role"
          >
            {CLIENT_ROLES.map(role => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
          {validationErrors.role && (
            <FormHelperText>{validationErrors.role}</FormHelperText>
          )}
        </FormControl>
        
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.is_primary}
              onChange={handleInputChange}
              name="is_primary"
            />
          }
          label="Primary Client for this Case"
          sx={{ mt: 2, display: 'block' }}
        />
        
        <TextField
          fullWidth
          margin="normal"
          id="notes"
          name="notes"
          label="Association Notes"
          multiline
          rows={3}
          value={formData.notes}
          onChange={handleInputChange}
          placeholder="Enter any notes about the client's role in this case"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Link Case'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkCaseDialog; 