import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import ClientForm from '../../components/clients/ClientForm';
import clientService from '../../services/clientService/clientService';

const CreateClientPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const newClient = await clientService.createClient(formData);
      console.log('Client created:', newClient);
      navigate(`/clients/${newClient.id}`);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
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
            <Typography color="text.primary">New Client</Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            Create New Client
          </Typography>

          {/* Client Form */}
          <ClientForm onSubmit={handleSubmit} mode="create" />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default CreateClientPage; 