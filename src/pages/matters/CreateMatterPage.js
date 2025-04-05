import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import MainLayout from '../../components/layout/MainLayout';
import NewMatterForm from '../../components/matters/NewMatterForm';

const CreateMatterPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      // Here you would call your matters service to create the matter
      console.log('Matter created:', formData);
      
      // Navigate to matters list after successful creation
      // In a real implementation, you'd navigate to the created matter detail page
      navigate('/matters');
    } catch (error) {
      console.error('Error creating matter:', error);
      throw error;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          {/* Page Title */}
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            Create New Matter
          </Typography>

          {/* Matter Form */}
          <NewMatterForm onSubmit={handleSubmit} />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default CreateMatterPage; 