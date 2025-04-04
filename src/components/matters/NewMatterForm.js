import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Autocomplete,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const NewMatterForm = ({ open, onClose }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    matterName: '',
    matterNumber: '',
    practiceArea: '',
    status: 'Active',
    openDate: new Date(),
    description: '',
    client: null,
    responsibleAttorney: '',
    assignedStaff: [],
    billingType: 'Hourly',
    billingRate: '',
    retainerAmount: '',
    courtJurisdiction: '',
    statuteOfLimitations: null
  });

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

  const staffMembers = [
    'John Smith',
    'Patricia Garcia',
    'Robert Lee',
    'Jennifer Wong',
    'Kevin O\'Brien',
    'Maria Rodriguez',
    'Brian Miller'
  ];

  // Steps for the wizard
  const steps = [
    'Basic Information',
    'Client Information',
    'Team Assignment',
    'Billing Information',
    'Additional Details'
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

  const handleStaffChange = (event, newValue) => {
    setFormData({
      ...formData,
      assignedStaff: newValue
    });
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    // Here you would submit the form data to your backend
    console.log('Form submitted with data:', formData);
    onClose();
  };

  // Step content components
  const BasicInformationStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Basic Matter Information
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Matter Name"
          name="matterName"
          value={formData.matterName}
          onChange={handleChange}
          fullWidth
          required
          placeholder="e.g., Johnson v. Smith"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Matter Number"
          name="matterNumber"
          value={formData.matterNumber}
          onChange={handleChange}
          fullWidth
          placeholder="e.g., LIT-2023-001 (Auto-generated if left blank)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                #
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Practice Area"
          name="practiceArea"
          value={formData.practiceArea}
          onChange={handleChange}
          fullWidth
          required
        >
          {practiceAreas.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          required
        >
          {statuses.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Open Date"
            value={formData.openDate}
            onChange={(newValue) => handleDateChange('openDate', newValue)}
            renderInput={(params) => <TextField {...params} fullWidth required />}
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
        />
      </Grid>
    </Grid>
  );

  const ClientInformationStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Client Information
        </Typography>
      </Grid>
      <Grid item xs={12}>
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
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider textAlign="center" sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Button 
          variant="outlined" 
          fullWidth
          sx={{ 
            py: 1.5, 
            borderColor: '#E5E7EB',
            color: 'text.primary',
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: 'rgba(0, 105, 209, 0.04)'
            }
          }}
        >
          Create New Client
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
          Selected Client Information
        </Typography>
        {formData.client ? (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 105, 209, 0.04)', borderRadius: '8px' }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {formData.client.name}
            </Typography>
            <Typography variant="body2">
              {formData.client.email}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No client selected. Please select an existing client or create a new one.
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(236, 253, 245, 1)', borderRadius: '8px', display: 'flex', alignItems: 'flex-start' }}>
          <CheckCircleIcon sx={{ color: '#10B981', mr: 1, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="#10B981">
              Conflict Check Passed
            </Typography>
            <Typography variant="body2">
              No conflicts found with this client.
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );

  const TeamAssignmentStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Team Assignment
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          select
          label="Responsible Attorney"
          name="responsibleAttorney"
          value={formData.responsibleAttorney}
          onChange={handleChange}
          fullWidth
          required
        >
          {attorneys.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          multiple
          options={staffMembers}
          value={formData.assignedStaff}
          onChange={handleStaffChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Assigned Staff"
              placeholder="Select team members"
            />
          )}
        />
      </Grid>
    </Grid>
  );

  const BillingInformationStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Billing Information
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Billing Type</FormLabel>
          <RadioGroup
            row
            name="billingType"
            value={formData.billingType}
            onChange={handleChange}
          >
            {billingTypes.map((option) => (
              <FormControlLabel 
                key={option} 
                value={option} 
                control={<Radio />} 
                label={option} 
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Default Billing Rate"
          name="billingRate"
          value={formData.billingRate}
          onChange={handleChange}
          fullWidth
          type="number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                $
              </InputAdornment>
            ),
            endAdornment: formData.billingType === 'Hourly' ? (
              <InputAdornment position="end">
                /hour
              </InputAdornment>
            ) : null,
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Retainer Amount"
          name="retainerAmount"
          value={formData.retainerAmount}
          onChange={handleChange}
          fullWidth
          type="number"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                $
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );

  const AdditionalDetailsStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Additional Details
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Court/Jurisdiction"
          name="courtJurisdiction"
          value={formData.courtJurisdiction}
          onChange={handleChange}
          fullWidth
          placeholder="e.g., Southern District of New York"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Statute of Limitations"
            value={formData.statuteOfLimitations}
            onChange={(newValue) => handleDateChange('statuteOfLimitations', newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(239, 246, 255, 1)', borderRadius: '8px', display: 'flex', alignItems: 'flex-start' }}>
          <InfoIcon sx={{ color: theme.palette.primary.main, mr: 1, mt: 0.5 }} />
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color={theme.palette.primary.main}>
              Initial Setup Complete
            </Typography>
            <Typography variant="body2">
              After creating this matter, you'll be able to add tasks, documents, and notes.
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );

  // Determine which step to render
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <BasicInformationStep />;
      case 1:
        return <ClientInformationStep />;
      case 2:
        return <TeamAssignmentStep />;
      case 3:
        return <BillingInformationStep />;
      case 4:
        return <AdditionalDetailsStep />;
      default:
        return 'Unknown step';
    }
  };

  // Step icons
  const getStepIcon = (step) => {
    switch (step) {
      case 0:
        return <BusinessCenterIcon />;
      case 1:
        return <PersonIcon />;
      case 2:
        return <GroupIcon />;
      case 3:
        return <PaymentIcon />;
      case 4:
        return <DescriptionIcon />;
      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: '8px',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Create New Matter
          </Typography>
          <IconButton 
            aria-label="close" 
            onClick={onClose}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconComponent={() => (
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: index === activeStep 
                          ? theme.palette.primary.main 
                          : index < activeStep 
                            ? '#10B981' 
                            : '#F3F4F6',
                        color: index <= activeStep ? 'white' : '#64748B'
                      }}
                    >
                      {index < activeStep 
                        ? <CheckCircleIcon /> 
                        : getStepIcon(index)
                      }
                    </Box>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box sx={{ mt: 2 }}>
          {getStepContent(activeStep)}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: '#E5E7EB',
            color: 'text.primary',
            borderRadius: '8px',
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
        <Box sx={{ flex: '1 1 auto' }} />
        <Button 
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
          sx={{ 
            borderColor: '#E5E7EB',
            color: 'text.primary',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            mr: 1,
            '&:hover': {
              borderColor: theme.palette.primary.main,
              backgroundColor: 'rgba(0, 105, 209, 0.04)'
            }
          }}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Create Matter
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            variant="contained"
            sx={{ 
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewMatterForm; 