import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import { formatCurrency } from '../../utils/timeUtils';

const InvoiceGenerator = ({ timeEntries, client, matter }) => {
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [invoiceDetails, setInvoiceDetails] = useState({
    invoiceNumber: '',
    dueDate: '',
    notes: '',
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSelectEntry = (entryId) => {
    setSelectedEntries((prev) =>
      prev.includes(entryId)
        ? prev.filter((id) => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleSelectAll = () => {
    setSelectedEntries(
      selectedEntries.length === timeEntries.length
        ? []
        : timeEntries.map((entry) => entry.id)
    );
  };

  const calculateTotal = () => {
    return timeEntries
      .filter((entry) => selectedEntries.includes(entry.id))
      .reduce((sum, entry) => sum + entry.amount, 0);
  };

  const handleGenerateInvoice = () => {
    // TODO: Implement invoice generation logic
    console.log('Generating invoice...', {
      selectedEntries,
      invoiceDetails,
      total: calculateTotal(),
    });
  };

  const InvoicePreview = () => (
    <Dialog
      open={previewOpen}
      onClose={() => setPreviewOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Invoice Preview</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography variant="h6">{client?.name}</Typography>
              <Typography>{client?.address}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h6">Invoice #{invoiceDetails.invoiceNumber}</Typography>
              <Typography>Due Date: {invoiceDetails.dueDate}</Typography>
            </Grid>
          </Grid>

          <TableContainer sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Hours</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {timeEntries
                  .filter((entry) => selectedEntries.includes(entry.id))
                  .map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.hours}</TableCell>
                      <TableCell>{formatCurrency(entry.rate)}</TableCell>
                      <TableCell align="right">
                        {formatCurrency(entry.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow>
                  <TableCell colSpan={4} align="right">
                    <strong>Total</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>{formatCurrency(calculateTotal())}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Notes</Typography>
            <Typography>{invoiceDetails.notes}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        <Button variant="contained" onClick={handleGenerateInvoice}>
          Generate Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Generate Invoice
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Invoice Number"
            value={invoiceDetails.invoiceNumber}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
                invoiceNumber: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            type="date"
            label="Due Date"
            InputLabelProps={{ shrink: true }}
            value={invoiceDetails.dueDate}
            onChange={(e) =>
              setInvoiceDetails({ ...invoiceDetails, dueDate: e.target.value })
            }
          />
        </Grid>
      </Grid>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedEntries.length === timeEntries.length}
                  indeterminate={
                    selectedEntries.length > 0 &&
                    selectedEntries.length < timeEntries.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeEntries.map((entry) => (
              <TableRow
                key={entry.id}
                selected={selectedEntries.includes(entry.id)}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedEntries.includes(entry.id)}
                    onChange={() => handleSelectEntry(entry.id)}
                  />
                </TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.description}</TableCell>
                <TableCell>{entry.hours}</TableCell>
                <TableCell>{formatCurrency(entry.rate)}</TableCell>
                <TableCell align="right">{formatCurrency(entry.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Invoice Notes"
          value={invoiceDetails.notes}
          onChange={(e) =>
            setInvoiceDetails({ ...invoiceDetails, notes: e.target.value })
          }
        />
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Typography variant="h6">
          Total: {formatCurrency(calculateTotal())}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<PreviewIcon />}
          onClick={() => setPreviewOpen(true)}
        >
          Preview
        </Button>
        <Button variant="contained" onClick={handleGenerateInvoice}>
          Generate Invoice
        </Button>
      </Box>

      <InvoicePreview />
    </Paper>
  );
};

export default InvoiceGenerator; 