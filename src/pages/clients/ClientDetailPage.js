import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  Edit as EditIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import MainLayout from '../../components/layout/MainLayout';
import clientService from '../../services/clientService/clientService';
import ContactsManager from '../../components/clients/ContactsManager';
import ClientCases from '../../components/clients/ClientCases';

// Custom TabPanel component for tabbed content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`client-tabpanel-${index}`}
      aria-labelledby={`client-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch client data on component mount
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const data = await clientService.getClientById(id);
        setClient(data);
      } catch (error) {
        console.error('Error fetching client:', error);
        setError('Failed to load client details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClient();
    }
  }, [id]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle archive dialog
  const handleArchiveDialogOpen = () => {
    setArchiveDialogOpen(true);
  };

  const handleArchiveDialogClose = () => {
    setArchiveDialogOpen(false);
  };

  const handleArchiveConfirm = async () => {
    try {
      await clientService.archiveClient(id);
      // Refresh client data
      const updatedClient = await clientService.getClientById(id);
      setClient(updatedClient);
      setArchiveDialogOpen(false);
    } catch (error) {
      console.error('Error archiving client:', error);
      setError('Failed to archive client. Please try again later.');
      setArchiveDialogOpen(false);
    }
  };

  // Handle delete dialog
  const handleDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await clientService.deleteClient(id);
      navigate('/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
      setError('Failed to delete client. Please try again later.');
      setDeleteDialogOpen(false);
    }
  };

  // Helper function to get client full name or organization name
  const getClientName = () => {
    if (!client) return '';
    
    if (client.client_type === 'Individual') {
      return `${client.first_name} ${client.last_name || ''}`.trim();
    }
    return client.organization_name;
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink component={Link} to="/dashboard" underline="hover" color="inherit">
              Dashboard
            </MuiLink>
            <MuiLink component={Link} to="/clients" underline="hover" color="inherit">
              Clients
            </MuiLink>
            <Typography color="text.primary">
              {loading ? 'Loading...' : getClientName()}
            </Typography>
          </Breadcrumbs>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : client ? (
            <>
              {/* Client Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h4" component="h1">
                    {getClientName()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip
                      label={client.client_type}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {client.status && (
                      <Chip
                        label={client.status.name}
                        size="small"
                        sx={{ 
                          bgcolor: client.status.color || 'grey.500',
                          color: 'white'
                        }}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    component={Link}
                    to={`/clients/${id}/edit`}
                  >
                    Edit
                  </Button>
                  {!client.is_archived ? (
                    <Button
                      variant="outlined"
                      color="warning"
                      startIcon={<ArchiveIcon />}
                      onClick={handleArchiveDialogOpen}
                    >
                      Archive
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleDeleteDialogOpen}
                    >
                      Delete
                    </Button>
                  )}
                </Box>
              </Box>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="client tabs">
                  <Tab label="Overview" id="client-tab-0" />
                  <Tab label="Contacts" id="client-tab-1" />
                  <Tab label="Cases" id="client-tab-2" />
                  <Tab label="Status History" id="client-tab-3" />
                </Tabs>
              </Box>

              {/* Overview Tab */}
              <TabPanel value={tabValue} index={0}>
                <Paper sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Basic Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    {client.client_type === 'Individual' ? (
                      <>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            First Name
                          </Typography>
                          <Typography variant="body1">
                            {client.first_name || 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Last Name
                          </Typography>
                          <Typography variant="body1">
                            {client.last_name || 'N/A'}
                          </Typography>
                        </Grid>
                      </>
                    ) : (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Organization Name
                        </Typography>
                        <Typography variant="body1">
                          {client.organization_name || 'N/A'}
                        </Typography>
                      </Grid>
                    )}

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Email Address
                      </Typography>
                      <Typography variant="body1">
                        {client.primary_email || 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone Number
                      </Typography>
                      <Typography variant="body1">
                        {client.primary_phone || 'N/A'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Notes
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {client.notes || 'No notes available.'}
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                        System Information
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Date Added
                      </Typography>
                      <Typography variant="body1">
                        {new Date(client.date_added).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {new Date(client.updated_at).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </TabPanel>

              {/* Contacts Tab - Using the ContactsManager component */}
              <TabPanel value={tabValue} index={1}>
                <Paper sx={{ p: 3 }}>
                  <ContactsManager 
                    clientId={client.id}
                    clientName={getClientName()}
                    initialContacts={client.contacts || []}
                  />
                </Paper>
              </TabPanel>

              {/* Cases Tab - Using the ClientCases component */}
              <TabPanel value={tabValue} index={2}>
                <Paper sx={{ p: 3 }}>
                  <ClientCases 
                    clientId={client.id}
                    clientName={getClientName()}
                  />
                </Paper>
              </TabPanel>

              {/* Status History Tab - Will be implemented in Phase 4 */}
              <TabPanel value={tabValue} index={3}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="body1" align="center" color="text.secondary">
                    Status history tracking will be implemented in Phase 4.
                  </Typography>
                </Paper>
              </TabPanel>
            </>
          ) : (
            <Alert severity="warning">
              Client not found. The client may have been deleted or you don't have permission to view it.
            </Alert>
          )}
        </Box>
      </Container>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={archiveDialogOpen}
        onClose={handleArchiveDialogClose}
      >
        <DialogTitle>Archive Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to archive this client? Archived clients won't appear in the default client list, but their data will be preserved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleArchiveDialogClose}>Cancel</Button>
          <Button onClick={handleArchiveConfirm} color="warning">Archive</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this client? This action cannot be undone and all client data will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ClientDetailPage; 