import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert
} from '@mui/material';
import MainLayout from '../../components/layout/MainLayout';
import ClientForm from '../../components/clients/ClientForm';
import clientService from '../../services/clientService/clientService';

const EditClientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      const updatedClient = await clientService.updateClient(id, formData);
      console.log('Client updated:', updatedClient);
      navigate(`/clients/${id}`);
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  // Helper function to get client name for breadcrumbs
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
            <MuiLink 
              component={Link} 
              to={`/clients/${id}`} 
              underline="hover" 
              color="inherit"
            >
              {loading ? 'Loading...' : getClientName()}
            </MuiLink>
            <Typography color="text.primary">Edit</Typography>
          </Breadcrumbs>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Page Title */}
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            Edit Client: {loading ? '...' : getClientName()}
          </Typography>

          {/* Client Form or Loading State */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <CircularProgress />
            </Box>
          ) : client ? (
            <ClientForm 
              client={client} 
              onSubmit={handleSubmit} 
              mode="edit" 
            />
          ) : (
            <Alert severity="warning">
              Client not found. The client may have been deleted or you don't have permission to edit it.
            </Alert>
          )}
        </Box>
      </Container>
    </MainLayout>
  );
};

export default EditClientPage; 