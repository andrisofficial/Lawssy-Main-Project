import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  LinearProgress, 
  Alert, 
  Grid,
  IconButton,
  Tooltip,
  Paper,
  Link
} from '@mui/material';
import { 
  FileUpload as FileUploadIcon, 
  Download as DownloadIcon,
  Close as CloseIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import clientService from '../../services/clientService/clientService';

/**
 * ContactsImportExport component
 * Handles importing and exporting contacts for a client in CSV format
 */
const ContactsImportExport = ({ clientId, clientName, onContactsImported }) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [importResult, setImportResult] = useState(null);

  // Open/close import dialog
  const handleOpenImportDialog = () => setImportDialogOpen(true);
  const handleCloseImportDialog = () => {
    setImportDialogOpen(false);
    setImportFile(null);
    setProgress(0);
    setError(null);
    setImportResult(null);
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
      setError(null);
    } else {
      setImportFile(null);
      setError('Please select a valid CSV file');
    }
  };

  // Process CSV data
  const processCSVData = (csvContent) => {
    // Split the CSV content into lines
    const lines = csvContent.split('\n');
    if (lines.length <= 1) {
      throw new Error('CSV file is empty or has only headers');
    }

    // Parse the header row
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Required headers
    const requiredHeaders = ['first_name', 'email', 'phone'];
    
    // Check if all required headers are present
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        throw new Error(`CSV is missing required header: ${required}`);
      }
    }
    
    // Parse the contacts
    const contacts = [];
    for (let i = 1; i < lines.length; i++) {
      // Skip empty lines
      if (!lines[i].trim()) continue;
      
      const values = lines[i].split(',').map(v => v.trim());
      
      // Create a contact object
      const contact = {};
      headers.forEach((header, index) => {
        contact[header] = values[index] || '';
      });
      
      // Convert boolean fields
      if ('is_primary' in contact) contact.is_primary = contact.is_primary === 'true';
      if ('is_billing' in contact) contact.is_billing = contact.is_billing === 'true';
      
      // Simple validation - ensure we have all required fields
      if (!contact.first_name || !contact.email || !contact.phone) {
        throw new Error(`Row ${i} is missing required fields`);
      }
      
      // Process addresses
      if (contact.address_street && contact.address_city && contact.address_state && contact.address_zip) {
        contact.addresses = [{
          address_type: contact.address_type || 'Work',
          street: contact.address_street,
          street2: contact.address_street2 || '',
          city: contact.address_city,
          state: contact.address_state,
          zip: contact.address_zip,
          country: contact.address_country || 'United States',
          is_primary: true
        }];
      }
      
      // Remove processed address fields from the main contact object
      ['address_type', 'address_street', 'address_street2', 'address_city', 'address_state', 'address_zip', 'address_country'].forEach(field => {
        delete contact[field];
      });
      
      contacts.push(contact);
    }
    
    return contacts;
  };

  // Handle import
  const handleImport = async () => {
    if (!importFile) {
      setError('Please select a file to import');
      return;
    }
    
    setImportLoading(true);
    setProgress(0);
    setError(null);
    setImportResult(null);
    
    try {
      // Read the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csvContent = e.target.result;
          const contacts = processCSVData(csvContent);
          
          // Import the contacts one by one
          const results = {
            total: contacts.length,
            success: 0,
            failed: 0,
            errors: []
          };
          
          // Import each contact
          for (let i = 0; i < contacts.length; i++) {
            try {
              await clientService.createContact(clientId, contacts[i]);
              results.success++;
            } catch (err) {
              results.failed++;
              results.errors.push(`Row ${i+2}: ${err.message}`);
            }
            
            // Update progress
            setProgress(Math.round(((i + 1) / contacts.length) * 100));
          }
          
          // Set import result
          setImportResult(results);
          
          // Notify parent component if the callback is provided
          if (typeof onContactsImported === 'function') {
            onContactsImported();
          }
        } catch (err) {
          setError(`Error processing CSV: ${err.message}`);
        } finally {
          setImportLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading file');
        setImportLoading(false);
      };
      
      reader.readAsText(importFile);
    } catch (err) {
      setError(`Error importing contacts: ${err.message}`);
      setImportLoading(false);
    }
  };

  // Handle export
  const handleExport = async () => {
    setExportLoading(true);
    setError(null);
    
    try {
      // Fetch contacts
      const contacts = await clientService.getClientContacts(clientId);
      
      if (contacts.length === 0) {
        setError('No contacts to export');
        setExportLoading(false);
        return;
      }
      
      // Create CSV headers
      const headers = [
        'first_name', 
        'last_name', 
        'email', 
        'phone', 
        'role',
        'is_primary',
        'is_billing',
        'notes',
        'address_type',
        'address_street',
        'address_street2',
        'address_city',
        'address_state',
        'address_zip',
        'address_country'
      ];
      
      // Create CSV rows
      const rows = contacts.map(contact => {
        const row = {
          first_name: contact.first_name,
          last_name: contact.last_name || '',
          email: contact.email,
          phone: contact.phone || '',
          role: contact.role || '',
          is_primary: contact.is_primary ? 'true' : 'false',
          is_billing: contact.is_billing ? 'true' : 'false',
          notes: (contact.notes || '').replace(/,/g, ';').replace(/\n/g, ' ')
        };
        
        // Add address if available
        if (contact.addresses && contact.addresses.length > 0) {
          const primaryAddress = contact.addresses.find(a => a.is_primary) || contact.addresses[0];
          row.address_type = primaryAddress.address_type;
          row.address_street = primaryAddress.street;
          row.address_street2 = primaryAddress.street2 || '';
          row.address_city = primaryAddress.city;
          row.address_state = primaryAddress.state;
          row.address_zip = primaryAddress.zip;
          row.address_country = primaryAddress.country;
        } else {
          // Empty address fields
          row.address_type = '';
          row.address_street = '';
          row.address_street2 = '';
          row.address_city = '';
          row.address_state = '';
          row.address_zip = '';
          row.address_country = '';
        }
        
        return headers.map(header => row[header] || '').join(',');
      });
      
      // Create CSV content
      const csvContent = [headers.join(','), ...rows].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${clientName.replace(/\s+/g, '_')}_contacts.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Error exporting contacts: ${err.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Import/Export Contacts
        </Typography>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Tooltip title="Import contacts from CSV">
              <Button 
                variant="outlined" 
                startIcon={<FileUploadIcon />}
                onClick={handleOpenImportDialog}
                disabled={exportLoading}
              >
                Import
              </Button>
            </Tooltip>
          </Grid>
          
          <Grid item>
            <Tooltip title="Export contacts to CSV">
              <Button 
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                disabled={importLoading || exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export'}
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={!importLoading ? handleCloseImportDialog : undefined}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Import Contacts for {clientName}
            {!importLoading && (
              <IconButton aria-label="close" onClick={handleCloseImportDialog} size="small">
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {importResult ? (
            <Box sx={{ mt: 2 }}>
              <Alert severity={importResult.failed > 0 ? 'warning' : 'success'}>
                Import completed: {importResult.success} contacts imported successfully, {importResult.failed} failed.
              </Alert>
              
              {importResult.errors.length > 0 && (
                <Box sx={{ mt: 2, maxHeight: 200, overflow: 'auto' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Error details:
                  </Typography>
                  {importResult.errors.map((errorMsg, index) => (
                    <Typography key={index} variant="body2" color="error" sx={{ mt: 0.5 }}>
                      • {errorMsg}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                CSV File Requirements:
              </Typography>
              <Typography variant="body2" paragraph>
                • First row must contain headers: first_name, email, phone (required), last_name, role, etc.
              </Typography>
              <Typography variant="body2" paragraph>
                • Each contact must have at least first_name, email, and phone.
              </Typography>
              <Typography variant="body2" paragraph>
                • Address fields: address_type, address_street, address_city, address_state, address_zip, address_country.
              </Typography>
              
              <Box sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                <Link href="/sample_contacts_import.csv" download target="_blank" rel="noopener">
                  Download sample CSV template
                </Link>
              </Box>
              
              <Box sx={{ my: 3 }}>
                <input
                  accept=".csv"
                  style={{ display: 'none' }}
                  id="import-file"
                  type="file"
                  onChange={handleFileChange}
                  disabled={importLoading}
                />
                <label htmlFor="import-file">
                  <Button
                    variant="contained"
                    component="span"
                    disabled={importLoading}
                  >
                    Select CSV File
                  </Button>
                </label>
                {importFile && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Selected file: {importFile.name}
                  </Typography>
                )}
              </Box>
              
              {importLoading && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={progress} />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {progress}% Complete
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions>
          {importResult ? (
            <Button onClick={handleCloseImportDialog} color="primary">
              Close
            </Button>
          ) : (
            <>
              <Button onClick={handleCloseImportDialog} disabled={importLoading}>
                Cancel
              </Button>
              <Button 
                onClick={handleImport} 
                color="primary" 
                disabled={!importFile || importLoading}
              >
                {importLoading ? 'Importing...' : 'Import'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactsImportExport; 