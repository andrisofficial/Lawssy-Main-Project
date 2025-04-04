import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  ContentCopy as DuplicateIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Sample data for demo purposes
const sampleTimeEntries = [
  {
    id: 1,
    date: new Date('2023-03-01'),
    client: 'Acme Corporation',
    matter: 'Corporate Restructuring',
    description: 'Reviewed contract documents and prepared draft agreements',
    timeSpent: 2.5, // hours
    hourlyRate: 250,
    billableType: 'billable',
    status: 'unbilled',
  },
  {
    id: 2,
    date: new Date('2023-03-02'),
    client: 'Acme Corporation',
    matter: 'Corporate Restructuring',
    description: 'Conference call with client regarding restructuring options',
    timeSpent: 1.0,
    hourlyRate: 250,
    billableType: 'billable',
    status: 'unbilled',
  },
  {
    id: 3,
    date: new Date('2023-03-03'),
    client: 'Wayne Enterprises',
    matter: 'Merger Review',
    description: 'Drafted merger agreement and reviewed regulatory requirements',
    timeSpent: 3.5,
    hourlyRate: 275,
    billableType: 'billable',
    status: 'unbilled',
  },
  {
    id: 4,
    date: new Date('2023-03-03'),
    client: 'Stark Industries',
    matter: 'Intellectual Property',
    description: 'Patent application review and filing preparation',
    timeSpent: 2.0,
    hourlyRate: 300,
    billableType: 'billable',
    status: 'unbilled',
  },
];

const sampleInvoiceTemplates = [
  { id: 1, name: 'Standard Template', description: 'Default professional invoice template' },
  { id: 2, name: 'Detailed Timesheet', description: 'Includes detailed breakdown of all time entries' },
  { id: 3, name: 'Summary Invoice', description: 'Simplified invoice with matter summaries only' },
  { id: 4, name: 'Corporate Style', description: 'Formal template for corporate clients' },
];

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

