import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Autocomplete,
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
} from '@mui/material';
import {
  Add as AddIcon,
  Print as PrintIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
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

const sampleInvoices = [
  {
    id: 'INV-2023-001',
    client: 'Acme Corporation',
    date: new Date('2023-02-28'),
    dueDate: new Date('2023-03-30'),
    amount: 1875.00,
    status: 'paid',
  },
  {
    id: 'INV-2023-002',
    client: 'Wayne Enterprises',
    date: new Date('2023-02-15'),
    dueDate: new Date('2023-03-17'),
    amount: 2450.00,
    status: 'overdue',
  },
  {
    id: 'INV-2023-003',
    client: 'Stark Industries',
    date: new Date('2023-03-01'),
    dueDate: new Date('2023-04-01'),
    amount: 3200.00,
    status: 'pending',
  },
];

const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

const Billing = () => {
  const [timeEntries, setTimeEntries] = useState(sampleTimeEntries);
  const [invoices, setInvoices] = useState(sampleInvoices);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTimeEntries, setSelectedTimeEntries] = useState([]);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [viewInvoiceDialogOpen, setViewInvoiceDialogOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: '',
    issueDate: formatDate(new Date()),
    dueDate: formatDate(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
    notes: '',
  });

  // Get unique clients from time entries
  const clients = [...new Set(timeEntries.map(entry => entry.client))];

  // Filter time entries by selected client
  const filteredTimeEntries = selectedClient
    ? timeEntries.filter(entry => entry.client === selectedClient && entry.status === 'unbilled')
    : timeEntries.filter(entry => entry.status === 'unbilled');

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
    
    // Calculate next invoice number
    const nextInvoiceNumber = `INV-${new Date().getFullYear()}-${(invoices.length + 1).toString().padStart(3, '0')}`;
    setInvoiceDetails({
      ...invoiceDetails,
      invoiceNumber: nextInvoiceNumber,
    });
    setInvoiceDialogOpen(true);
  };

  const handleSaveInvoice = () => {
    const entriesForInvoice = timeEntries.filter(entry => selectedTimeEntries.includes(entry.id));
    const totalAmount = entriesForInvoice.reduce((sum, entry) => sum + (entry.timeSpent * entry.hourlyRate), 0);
    const clientName = entriesForInvoice[0].client;
    
    const newInvoice = {
      id: invoiceDetails.invoiceNumber,
      client: clientName,
      date: new Date(invoiceDetails.issueDate),
      dueDate: new Date(invoiceDetails.dueDate),
      amount: totalAmount,
      status: 'pending',
      notes: invoiceDetails.notes,
      timeEntries: entriesForInvoice.map(entry => ({ ...entry, status: 'billed' })),
    };
    
    // Update invoices list
    setInvoices([...invoices, newInvoice]);
    
    // Update time entries status
    setTimeEntries(
      timeEntries.map(entry => 
        selectedTimeEntries.includes(entry.id) 
          ? { ...entry, status: 'billed' } 
          : entry
      )
    );
    
    setSelectedTimeEntries([]);
    setInvoiceDialogOpen(false);
  };

  const handleViewInvoice = (invoice) => {
    setCurrentInvoice(invoice);
    setViewInvoiceDialogOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'info';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Unbilled Time Entries Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
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
                    Create Invoice
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
            </CardContent>
          </Card>
        </Grid>
        
        {/* Invoices Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                Invoices
              </Typography>
              
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Invoice #</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Issue Date</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No invoices found.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      invoices.map((invoice) => (
                        <TableRow key={invoice.id} hover>
                          <TableCell>{invoice.id}</TableCell>
                          <TableCell>{invoice.client}</TableCell>
                          <TableCell>{formatDate(invoice.date)}</TableCell>
                          <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                          <TableCell align="right">${invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={invoice.status} 
                              color={getStatusColor(invoice.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} justifyContent="center">
                              <Tooltip title="View Invoice">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleViewInvoice(invoice)}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download PDF">
                                <IconButton size="small" color="primary">
                                  <PdfIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Email Invoice">
                                <IconButton size="small" color="primary">
                                  <EmailIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Create Invoice Dialog */}
      <Dialog 
        open={invoiceDialogOpen} 
        onClose={() => setInvoiceDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Invoice</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Invoice Number"
                value={invoiceDetails.invoiceNumber}
                onChange={(e) => setInvoiceDetails({...invoiceDetails, invoiceNumber: e.target.value})}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Client"
                value={filteredTimeEntries.find(entry => selectedTimeEntries.includes(entry.id))?.client || ''}
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
              <TextField
                label="Notes / Terms"
                multiline
                rows={3}
                value={invoiceDetails.notes}
                onChange={(e) => setInvoiceDetails({...invoiceDetails, notes: e.target.value})}
                fullWidth
                placeholder="Enter any additional notes or terms for this invoice..."
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
                    {filteredTimeEntries
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
                          Total:
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle2" fontWeight="600">
                          ${filteredTimeEntries
                            .filter(entry => selectedTimeEntries.includes(entry.id))
                            .reduce((sum, entry) => sum + (entry.timeSpent * entry.hourlyRate), 0)
                            .toFixed(2)
                          }
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInvoiceDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveInvoice} 
            variant="contained" 
            color="primary"
          >
            Create Invoice
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* View Invoice Dialog */}
      <Dialog 
        open={viewInvoiceDialogOpen} 
        onClose={() => setViewInvoiceDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {currentInvoice && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Invoice: {currentInvoice.id}</Typography>
                <Chip 
                  label={currentInvoice.status} 
                  color={getStatusColor(currentInvoice.status)}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Client</Typography>
                  <Typography variant="body1">{currentInvoice.client}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Amount</Typography>
                  <Typography variant="body1" fontWeight="600">${currentInvoice.amount.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Issue Date</Typography>
                  <Typography variant="body1">{formatDate(currentInvoice.date)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Due Date</Typography>
                  <Typography variant="body1">{formatDate(currentInvoice.dueDate)}</Typography>
                </Grid>
                
                {/* We would display the time entries here if available */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>Invoice Items</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    (Detailed invoice items would be shown here)
                  </Typography>
                </Grid>
                
                {currentInvoice.notes && (
                  <Grid item xs={12} sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Notes / Terms</Typography>
                    <Typography variant="body2">{currentInvoice.notes}</Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewInvoiceDialogOpen(false)}>Close</Button>
              <Button startIcon={<PrintIcon />}>Print</Button>
              <Button startIcon={<PdfIcon />} variant="contained">Download PDF</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Billing; 