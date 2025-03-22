import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Autocomplete,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ContentCopy as DuplicateIcon
} from '@mui/icons-material';

// Sample data for demo purposes
const sampleClients = [
  { id: 1, name: 'Acme Corporation' },
  { id: 2, name: 'Wayne Enterprises' },
  { id: 3, name: 'Stark Industries' },
  { id: 4, name: 'LexCorp' },
  { id: 5, name: 'Umbrella Corporation' },
];

const sampleMatters = [
  { id: 1, name: 'Corporate Restructuring', clientId: 1, caseNumber: 'ACM-2023-001' },
  { id: 2, name: 'Patent Infringement', clientId: 1, caseNumber: 'ACM-2023-002' },
  { id: 3, name: 'Merger Review', clientId: 2, caseNumber: 'WE-2023-001' },
  { id: 4, name: 'Intellectual Property', clientId: 3, caseNumber: 'SI-2023-001' },
  { id: 5, name: 'Contract Dispute', clientId: 4, caseNumber: 'LC-2023-001' },
  { id: 6, name: 'Regulatory Compliance', clientId: 5, caseNumber: 'UC-2023-001' },
];

const samplePracticeAreas = [
  { id: 1, name: 'Contract Review' },
  { id: 2, name: 'Litigation' },
  { id: 3, name: 'Corporate Law' },
  { id: 4, name: 'Intellectual Property' },
  { id: 5, name: 'Real Estate' }
];

const sampleActivityTypes = [
  { id: 1, name: 'Research' },
  { id: 2, name: 'Client Call' },
  { id: 3, name: 'Document Drafting' },
  { id: 4, name: 'Court Appearance' },
  { id: 5, name: 'Meeting' }
];

// Sample billing rates
const sampleBillingRates = [
  { 
    id: 1, 
    name: 'Standard Hourly Rate', 
    type: 'hourly', 
    rate: 250, 
    clientId: null, 
    matterId: null, 
    practiceAreaId: null, 
    activityTypeId: null,
    isDefault: true,
    description: 'Default hourly rate for all clients and matters'
  },
  { 
    id: 2, 
    name: 'Acme Corporation Rate', 
    type: 'hourly', 
    rate: 275, 
    clientId: 1, 
    matterId: null, 
    practiceAreaId: null, 
    activityTypeId: null,
    isDefault: false,
    description: 'Special rate for Acme Corporation'
  },
  { 
    id: 3, 
    name: 'Litigation Rate', 
    type: 'hourly', 
    rate: 300, 
    clientId: null, 
    matterId: null, 
    practiceAreaId: 2, 
    activityTypeId: null,
    isDefault: false,
    description: 'Rate for all litigation matters'
  },
  { 
    id: 4, 
    name: 'Court Appearance', 
    type: 'hourly', 
    rate: 350, 
    clientId: null, 
    matterId: null, 
    practiceAreaId: null, 
    activityTypeId: 4,
    isDefault: false,
    description: 'Rate for court appearances'
  },
  { 
    id: 5, 
    name: 'Patent Filing Package', 
    type: 'flat', 
    rate: 5000, 
    clientId: null, 
    matterId: null, 
    practiceAreaId: 4, 
    activityTypeId: null,
    isDefault: false,
    description: 'Flat fee for patent filing services'
  },
  { 
    id: 6, 
    name: 'Contract Review Package', 
    type: 'flat', 
    rate: 1500, 
    clientId: null, 
    matterId: null, 
    practiceAreaId: 1, 
    activityTypeId: null,
    isDefault: false,
    description: 'Flat fee for standard contract review'
  }
];

