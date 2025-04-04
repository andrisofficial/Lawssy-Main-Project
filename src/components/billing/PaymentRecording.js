import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Receipt as ReceiptIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const PaymentRecording = () => {
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: '',
    paymentDate: new Date(),
    paymentMethod: 'check',
    referenceNumber: '',
    notes: '',
    depositAccountType: 'operating'
  });
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch unpaid invoices and payment history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch invoices that aren't paid
        const invoiceResponse = await fetch('/api/invoices?status=Sent&status=Partial Payment&status=Overdue');
        if (!invoiceResponse.ok) {
          throw new Error('Failed to fetch invoices');
        }
        const invoiceData = await invoiceResponse.json();
        setInvoices(invoiceData);
        
        // Fetch payment history
        const paymentResponse = await fetch('/api/payments');
        if (!paymentResponse.ok) {
          throw new Error('Failed to fetch payment history');
        }
        const paymentData = await paymentResponse.json();
        setPayments(paymentData);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleOpenPaymentDialog = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentFormData({
      ...paymentFormData,
      amount: invoice.balanceDue
    });
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
  };

  const handlePaymentFormChange = (field, value) => {
    setPaymentFormData({
      ...paymentFormData,
      [field]: value
    });
  };

  const handleRecordPayment = async () => {
    if (!selectedInvoice) return;
    
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          invoiceId: selectedInvoice.id,
          clientId: selectedInvoice.clientId,
          amount: parseFloat(paymentFormData.amount),
          paymentDate: paymentFormData.paymentDate.toISOString(),
          paymentMethod: paymentFormData.paymentMethod,
          referenceNumber: paymentFormData.referenceNumber,
          notes: paymentFormData.notes,
          depositAccountType: paymentFormData.depositAccountType
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to record payment');
      }
      
      const data = await response.json();
      
      // Update the invoices and payments lists
      setInvoices(invoices.map(inv => 
        inv.id === data.invoice.id ? data.invoice : inv
      ).filter(inv => inv.status !== 'Paid')); // Remove paid invoices
      
      setPayments([data.payment, ...payments]);
      
      // Show success message
      setSuccessMessage(`Payment of ${formatCurrency(data.payment.amount)} has been recorded successfully.`);
      
      // Close dialog
      handleClosePaymentDialog();
      
      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (err) {
      setError(err.message);
    }
  };

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
      case 'Sent':
        return 'primary';
      case 'Partial Payment':
        return 'warning';
      case 'Overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (invoice.clientId && invoice.clientId.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Payment Recording</Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Unpaid Invoices Section */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Unpaid Invoices
            </Typography>
            
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
              sx={{ mb: 2 }}
            />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: 'grey.50' }}>
                    <TableRow>
                      <TableCell>Invoice #</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Balance Due</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
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
                          <TableCell>{formatCurrency(invoice.balanceDue)}</TableCell>
                          <TableCell>
                            <Chip 
                              label={invoice.status} 
                              color={getStatusColor(invoice.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleOpenPaymentDialog(invoice)}
                            >
                              Record Payment
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No unpaid invoices found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
        
        {/* Recent Payments Section */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, mb: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
              Recent Payments
            </Typography>
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {payments.length > 0 ? (
                  payments.slice(0, 10).map((payment, index) => (
                    <Box key={payment.id}>
                      <Box sx={{ py: 1.5 }}>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography variant="body2" fontWeight={500}>
                              {formatCurrency(payment.amount)} - {payment.invoiceId}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(payment.paymentDate)} • {payment.paymentMethod}
                              {payment.referenceNumber && ` • Ref: ${payment.referenceNumber}`}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      {index < payments.slice(0, 10).length - 1 && <Divider />}
                    </Box>
                  ))
                ) : (
                  <Typography align="center" variant="body2" sx={{ py: 2 }}>
                    No payment history found.
                  </Typography>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Payment Dialog */}
      <Dialog
        open={paymentDialogOpen}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
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
              
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={paymentFormData.amount}
                onChange={(e) => handlePaymentFormChange('amount', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Payment Date"
                  value={paymentFormData.paymentDate}
                  onChange={(date) => handlePaymentFormChange('paymentDate', date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: { mb: 2 }
                    }
                  }}
                />
              </LocalizationProvider>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={paymentFormData.paymentMethod}
                  label="Payment Method"
                  onChange={(e) => handlePaymentFormChange('paymentMethod', e.target.value)}
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="ach">ACH Transfer</MenuItem>
                  <MenuItem value="check">Check</MenuItem>
                  <MenuItem value="wire">Wire Transfer</MenuItem>
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="trust">Trust Account</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Reference Number"
                placeholder="Check #, Transaction ID, etc."
                value={paymentFormData.referenceNumber}
                onChange={(e) => handlePaymentFormChange('referenceNumber', e.target.value)}
                sx={{ mb: 2 }}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Deposit Account</InputLabel>
                <Select
                  value={paymentFormData.depositAccountType}
                  label="Deposit Account"
                  onChange={(e) => handlePaymentFormChange('depositAccountType', e.target.value)}
                >
                  <MenuItem value="operating">Operating Account</MenuItem>
                  <MenuItem value="trust">Trust Account</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={paymentFormData.notes}
                onChange={(e) => handlePaymentFormChange('notes', e.target.value)}
              />
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
            onClick={handleRecordPayment}
            startIcon={<CheckIcon />}
          >
            Record Payment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentRecording; 