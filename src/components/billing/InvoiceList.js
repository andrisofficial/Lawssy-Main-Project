import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  FileDownload as DownloadIcon,
  Email as EmailIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  ReceiptLong as ReceiptLongIcon,
  AttachMoney as MoneyIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewInvoiceOpen, setViewInvoiceOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [agingReport, setAgingReport] = useState(null);

  // Fetch invoices and aging report
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/invoices');
        if (!response.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const data = await response.json();
        setInvoices(data);
        
        // Fetch aging report
        const agingResponse = await fetch('/api/invoices/aging-report');
        if (agingResponse.ok) {
          const agingData = await agingResponse.json();
          setAgingReport(agingData);
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, []);

  const handleOpenInvoiceView = (invoice) => {
    setSelectedInvoice(invoice);
    setViewInvoiceOpen(true);
  };

  const handleCloseInvoiceView = () => {
    setViewInvoiceOpen(false);
  };

  const handleOpenPaymentDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handleDeleteInvoice = async (invoice) => {
    if (invoice.status !== 'Draft') {
      alert('Only draft invoices can be deleted');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber}?`)) {
      try {
        const response = await fetch(`/api/invoices/${invoice.id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete invoice');
        }
        
        // Update invoices list
        setInvoices(invoices.filter(inv => inv.id !== invoice.id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (invoice.clientId && invoice.clientId.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    let matchesDate = true;
    if (dateRange.startDate && dateRange.endDate) {
      const invoiceDate = new Date(invoice.invoiceDate);
      matchesDate = 
        invoiceDate >= dateRange.startDate &&
        invoiceDate <= dateRange.endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft':
        return 'default';
      case 'Sent':
        return 'primary';
      case 'Partial Payment':
        return 'warning';
      case 'Paid':
        return 'success';
      case 'Overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'primary.light',
              bgcolor: 'primary.lighter'
            }}
          >
            <Typography variant="h6" color="primary.main">
              Total Outstanding
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {agingReport ? 
                formatCurrency(
                  agingReport.current + 
                  agingReport['1-30'] + 
                  agingReport['31-60'] + 
                  agingReport['61-90'] + 
                  agingReport['90+']
                ) : 
                '$0.00'
              }
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'warning.light',
              bgcolor: 'warning.lighter'
            }}
          >
            <Typography variant="h6" color="warning.main">
              30-90 Days
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {agingReport ? 
                formatCurrency(
                  agingReport['1-30'] + 
                  agingReport['31-60'] + 
                  agingReport['61-90']
                ) : 
                '$0.00'
              }
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'error.light',
              bgcolor: 'error.lighter'
            }}
          >
            <Typography variant="h6" color="error">
              90+ Days
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {agingReport ? 
                formatCurrency(agingReport['90+']) : 
                '$0.00'
              }
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'success.light',
              bgcolor: 'success.lighter'
            }}
          >
            <Typography variant="h6" color="success.main">
              Draft Invoices
            </Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {invoices.filter(inv => inv.status === 'Draft').length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Filter Controls */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search Invoices"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Draft">Draft</MenuItem>
              <MenuItem value="Sent">Sent</MenuItem>
              <MenuItem value="Partial Payment">Partial Payment</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </TextField>
          </Grid>
          
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid item xs={12} md={2}>
              <DatePicker
                label="Start Date"
                value={dateRange.startDate}
                onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                slotProps={{
                  textField: { 
                    size: 'small',
                    fullWidth: true
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <DatePicker
                label="End Date"
                value={dateRange.endDate}
                onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true
                  }
                }}
              />
            </Grid>
          </LocalizationProvider>
          
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ReceiptLongIcon />}
              fullWidth
              onClick={() => window.location.href = '#/billing?tab=1'}
            >
              Create New Invoice
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      {/* Invoices Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'grey.50' }}>
              <TableRow>
                <TableCell>Invoice #</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Balance Due</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.clientId}</TableCell>
                    <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>{formatCurrency(invoice.totalAmount)}</TableCell>
                    <TableCell>{formatCurrency(invoice.balanceDue)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={invoice.status} 
                        color={getStatusColor(invoice.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Invoice">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenInvoiceView(invoice)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Download PDF">
                          <IconButton size="small">
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Email to Client">
                          <IconButton size="small">
                            <EmailIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Record Payment">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenPaymentDialog(invoice)}
                            disabled={invoice.status === 'Draft' || invoice.status === 'Paid'}
                          >
                            <MoneyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small"
                            onClick={() => handleDeleteInvoice(invoice)}
                            disabled={invoice.status !== 'Draft'}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* View Invoice Dialog */}
      <Dialog
        open={viewInvoiceOpen}
        onClose={handleCloseInvoiceView}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Invoice Details</Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
            >
              Download PDF
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Invoice #{selectedInvoice.invoiceNumber}
                </Typography>
                <Chip 
                  label={selectedInvoice.status} 
                  color={getStatusColor(selectedInvoice.status)}
                  size="small"
                />
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Client
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvoice.clientId}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Matter IDs
                  </Typography>
                  <Typography variant="body1">
                    {selectedInvoice.matterIds ? selectedInvoice.matterIds.join(', ') : 'N/A'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Invoice Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedInvoice.invoiceDate)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    Due Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedInvoice.dueDate)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                Summary
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography>Total Amount:</Typography>
                <Typography>{formatCurrency(selectedInvoice.totalAmount)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography>Balance Due:</Typography>
                <Typography fontWeight={600}>{formatCurrency(selectedInvoice.balanceDue)}</Typography>
              </Box>
              
              {selectedInvoice.notes && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    Notes
                  </Typography>
                  <Typography variant="body2">
                    {selectedInvoice.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvoiceView}>
            Close
          </Button>
          {selectedInvoice && selectedInvoice.status !== 'Draft' && selectedInvoice.status !== 'Paid' && (
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<MoneyIcon />}
              onClick={() => {
                handleCloseInvoiceView();
                handleOpenPaymentDialog(selectedInvoice);
              }}
            >
              Record Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent dividers>
          {selectedInvoice && (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Recording payment for Invoice #{selectedInvoice.invoiceNumber}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography>Balance Due:</Typography>
                <Typography fontWeight={600}>{formatCurrency(selectedInvoice.balanceDue)}</Typography>
              </Box>
              
              <form>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  // Default to balance due amount
                  defaultValue={selectedInvoice.balanceDue}
                />
                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Payment Date"
                    defaultValue={new Date()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: { mb: 2 }
                      }
                    }}
                  />
                </LocalizationProvider>
                
                <TextField
                  select
                  fullWidth
                  label="Payment Method"
                  defaultValue="credit_card"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="ach">ACH Transfer</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                  <MenuItem value="wire">Wire Transfer</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="trust">Trust Account</MenuItem>
                </TextField>
                
                <TextField
                  fullWidth
                  label="Reference Number"
                  placeholder="Check #, Transaction ID, etc."
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  select
                  fullWidth
                  label="Deposit Account"
                  defaultValue="operating"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="operating">Operating Account</MenuItem>
                  <MenuItem value="trust">Trust Account</MenuItem>
                </TextField>
                
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                />
              </form>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleClosePaymentDialog}
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InvoiceList; 