const InvoiceGenerator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [timeEntries, setTimeEntries] = useState(sampleTimeEntries);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTimeEntries, setSelectedTimeEntries] = useState([]);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(sampleInvoiceTemplates[0]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    notes: '',
    terms: 'Payment due within 30 days. Please make checks payable to Your Law Firm.',
    taxRate: 0,
    discountAmount: 0,
    discountType: 'percentage', // or 'fixed'
  });
  const [previewMode, setPreviewMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const steps = [
    'Select Client & Matter',
    'Select Time Entries & Expenses',
    'Review & Finalize'
  ];

  // Get unique clients from time entries
  const clients = [...new Set(timeEntries.map(entry => entry.client))];

  // Filter time entries by selected client
  const filteredTimeEntries = selectedClient
    ? timeEntries.filter(entry => entry.client === selectedClient && entry.status === 'unbilled')
    : timeEntries.filter(entry => entry.status === 'unbilled');

  useEffect(() => {
    // Generate next invoice number
    const nextInvoiceNumber = `INV-${new Date().getFullYear()}-${(Math.floor(Math.random() * 900) + 100)}`;
    setInvoiceDetails(prev => ({
      ...prev,
      invoiceNumber: nextInvoiceNumber,
    }));
  }, []);

  const handleSelectTimeEntry = (entryId) => {
    if (selectedTimeEntries.includes(entryId)) {
      setSelectedTimeEntries(selectedTimeEntries.filter(id => id !== entryId));
    } else {
      setSelectedTimeEntries([...selectedTimeEntries, entryId]);
    }
  };

  const handleSelectAllTimeEntries = () => {
    if (selectedTimeEntries.length === filteredTimeEntries.length) {
      setSelectedTimeEntries([]);
    } else {
      setSelectedTimeEntries(filteredTimeEntries.map(entry => entry.id));
    }
  };

  const handleCreateInvoice = () => {
    if (selectedTimeEntries.length === 0) return;
    setInvoiceDialogOpen(true);
  };

  const calculateSubtotal = () => {
    const entriesForInvoice = timeEntries.filter(entry => selectedTimeEntries.includes(entry.id));
    return entriesForInvoice.reduce((sum, entry) => sum + (entry.timeSpent * entry.hourlyRate), 0);
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    if (invoiceDetails.discountType === 'percentage') {
      return subtotal * (invoiceDetails.discountAmount / 100);
    } else {
      return invoiceDetails.discountAmount;
    }
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return (subtotal - discount) * (invoiceDetails.taxRate / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = calculateTax();
    return subtotal - discount + tax;
  };

  const handleSaveInvoice = () => {
    // In a real app, this would save the invoice to a database
    setSuccessMessage('Invoice created successfully!');
    setTimeout(() => {
      setSuccessMessage('');
      setInvoiceDialogOpen(false);
    }, 2000);
  };

  const handleTogglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Generate New Invoice</Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>
        {activeStep === steps.length ? (
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - Invoice has been created!
            </Typography>
            <Button onClick={handleReset}>Create Another Invoice</Button>
          </Box>
        ) : (
          <Box>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}: {steps[activeStep]}</Typography>
            
            <Paper sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider' }}>
              {activeStep === 0 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                      Unbilled Time Entries
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Autocomplete
                        options={clients}
                        value={selectedClient}
                        onChange={(event, newValue) => {
                          setSelectedClient(newValue);
                          setSelectedTimeEntries([]);
                        }}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Filter by Client" 
                            size="small"
                            sx={{ width: 250 }}
                          />
                        )}
                        sx={{ minWidth: 200 }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreateInvoice}
                        disabled={selectedTimeEntries.length === 0}
                      >
                        Generate Invoice
                      </Button>
                    </Stack>
                  </Box>
                  
                  <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell padding="checkbox">
                            <Tooltip title="Select All">
                              <IconButton 
                                size="small" 
                                onClick={handleSelectAllTimeEntries}
                              >
                                {selectedTimeEntries.length === filteredTimeEntries.length && filteredTimeEntries.length > 0 ? 
                                  '✓' : '□'}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Client</TableCell>
                          <TableCell>Matter</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Hours</TableCell>
                          <TableCell align="right">Rate</TableCell>
                          <TableCell align="right">Amount</TableCell>
                          <TableCell>Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filteredTimeEntries.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={9} align="center">
                              <Typography variant="body2" color="text.secondary">
                                No unbilled time entries found.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTimeEntries.map((entry) => (
                            <TableRow 
                              key={entry.id}
                              hover
                              selected={selectedTimeEntries.includes(entry.id)}
                              onClick={() => handleSelectTimeEntry(entry.id)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell padding="checkbox">
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectTimeEntry(entry.id);
                                  }}
                                >
                                  {selectedTimeEntries.includes(entry.id) ? '✓' : '□'}
                                </IconButton>
                              </TableCell>
                              <TableCell>{formatDate(entry.date)}</TableCell>
                              <TableCell>{entry.client}</TableCell>
                              <TableCell>{entry.matter}</TableCell>
                              <TableCell>{entry.description}</TableCell>
                              <TableCell align="right">{entry.timeSpent.toFixed(1)}</TableCell>
                              <TableCell align="right">${entry.hourlyRate.toFixed(2)}</TableCell>
                              <TableCell align="right">${(entry.timeSpent * entry.hourlyRate).toFixed(2)}</TableCell>
                              <TableCell>
                                <Chip 
                                  label={entry.billableType} 
                                  size="small"
                                  color={entry.billableType === 'billable' ? 'success' : 'default'}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
              
              {activeStep === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="600">
                      Select Time Entries & Expenses
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Invoice Number"
                        value={invoiceDetails.invoiceNumber}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, invoiceNumber: e.target.value})}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Client"
                        value={timeEntries.find(entry => selectedTimeEntries.includes(entry.id))?.client || ''}
                        fullWidth
                        disabled
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Issue Date"
                        type="date"
                        value={invoiceDetails.issueDate}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, issueDate: e.target.value})}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Due Date"
                        type="date"
                        value={invoiceDetails.dueDate}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, dueDate: e.target.value})}
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1" gutterBottom>Invoice Template</Typography>
                      <FormControl fullWidth>
                        <InputLabel id="template-select-label">Select Template</InputLabel>
                        <Select
                          labelId="template-select-label"
                          value={selectedTemplate.id}
                          label="Select Template"
                          onChange={(e) => {
                            const template = sampleInvoiceTemplates.find(t => t.id === e.target.value);
                            setSelectedTemplate(template);
                          }}
                        >
                          {sampleInvoiceTemplates.map((template) => (
                            <MenuItem key={template.id} value={template.id}>
                              {template.name} - {template.description}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1" gutterBottom>Additional Charges & Discounts</Typography>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Tax Rate (%)"
                        type="number"
                        value={invoiceDetails.taxRate}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, taxRate: parseFloat(e.target.value) || 0})}
                        fullWidth
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="discount-type-label">Discount Type</InputLabel>
                        <Select
                          labelId="discount-type-label"
                          value={invoiceDetails.discountType}
                          label="Discount Type"
                          onChange={(e) => setInvoiceDetails({...invoiceDetails, discountType: e.target.value})}
                        >
                          <MenuItem value="percentage">Percentage (%)</MenuItem>
                          <MenuItem value="fixed">Fixed Amount ($)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label={invoiceDetails.discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount ($)'}
                        type="number"
                        value={invoiceDetails.discountAmount}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, discountAmount: parseFloat(e.target.value) || 0})}
                        fullWidth
                        InputProps={{ 
                          inputProps: { 
                            min: 0, 
                            max: invoiceDetails.discountType === 'percentage' ? 100 : undefined 
                          } 
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Terms & Conditions"
                        multiline
                        rows={2}
                        value={invoiceDetails.terms}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, terms: e.target.value})}
                        fullWidth
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Notes"
                        multiline
                        rows={3}
                        value={invoiceDetails.notes}
                        onChange={(e) => setInvoiceDetails({...invoiceDetails, notes: e.target.value})}
                        fullWidth
                        placeholder="Enter any additional notes for this invoice..."
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Selected Time Entries
                      </Typography>
                      <TableContainer component={Paper} sx={{ maxHeight: 200, overflow: 'auto' }}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Date</TableCell>
                              <TableCell>Matter</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell align="right">Hours</TableCell>
                              <TableCell align="right">Rate</TableCell>
                              <TableCell align="right">Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {timeEntries
                              .filter(entry => selectedTimeEntries.includes(entry.id))
                              .map((entry) => (
                                <TableRow key={entry.id}>
                                  <TableCell>{formatDate(entry.date)}</TableCell>
                                  <TableCell>{entry.matter}</TableCell>
                                  <TableCell>{entry.description}</TableCell>
                                  <TableCell align="right">{entry.timeSpent.toFixed(1)}</TableCell>
                                  <TableCell align="right">${entry.hourlyRate.toFixed(2)}</TableCell>
                                  <TableCell align="right">${(entry.timeSpent * entry.hourlyRate).toFixed(2)}</TableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                          <TableHead>
                            <TableRow>
                              <TableCell colSpan={5} align="right">
                                <Typography variant="subtitle2" fontWeight="600">
                                  Subtotal:
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="subtitle2" fontWeight="600">
                                  ${calculateSubtotal().toFixed(2)}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Box>
              )}
              
              {activeStep === 2 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Box>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>INVOICE</Typography>
                      <Typography variant="body2">Your Law Firm, LLC</Typography>
                      <Typography variant="body2">123 Legal Street</Typography>
                      <Typography variant="body2">New York, NY 10001</Typography>
                      <Typography variant="body2">contact@yourlawfirm.com</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="h6" fontWeight="bold">{invoiceDetails.invoiceNumber}</Typography>
                      <Typography variant="body2">Issue Date: {formatDate(invoiceDetails.issueDate)}</Typography>
                      <Typography variant="body2">Due Date: {formatDate(invoiceDetails.dueDate)}</Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Bill To:</Typography>
                    <Typography variant="body1">
                      {timeEntries.find(entry => selectedTimeEntries.includes(entry.id))?.client}
                    </Typography>
                  </Box>
                  
                  <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                          <TableCell>Date</TableCell>
                          <TableCell>Matter</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Hours</TableCell>
                          <TableCell align="right">Rate</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {timeEntries
                          .filter(entry => selectedTimeEntries.includes(entry.id))
                          .map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>{formatDate(entry.date)}</TableCell>
                              <TableCell>{entry.matter}</TableCell>
                              <TableCell>{entry.description}</TableCell>
                              <TableCell align="right">{entry.timeSpent.toFixed(1)}</TableCell>
                              <TableCell align="right">${entry.hourlyRate.toFixed(2)}</TableCell>
                              <TableCell align="right">${(entry.timeSpent * entry.hourlyRate).toFixed(2)}</TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <Grid container spacing={1} sx={{ maxWidth: 300 }}>
                      <Grid item xs={6}>
                        <Typography variant="body2">Subtotal:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2">${calculateSubtotal().toFixed(2)}</Typography>
                      </Grid>
                      
                      {invoiceDetails.discountAmount > 0 && (
                        <>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              Discount {invoiceDetails.discountType === 'percentage' ? `(${invoiceDetails.discountAmount}%)` : ''}:
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">-${calculateDiscount().toFixed(2)}</Typography>
                          </Grid>
                        </>
                      )}
                      
                      {invoiceDetails.taxRate > 0 && (
                        <>
                          <Grid item xs={6}>
                            <Typography variant="body2">Tax ({invoiceDetails.taxRate}%):</Typography>
                          </Grid>
                          <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body2">${calculateTax().toFixed(2)}</Typography>
                          </Grid>
                        </>
                      )}
                      
                      <Grid item xs={6}>
                        <Typography variant="subtitle1" fontWeight="bold">Total:</Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ textAlign: 'right' }}>
                        <Typography variant="subtitle1" fontWeight="bold">${calculateTotal().toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  {invoiceDetails.terms && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="subtitle2" gutterBottom>Terms & Conditions</Typography>
                      <Typography variant="body2">{invoiceDetails.terms}</Typography>
                    </Box>
                  )}
                  
                  {invoiceDetails.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>Notes</Typography>
                      <Typography variant="body2">{invoiceDetails.notes}</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Paper>
            
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InvoiceGenerator; 