const BillingRateManager = () => {
  const [billingRates, setBillingRates] = useState(sampleBillingRates);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRate, setCurrentRate] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Filter billing rates based on selected filter
  const filteredRates = filterType === 'all' 
    ? billingRates 
    : billingRates.filter(rate => rate.type === filterType);

  const handleOpenDialog = (rate = null) => {
    if (rate) {
      setCurrentRate({ ...rate });
      setEditMode(true);
    } else {
      setCurrentRate({ 
        name: '', 
        type: 'hourly', 
        rate: 0, 
        clientId: null, 
        matterId: null, 
        practiceAreaId: null, 
        activityTypeId: null,
        isDefault: false,
        description: ''
      });
      setEditMode(false);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentRate(null);
  };

  const handleSaveRate = () => {
    if (editMode) {
      // Update existing rate
      setBillingRates(billingRates.map(rate => 
        rate.id === currentRate.id ? currentRate : rate
      ));
      setSnackbarMessage('Billing rate updated successfully');
    } else {
      // Add new rate
      const newRate = {
        ...currentRate,
        id: Math.max(...billingRates.map(r => r.id)) + 1
      };
      setBillingRates([...billingRates, newRate]);
      setSnackbarMessage('New billing rate added successfully');
    }
    setSnackbarOpen(true);
    handleCloseDialog();
  };

  const handleDeleteRate = (id) => {
    setBillingRates(billingRates.filter(rate => rate.id !== id));
    setSnackbarMessage('Billing rate deleted successfully');
    setSnackbarOpen(true);
  };

  const handleDuplicateRate = (rate) => {
    const newRate = {
      ...rate,
      id: Math.max(...billingRates.map(r => r.id)) + 1,
      name: `Copy of ${rate.name}`,
      isDefault: false
    };
    setBillingRates([...billingRates, newRate]);
    setSnackbarMessage('Billing rate duplicated successfully');
    setSnackbarOpen(true);
  };

  const handleInputChange = (field, value) => {
    setCurrentRate({
      ...currentRate,
      [field]: value
    });
  };

  const getClientName = (clientId) => {
    if (!clientId) return 'All Clients';
    const client = sampleClients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };

  const getMatterName = (matterId) => {
    if (!matterId) return 'All Matters';
    const matter = sampleMatters.find(m => m.id === matterId);
    return matter ? matter.name : 'Unknown Matter';
  };

  const getPracticeAreaName = (practiceAreaId) => {
    if (!practiceAreaId) return 'All Practice Areas';
    const area = samplePracticeAreas.find(a => a.id === practiceAreaId);
    return area ? area.name : 'Unknown Practice Area';
  };

  const getActivityTypeName = (activityTypeId) => {
    if (!activityTypeId) return 'All Activities';
    const activity = sampleActivityTypes.find(a => a.id === activityTypeId);
    return activity ? activity.name : 'Unknown Activity';
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="600">
              Billing Rate Management
            </Typography>
            <Box>
              <FormControl sx={{ minWidth: 150, mr: 2 }}>
                <InputLabel id="filter-type-label">Filter By Type</InputLabel>
                <Select
                  labelId="filter-type-label"
                  value={filterType}
                  label="Filter By Type"
                  size="small"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Rates</MenuItem>
                  <MenuItem value="hourly">Hourly Rates</MenuItem>
                  <MenuItem value="flat">Flat Fees</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add New Rate
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Matter/Practice Area</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body2" color="text.secondary">
                        No billing rates found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRates.map((rate) => (
                    <TableRow key={rate.id} hover>
                      <TableCell>
                        {rate.name}
                        {rate.isDefault && (
                          <Chip 
                            label="Default" 
                            size="small" 
                            color="primary" 
                            sx={{ ml: 1 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={rate.type === 'hourly' ? 'Hourly Rate' : 'Flat Fee'} 
                          size="small"
                          color={rate.type === 'hourly' ? 'info' : 'success'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {rate.type === 'hourly' 
                          ? `$${rate.rate.toFixed(2)}/hr` 
                          : `$${rate.rate.toFixed(2)}`
                        }
                      </TableCell>
                      <TableCell>{getClientName(rate.clientId)}</TableCell>
                      <TableCell>
                        {rate.matterId 
                          ? getMatterName(rate.matterId)
                          : rate.practiceAreaId 
                            ? getPracticeAreaName(rate.practiceAreaId)
                            : rate.activityTypeId
                              ? getActivityTypeName(rate.activityTypeId)
                              : 'All'
                        }
                      </TableCell>
                      <TableCell>{rate.description}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Edit">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleOpenDialog(rate)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Duplicate">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleDuplicateRate(rate)}
                            >
                              <DuplicateIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteRate(rate.id)}
                              disabled={rate.isDefault}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Rate Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editMode ? 'Edit Billing Rate' : 'Add New Billing Rate'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Rate Name"
                value={currentRate?.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="rate-type-label">Rate Type</InputLabel>
                <Select
                  labelId="rate-type-label"
                  value={currentRate?.type || 'hourly'}
                  label="Rate Type"
                  onChange={(e) => handleInputChange('type', e.target.value)}
                >
                  <MenuItem value="hourly">Hourly Rate</MenuItem>
                  <MenuItem value="flat">Flat Fee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={currentRate?.type === 'hourly' ? 'Hourly Rate ($)' : 'Flat Fee Amount ($)'}
                type="number"
                value={currentRate?.rate || 0}
                onChange={(e) => handleInputChange('rate', parseFloat(e.target.value) || 0)}
                fullWidth
                required
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={currentRate?.isDefault || false}
                    onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                    disabled={editMode && !currentRate?.isDefault}
                  />
                }
                label="Set as Default Rate"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle1" gutterBottom>
                Rate Application
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Specify where this rate should apply. Leave fields empty to apply to all.
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={sampleClients}
                getOptionLabel={(option) => option.name}
                value={currentRate?.clientId ? sampleClients.find(c => c.id === currentRate.clientId) : null}
                onChange={(event, newValue) => handleInputChange('clientId', newValue?.id || null)}
                renderInput={(params) => (
                  <TextField {...params} label="Apply to Client" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={sampleMatters.filter(m => !currentRate?.clientId || m.clientId === currentRate.clientId)}
                getOptionLabel={(option) => option.name}
                value={currentRate?.matterId ? sampleMatters.find(m => m.id === currentRate.matterId) : null}
                onChange={(event, newValue) => handleInputChange('matterId', newValue?.id || null)}
                disabled={!currentRate?.clientId}
                renderInput={(params) => (
                  <TextField {...params} label="Apply to Matter" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={samplePracticeAreas}
                getOptionLabel={(option) => option.name}
                value={currentRate?.practiceAreaId ? samplePracticeAreas.find(a => a.id === currentRate.practiceAreaId) : null}
                onChange={(event, newValue) => handleInputChange('practiceAreaId', newValue?.id || null)}
                disabled={!!currentRate?.matterId}
                renderInput={(params) => (
                  <TextField {...params} label="Apply to Practice Area" fullWidth />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={sampleActivityTypes}
                getOptionLabel={(option) => option.name}
                value={currentRate?.activityTypeId ? sampleActivityTypes.find(a => a.id === currentRate.activityTypeId) : null}
                onChange={(event, newValue) => handleInputChange('activityTypeId', newValue?.id || null)}
                disabled={!!currentRate?.matterId || !!currentRate?.practiceAreaId}
                renderInput={(params) => (
                  <TextField {...params} label="Apply to Activity Type" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Description"
                multiline
                rows={2}
                value={currentRate?.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                fullWidth
                placeholder="Enter a description for this billing rate..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveRate} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            disabled={!currentRate?.name || !currentRate?.rate}
          >
            {editMode ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BillingRateManager; 