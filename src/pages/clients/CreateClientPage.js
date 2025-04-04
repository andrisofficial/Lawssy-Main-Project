import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
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
          {/* Page Title */}
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            Contact Information
          </Typography>

          {/* Client Form */}
          <ClientForm onSubmit={handleSubmit} mode="create" />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default CreateClientPage; 