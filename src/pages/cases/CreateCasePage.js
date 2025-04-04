import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import CaseForm from '../../components/cases/CaseForm';
import caseService from '../../services/caseService/caseService';

const CreateCasePage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const newCase = await caseService.createCase(formData);
      console.log('Case created:', newCase);
      navigate(`/cases/${newCase.id}`);
    } catch (error) {
      console.error('Error creating case:', error);
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
            <MuiLink component={Link} to="/cases" underline="hover" color="inherit">
              Cases
            </MuiLink>
            <Typography color="text.primary">New Case</Typography>
          </Breadcrumbs>

          {/* Page Title */}
          <Typography variant="h4" component="h1" sx={{ mb: 4 }}>
            Create New Case
          </Typography>

          {/* Case Form */}
          <CaseForm onSubmit={handleSubmit} mode="create" />
        </Box>
      </Container>
    </MainLayout>
  );
};

export default CreateCasePage; 