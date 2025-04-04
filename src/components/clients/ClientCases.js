import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import {
  Add as AddIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon
} from '@mui/icons-material';
import clientService from '../../services/clientService/clientService';
import LinkCaseDialog from './LinkCaseDialog';
import EditCaseAssociationDialog from './EditCaseAssociationDialog';

// Client roles in cases
const CLIENT_ROLES = {
  plaintiff: 'Plaintiff',
  defendant: 'Defendant',
  petitioner: 'Petitioner',
  respondent: 'Respondent',
  appellant: 'Appellant',
  appellee: 'Appellee',
  witness: 'Witness',
  expert: 'Expert Witness',
  guardian: 'Guardian',
  interested_party: 'Interested Party',
  other: 'Other'
};

const ClientCases = ({ clientId, clientName }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [unlinkDialogOpen, setUnlinkDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedAssociation, setSelectedAssociation] = useState(null);
  const [associationLoading, setAssociationLoading] = useState(false);

  // Load client cases on component mount
  useEffect(() => {
    loadClientCases();
  }, [clientId]);

  const loadClientCases = async () => {
    setLoading(true);
    setError('');
    try {
      const clientCases = await clientService.getClientCases(clientId);
      setCases(clientCases);
    } catch (err) {
      console.error('Error loading client cases:', err);
      setError('Failed to load cases. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the link case dialog
  const handleOpenLinkDialog = () => {
    setLinkDialogOpen(true);
  };

  // Handle closing the link case dialog
  const handleCloseLinkDialog = () => {
    setLinkDialogOpen(false);
  };

  // Handle link case form submission
  const handleLinkCaseSubmit = async (data) => {
    setAssociationLoading(true);
    try {
      await clientService.associateClientWithCase(
        clientId,
        data.caseId,
        data.associationData
      );
      
      // Refresh the cases list
      await loadClientCases();
      setLinkDialogOpen(false);
    } catch (err) {
      console.error('Error linking case:', err);
      setError('Failed to link case. Please try again.');
    } finally {
      setAssociationLoading(false);
    }
  };

  // Handle opening the edit association dialog
  const handleOpenEditDialog = (caseData, associationData) => {
    setSelectedCase(caseData);
    setSelectedAssociation(associationData);
    setEditDialogOpen(true);
  };

  // Handle closing the edit association dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedCase(null);
    setSelectedAssociation(null);
  };

  // Handle edit association form submission
  const handleEditAssociationSubmit = async (data) => {
    setAssociationLoading(true);
    try {
      await clientService.updateClientCaseAssociation(
        data.associationId,
        data.associationData
      );
      
      // Refresh the cases list
      await loadClientCases();
      setEditDialogOpen(false);
    } catch (err) {
      console.error('Error updating association:', err);
      setError('Failed to update case association. Please try again.');
    } finally {
      setAssociationLoading(false);
    }
  };

  // Handle opening the unlink case dialog
  const handleOpenUnlinkDialog = (caseData, associationData) => {
    setSelectedCase(caseData);
    setSelectedAssociation(associationData);
    setUnlinkDialogOpen(true);
  };

  // Handle closing the unlink case dialog
  const handleCloseUnlinkDialog = () => {
    setUnlinkDialogOpen(false);
    setSelectedCase(null);
    setSelectedAssociation(null);
  };

  // Handle unlinking a case
  const handleRemoveAssociation = async () => {
    if (!selectedAssociation) return;
    
    setAssociationLoading(true);
    try {
      await clientService.removeClientCaseAssociation(selectedAssociation.id);
      
      // Refresh the cases list
      await loadClientCases();
      setUnlinkDialogOpen(false);
    } catch (err) {
      console.error('Error removing association:', err);
      setError('Failed to unlink case. Please try again.');
    } finally {
      setAssociationLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" component="h2">
          Cases for {clientName}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenLinkDialog}
        >
          Link Case
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : cases.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No cases associated with this client yet. Click "Link Case" to associate a case.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Case Number</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Client Role</TableCell>
                <TableCell>Is Primary</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.association.id}>
                  <TableCell>{caseItem.case_number}</TableCell>
                  <TableCell>{caseItem.title || 'Untitled Case'}</TableCell>
                  <TableCell>
                    {caseItem.status && (
                      <Chip
                        label={caseItem.status.name}
                        size="small"
                        sx={{
                          bgcolor: caseItem.status.color || 'grey.500',
                          color: 'white'
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {CLIENT_ROLES[caseItem.association.role] || caseItem.association.role}
                  </TableCell>
                  <TableCell>
                    {caseItem.association.is_primary ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="View Case">
                        <IconButton 
                          component={Link} 
                          to={`/cases/${caseItem.id}`}
                          size="small"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Association">
                        <IconButton 
                          onClick={() => handleOpenEditDialog(caseItem, caseItem.association)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Unlink Case">
                        <IconButton 
                          onClick={() => handleOpenUnlinkDialog(caseItem, caseItem.association)}
                          size="small"
                          color="error"
                        >
                          <LinkOffIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Link Case Dialog */}
      <LinkCaseDialog
        open={linkDialogOpen}
        onClose={handleCloseLinkDialog}
        onSubmit={handleLinkCaseSubmit}
        clientId={clientId}
        clientName={clientName}
        loading={associationLoading}
      />

      {/* Edit Association Dialog */}
      {selectedCase && selectedAssociation && (
        <EditCaseAssociationDialog
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
          onSubmit={handleEditAssociationSubmit}
          clientName={clientName}
          caseData={selectedCase}
          associationData={selectedAssociation}
          loading={associationLoading}
        />
      )}

      {/* Unlink Case Confirmation Dialog */}
      <Dialog
        open={unlinkDialogOpen}
        onClose={handleCloseUnlinkDialog}
      >
        <DialogTitle>Unlink Case</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unlink this case from {clientName}? This action will remove the association between the client and the case.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUnlinkDialog}>Cancel</Button>
          <Button 
            onClick={handleRemoveAssociation} 
            color="error"
            disabled={associationLoading}
          >
            {associationLoading ? <CircularProgress size={24} /> : 'Unlink'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientCases; 