import React, { useState } from 'react';
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
  FormControlLabel,
  Checkbox,
  Box,
  Typography
} from '@mui/material';

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

const EditCaseAssociationDialog = ({ 
  open, 
  onClose, 
  onSubmit, 
  clientName, 
  caseData, 
  associationData, 
  loading 
}) => {
  const [formData, setFormData] = useState({
    role: associationData.role || 'plaintiff',
    is_primary: associationData.is_primary || false,
    notes: associationData.notes || ''
  });
  const [validationErrors, setValidationErrors] = useState({});

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
      associationId: associationData.id,
      associationData: {
        role: formData.role,
        is_primary: formData.is_primary,
        notes: formData.notes
      }
    });
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      role: associationData.role || 'plaintiff',
      is_primary: associationData.is_primary || false,
      notes: associationData.notes || ''
    });
    setValidationErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Case Association</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Client: {clientName}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Case: {caseData?.case_number} - {caseData?.title || 'Untitled Case'}
          </Typography>
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
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCaseAssociationDialog; 