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
import caseService from '../../services/caseService/caseService';

// Custom TabPanel component for tabbed content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`case-tabpanel-${index}`}
      aria-labelledby={`case-tab-${index}`}
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

const CaseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch case data on component mount
  useEffect(() => {
    const fetchCase = async () => {
      try {
        setLoading(true);
        const data = await caseService.getCaseById(id);
        setCaseData(data);
      } catch (error) {
        console.error('Error fetching case:', error);
        setError('Failed to load case details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCase();
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
      await caseService.archiveCase(id);
      // Refresh case data
      const updatedCase = await caseService.getCaseById(id);
      setCaseData(updatedCase);
      setArchiveDialogOpen(false);
    } catch (error) {
      console.error('Error archiving case:', error);
      setError('Failed to archive case. Please try again later.');
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
      await caseService.deleteCase(id);
      navigate('/cases');
    } catch (error) {
      console.error('Error deleting case:', error);
      setError('Failed to delete case. Please try again later.');
      setDeleteDialogOpen(false);
    }
  };

  // Helper function to get case name
  const getCaseName = () => {
    if (!caseData) return '';
    return caseData.title || caseData.case_number || 'Untitled Case';
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
            <MuiLink component={Link} to="/cases" underline="hover" color="inherit">
              Cases
            </MuiLink>
            <Typography color="text.primary">
              {loading ? 'Loading...' : getCaseName()}
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
          ) : caseData ? (
            <>
              {/* Case Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                <Box>
                  <Typography variant="h4" component="h1">
                    {getCaseName()}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip
                      label={caseData.case_type || 'Not Specified'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {caseData.status && (
                      <Chip
                        label={caseData.status.name}
                        size="small"
                        sx={{ 
                          bgcolor: caseData.status.color || 'grey.500',
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
                    to={`/cases/${id}/edit`}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<ArchiveIcon />}
                    onClick={handleArchiveDialogOpen}
                    disabled={caseData.status?.name === 'Archived'}
                  >
                    Archive
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteDialogOpen}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>

              {/* Case Details */}
              <Paper sx={{ mb: 3 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} aria-label="case tabs">
                    <Tab label="Overview" id="case-tab-0" aria-controls="case-tabpanel-0" />
                    <Tab label="Documents" id="case-tab-1" aria-controls="case-tabpanel-1" />
                    <Tab label="Timeline" id="case-tab-2" aria-controls="case-tabpanel-2" />
                    <Tab label="Notes" id="case-tab-3" aria-controls="case-tabpanel-3" />
                  </Tabs>
                </Box>

                {/* Overview Tab */}
                <TabPanel value={tabValue} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Case Information</Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Case Number</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>{caseData.case_number || 'N/A'}</Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Case Type</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>{caseData.case_type || 'Not specified'}</Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Status</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Chip 
                              label={caseData.status?.name || 'Unknown'} 
                              size="small" 
                              sx={{ 
                                bgcolor: caseData.status?.color || 'grey.500',
                                color: 'white'
                              }}
                            />
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Client</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>
                              {caseData.client_name || 'No client assigned'}
                              {caseData.client_id && (
                                <MuiLink 
                                  component={Link} 
                                  to={`/clients/${caseData.client_id}`}
                                  sx={{ ml: 1, fontSize: '0.8rem' }}
                                >
                                  (View Client)
                                </MuiLink>
                              )}
                            </Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Filed Date</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>
                              {caseData.filed_date 
                                ? new Date(caseData.filed_date).toLocaleDateString() 
                                : 'Not filed yet'}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Created On</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>
                              {new Date(caseData.created_at).toLocaleDateString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" sx={{ mb: 2 }}>Additional Details</Typography>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Attorney</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>{caseData.attorney_name || 'Not assigned'}</Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Court</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>{caseData.court_name || 'N/A'}</Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Judge</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>{caseData.judge_name || 'N/A'}</Typography>
                          </Grid>

                          <Grid item xs={4}>
                            <Typography variant="subtitle2">Opposing Counsel</Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography>{caseData.opposing_counsel || 'N/A'}</Typography>
                          </Grid>
                        </Grid>
                      </Paper>

                      {caseData.description && (
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="h6" sx={{ mb: 2 }}>Case Description</Typography>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography>{caseData.description}</Typography>
                          </Paper>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                </TabPanel>

                {/* Documents Tab */}
                <TabPanel value={tabValue} index={1}>
                  <Typography variant="body1">
                    Documents tab content will be implemented here.
                  </Typography>
                </TabPanel>

                {/* Timeline Tab */}
                <TabPanel value={tabValue} index={2}>
                  <Typography variant="body1">
                    Timeline tab content will be implemented here.
                  </Typography>
                </TabPanel>

                {/* Notes Tab */}
                <TabPanel value={tabValue} index={3}>
                  <Typography variant="body1">
                    Notes tab content will be implemented here.
                  </Typography>
                </TabPanel>
              </Paper>
            </>
          ) : (
            <Alert severity="warning">
              Case not found. The case may have been deleted or you don't have permission to view it.
            </Alert>
          )}
        </Box>
      </Container>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={archiveDialogOpen}
        onClose={handleArchiveDialogClose}
      >
        <DialogTitle>Archive Case</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to archive this case? Archived cases will be hidden from regular views but can be accessed through the archive filter.
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
        <DialogTitle>Delete Case</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently delete this case? This action cannot be undone and all case data will be lost.
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

export default CaseDetailPage; 